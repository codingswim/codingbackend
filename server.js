const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });  // 共用同一个 HTTP 服务器

// 存储所有连接的 WebSocket 客户端
const clients = new Set();

// WebSocket 连接处理
wss.on('connection', (ws) => {
  console.log('✅ WebSocket 客户端已连接');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('收到客户端消息:', message.toString());
  });

  ws.on('close', () => {
    console.log('❌ WebSocket 客户端已断开');
    clients.delete(ws);
  });
});

// 广播告警消息给所有客户端
function broadcastAlert(alertData) {
  const message = JSON.stringify({
    type: 'alert',
    timestamp: new Date().toISOString(),
    ...alertData
  });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// REST API：接收告警并推送
app.use(express.json());
app.post('/api/alert', (req, res) => {
  const { title, message, severity = 'info' } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: '缺少 title 或 message' });
  }

  const alertData = { title, message, severity };
  broadcastAlert(alertData);

  res.json({ success: true, alert: alertData });
});

// 健康检查端点（Render 推荐）
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 可选：提供一个简单的 WebSocket 测试页面
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>WebSocket 告警服务已运行</h2>
        <p>WebSocket 端点: wss://你的服务名.onrender.com</p>
        <p>告警推送 API: POST /api/alert</p>
      </body>
    </html>
  `);
});

// 启动服务器：使用 Render 分配的端口
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ HTTP & WebSocket 服务器运行在端口 ${PORT}`);
});
const { Server } = require('socket.io')
const { handleNumGenerator } = require('./src/numGenerator')
const { handleChatRoom } = require('./src/chatRoom')

const io = new Server(3000, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('客户端连接：', socket.id)

  // 处理随机数生成和推送
  handleNumGenerator(socket)

  // 处理聊天室功能
  handleChatRoom(socket, io)

  socket.on('disconnect', () => {
    console.log('断开连接：', socket.id)
  })
})

console.log('socket 服务启动：http://localhost:3000')
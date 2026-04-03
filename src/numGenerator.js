// 模拟随机数数据 0-60以内的
function getNum() {
  return Math.round(Math.random() * 60)
}

// 处理随机数生成和推送功能
function handleNumGenerator(socket) {
  // 连接成功立刻推送一次
  socket.emit('num', getNum())

  const timer = setInterval(() => {
    socket.emit('num', getNum())
  }, 3000)

  socket.on('disconnect', () => {
    clearInterval(timer)
  })
}

module.exports = {
  handleNumGenerator
}
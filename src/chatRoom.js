// 处理聊天室功能
function handleChatRoom(socket, io) {
  // 处理用户发送的消息
  socket.on('chat message', (msg) => {
    console.log('收到消息:', msg)
    // 广播消息给所有客户端
    io.emit('chat message', msg)
  })

  // 处理用户加入事件
  socket.on('join', (username) => {
    console.log(`${username} 加入了聊天室`)
    // 广播用户加入消息
    io.emit('user joined', username)
  })

  // 处理用户离开事件
  socket.on('disconnect', () => {
    console.log('用户离开了聊天室')
    // 广播用户离开消息
    io.emit('user left')
  })
}

module.exports = {
  handleChatRoom
}
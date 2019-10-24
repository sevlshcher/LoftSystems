module.exports = io => {
  const connections = new Set();

  io.on('connection', socket => {
    
    socket.on('users:connect', user => {
      const userData = {id: socket.id, username: user.username};
      connections.add(userData);
      socket.json.emit('users:list', [...connections]);
      socket.broadcast.emit('users:add', userData);
      console.log(userData)

      socket.on('message:add', data => {
        socket.json.emit('message:add', {
          senderId: data.senderId,
          text: `Me: ${data.text}`
        });
        socket.broadcast.to(data.roomId).json.emit('message:add', {
          senderId: socket.id,
          text: data.text
        });
      });

      socket.on('disconnect', data => {
        socket.broadcast.emit('users:leave', userData.id);
        connections.delete(userData);
      });
    });
  });
};
module.exports = io => {
  const connections = {};

  io.on('connection', socket => {
    socket.on('users:connect', user => {
      // users[socket.id] = {};
      const userData = {id: socket.id, username: user.username};
      connections[socket.id] = userData;
      socket.json.emit('users:list', Object.values(connections));
      socket.broadcast.emit('users:add', userData);
    });
    // // событие когда пользователь уходит из комнаты
    // socket.on('users:leave', roomId => {
    //   // запоминаем старую комнату пользователя
    //   const oldRoom = roomId;
    //   // меняем комнаты у пользователя
    //   socket.leave(oldRoom);
    //   // сообщаем в старую комнату, что пользователь ее покинул
    //   socket.broadcast.to(oldRoom).json.emit('message:add', {
    //     senderId: 'System',
    //     roomId: oldRoom,
    //     text: `<i>${userData.username} покинул комнату</i>`
    //   });
    //   // в старой комнате формируем новый список пользователей комнаты другим
    //   // пользователям
    //   socket.broadcast.to(oldRoom).emit('users:list', Object.values(connections));
    // });
    // событие когда пользователь заходит в новую комнату
    // socket.on('users:add', newroom => {
    //   socket.join(newroom);
    //   // сообщаем пользователю в какую комнату он попал
    //   socket.json.emit('message:add', {
    //     senderId: 'System',
    //     roomId: newroom,
    //     text: `<i>Вы попали в комнату к ${connections[socket.id].username}</i>`
    //   });
    //   // у пользоваталея формируем новый список пользователей комнаты
    //   socket.emit('users:list', Object.values(connections));
    //   // сообщаем в новую комнату, что зашел новый пользователь
    //   socket.broadcast.to(newroom).json.emit('message:add', {
    //     senderId: 'System',
    //     roomId: newroom,
    //     text: `<i>${connections[socket.id].username} присоединился к комнате</i>`
    //   });
    //   // в новой комнате формируем новый список пользователей комнаты другим
    //   // пользователям
    //   socket.broadcast.to(newroom).emit('users:list', Object.values(connections));
    // });

    // обрабатываем событие когда пользователь, что-то написал в чат
    socket.on('message:add', data => {
      // возвращаем пользователю то, что он написал обратно
      socket.json.emit('message:add', {
        senderId: data.senderId,
        roomId: data.roomId,
        text: `Me: ${data.text}`
      });
      // сообщаем всем пользователям комнаты, что написал пользователь
      socket.broadcast.to(data.roomId).json.emit('message:add', {
        senderId: socket.id,
        roomId: data.roomId,
        text: `${connections[socket.id].username}: ${data.text}`
      });
    });



    
    socket.on('disconnect', data => {
      // // запоминаем текущую комнату пользователя
      // let room = socket.id;
      // // покидаем комнату
      // socket.leave(room);
      // // сообащем в комнату, что пользователь ушел с чата
      // socket.broadcast.to(room).json.emit('message:add', {
      //   senderId: 'System',
      //   roomId: room,
      //   text: `<i>${users[socket.id]} покинул чат</i>`
      // });
      // в команте обновляем список пользователей на клиенте
      socket.broadcast.emit('users:leave', connections[socket.id]);
      // удаляем пользователя
      delete connections[socket.id];
    });
  });
};
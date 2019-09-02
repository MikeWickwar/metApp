var _s
require("jquery");
/**
 * Called upon a client connection, insert the user
 */
Streamy.onConnect(function(socket) {
  console.log("streamy on connect fired!")
  Clients.insert({
    'sid': Streamy.id(socket)
  });
  console.log("Clients instered!", Clients)

});

/**
 * Upon disconnect, clear the client database
 */
Streamy.onDisconnect(function(socket) {
  console.log("streamy on disconnect fired!")

  Clients.remove({
    'sid': Streamy.id(socket)
  });

  // Inform the lobby
  Streamy.broadcast('__leave__', {
    'sid': Streamy.id(socket),
    'room': 'lobby'
  });
});

/**
 * When the nick is set by the client, update the collection accordingly
 */
Streamy.on('hello', function(data, from) {
  console.log('hello streamy hit', data.userId)
  if(!data.userId)
    throw new Meteor.Error('Empty userId');

  var currentRoom  = Rooms.find({'roomName': data.room})
  _s = Streamy.id(data.room);
  console.log("_s set!!!!!!!!!!!!!!!!!", data.room, _s)
  Clients.update({
    'sid': Streamy.id(from)
  }, {
    $set: { 'userId': data.userId, 'room': data.room }
  });


  if (currentRoom.length === 0) {
    Rooms.insert({
      'sid': Streamy.id(from),
      'roomName': data.room
    })
  }else{
    // Rooms.update({
    //   'sid': Streamy.id(from)
    // }, {
    //   $set: { 'userId': data.userId, 'roomName': data.room }
    // });
  }

  // Inform the room
  Streamy.broadcast('__join__', {
    'sid': Streamy.id(from),
    'userId': data.userId,
    'room': data.room
  });


});
//listener on server for messages to broadcast to other users
Streamy.on('sendText', function(data, from) {
  console.log("Message Being Sent: Now broadcasting to all users", Streamy.id(from), data.room)
 
  Streamy.broadcast(data.room, data, from);
})

/**
 * Only publish clients with not empty nick
 */
Meteor.publish('clients', function() {
  return Clients.find({
    'userId': { $ne: null }
  });
});

/**
 * Publish rooms where the user appears
 * @param  {String} sid) Client id
 */
Meteor.publish('rooms', function(sid) {
  if(!sid)
    return this.error(new Meteor.Error('sid null'));
    log.info(Streamy)
  return Streamy.Rooms.allForSession(sid);
});

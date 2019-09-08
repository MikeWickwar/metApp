var _s
var _interval;
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
  console.log("_s set!!!!!!!!!!!!!!!!!")
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

//listener on server for start click to broadcast to other users
Streamy.on("Start", function(data, from) {
  console.log("Start Being Sent: Now broadcasting to all users in room", Streamy.id(from), data.room+'StartClick')
  Streamy.broadcast(data.room + "StartClick", data, from);
  //set interval on the server, then play broadcast play click to user to make sure click is synced for all users
  function serverClick() {
    Streamy.broadcast(data.room + "PlayClick", data, from)
  }
  _interval = setInterval(serverClick, (60000 / data.startingTempo) / data.subdivision.value); //(60000 / temp) / sub divisoon
})

//listener on server for start click to broadcast to other users
Streamy.on("Stop", function(data, from) {
  console.log("Stop Being Sent: Now broadcasting to all users in room", Streamy.id(from), data.room+'StopClick')
  Streamy.broadcast(data.room + "StopClick", data, from);
  clearInterval(_interval)

})

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

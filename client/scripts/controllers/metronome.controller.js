import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';

// Override Meteor._debug to filter for custom msgs
Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  }
})(Meteor._debug);

var room = new ReactiveVar('lobby');
var _s;

export default class MetromomeCtrl extends Controller {
  constructor() {
      super(...arguments);
      var interval;
      var workingTs = 1;
      var met = this;
      this.sessionId = 1;

      var acc = new Howl({
          src: ['sounds/woodblock.wav']
        });

      var unAcc = new Howl({
          src: ['sounds/block.wav']
        });

      this.metSettings = {
        userId : "",
        room : "",
        messageInput: "",
        running: false,
        startingTempo : 100,
        subdivision : {"name" : "quarter", "value": 1},
        timeSigniture : {"name" : "4/4" , "value": 4},
        accent :   {"name" : "DownBeats" , "value" : "DownBeats"},
        subdivs : [
                   {"name" : "quarter", "value": 1},
                   {"name" : "eigth" , "value" : 2},
                   {"name" : "triplets" , "value" : 3},
                   {"name" : "sixteenths" , "value" : 4},
                   {"name" : "quints" , "value" : 5},
                   {"name" : "sixtuplets" , "value" : 6},
                 ],
        timeSignitures : [
                   {"name" : "4/4" , "value": 4},
                   {"name" : "3/4" , "value" : 3},
                   {"name" : "2/4" , "value" : 2},
                   {"name" : "1/4" , "value" : 1},
                   {"name" : "6/8" , "value" : 6},
                   {"name" : "7/8" , "value" : 7},
                   {"name" : "9/8" , "value" : 9},
                   {"name" : "12/8" , "value" : 12}
                 ],
        accentPlacements : [
                  {"name" : "StartOfBar" , "value": "StartOfBar"},
                  {"name" : "DownBeats" , "value" : "DownBeats"}
                ]
            }



    function playClick(){
      accPlace = met.metSettings.accent.value;

      if(accPlace === "StartOfBar") {
        accPlace  = met.metSettings.timeSigniture.value
      } else{
        accPlace  = met.metSettings.subdivision.value
      }

      if(workingTs === 1){
        acc.play();
      }else{
        unAcc.play();
      }

      if(workingTs === accPlace){
        workingTs = 1;
      }else{
        workingTs = workingTs + 1;
      }
    }

    this.startClick = function() {
      //shoots msg to the server to broadcast start and apply met settings
      if(this.metSettings.room !== ""){
        Streamy.emit("Start", met.metSettings);
      }else{
        $("ion-content").css('background-color', '#c4ffcc')
        interval ? clearInterval(interval) : "" ;
        debugger
        interval = setInterval(playClick, (60000 / this.metSettings.startingTempo) / this.metSettings.subdivision.value); //(60000 / temp) / sub divisoon
      }
    }
    this.stopClick = function() {
      //shoots msg to the server to broadcast stop and apply met settings
      if(this.metSettings.room !== ""){
        Streamy.emit("Stop", met.metSettings);
      }else{
        $("ion-content").css('background-color', 'white')
        clearInterval(interval)
        met.metSettings.running = false;
        workingTs = 1;
      }
    }

    this.showCreateRoom = function(){
      $("#createRoomContainer").show()
    }

    this.createRoom = function(){
      //this sends the msg to the server to broadcast
      Streamy.emit('hello', { userId: this.metSettings.userId,
                              room: this.metSettings.room
                            });

      //listen for messages for this room
      Streamy.on(this.metSettings.room, function(d, s) {
        // met.metSettings.startingTempo = parseInt(d.metSettings.startingTempo);
        // met.metSettings.running = d.metSettings.running
        // $("#tempo").val(parseInt(d.metSettings.startingTempo))
        // if(met.metSettings.running === true){
        //    met.startClick()
        // }
        console.log(d);
      });

      room.set(met.metSettings.room)

      Streamy.on(room.curValue + "StartClick", function(d, s) {
        $("ion-content").css('background-color', '#c4ffcc')
        interval ? clearInterval(interval) : "" ;
        met.metSettings.startingTempo = parseInt(d.startingTempo);
        met.metSettings.running = d.running
        $("#tempo").val(parseInt(d.startingTempo))
        // interval = setInterval(playClick, (60000 / d.startingTempo) / d.subdivision.value); //(60000 / temp) / sub divisoon
      })

      Streamy.on(room.curValue + "PlayClick", function(d, s){
        playClick()
      })

      Streamy.on(room.curValue + "StopClick", function(d, s) {
        $("ion-content").css('background-color', 'white')
        clearInterval(interval)
        met.metSettings.running = false;
        workingTs = 1;
      })
    }


    this.sendMessage = function(elm){
      var val = $("#messageInput").val()
      //send message to the server
      Streamy.emit('sendText', {
         data: val,
         room: this.metSettings.room,
         metSettings: this.metSettings
       });
    }

    Streamy.on('hello', function(d, s) {
      console.log(d.data.userId);
      Streamy.emit('hello', { userId: this.metSettings.userId,
                              room: this.metSettings.room
                            });
    });

    //listener for user joining the room
    Streamy.on('__join__', function(d, s) {
      console.log(d.sid);
      _s = d.sid;
      console.log(d.userId);
      console.log(d.room);
      debugger
    });

    this.messages = function() {
      var current_room = this.metSettings.room;

      return Messages.find({
        $or: [
          { 'room': current_room },
          { 'room': null } // Direct messages
        ]
      });
    }

    this.rooms = function() {
      return Streamy.rooms();
    }
    // // Send a message to all connected sessions (Client & server)
    // Streamy.broadcast('__join__', { data: {userId: this.metSettings.userId} });

  }
}

MetromomeCtrl.$name = 'MetronomeCtrl';

// Send a message to all connected sessions (Client & server)
// Streamy.broadcast('hello', { data: {userId: this.metSettings.userId} });
//
// // Attach an handler for a specific message
// Streamy.on('hello', function(d, s) {
//   console.log(d.data.userId); // Will print 'world!'
//   // On the server side only, the parameter 's' is the socket which sends the message, you can use it to reply to the client, see below
// });

// Send a message
// from client to server
// Streamy.emit('hello', { data: {handle: 'world!'} });

// from server to client, you need an instance of the client socket (retrieved inside an 'on' callback or via `Streamy.sockets(sid)`)
// Streamy.emit('hello  ', { data: 'world!' }, _s);

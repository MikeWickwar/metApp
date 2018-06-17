import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';


export default class MetromomeCtrl extends Controller {
  constructor() {
      super(...arguments);
      var interval;
      var workingTs = 1;
      var met = this;

      var acc = new Howl({
          src: ['sounds/woodblock.wav']
        });

      var unAcc = new Howl({
          src: ['sounds/block.wav']
        });




      this.metSettings = {
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
      $("ion-content").css('background-color', '#c4ffcc')
      playClick();
      interval = setInterval(playClick, (60000 / this.metSettings.startingTempo) / this.metSettings.subdivision.value); //(60000 / temp) / sub divisoon
    }
    this.stopClick = function() {
      $("ion-content").css('background-color', 'white')
      clearInterval(interval)
      workingTs = 1;
    }
  }
}

MetromomeCtrl.$name = 'MetronomeCtrl';

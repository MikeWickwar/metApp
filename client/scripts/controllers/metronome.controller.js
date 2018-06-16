import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class MetromomeCtrl extends Controller {
  constructor() {
      super(...arguments);

    this.metDefaults = {
      startingTempo : 100,
      startingSubdivision : 4
    }

    this.startClick = function() {
      $("ion-content").css('background-color', 'red')

    }
    this.stopClick = function() {
      $("ion-content").css('background-color', 'white')

    }
  }
}

MetromomeCtrl.$name = 'MetronomeCtrl';

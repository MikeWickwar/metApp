import { Service } from 'angular-ecmascript/module-helpers';
import { MetromomeCtrl } from '../controllers/metronome.controller.js';

import settingsTemplateUrl from '../../templates/settings.html';
var _lastScope;

export default class ShowRoomSettingsService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = settingsTemplateUrl;
  }

  show(data) {
    this.scope = this.$rootScope.$resume();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      animation: 'slide-in-right',
      scope: this.scope,
      modelData: data
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();

      this.modal.modelData.metSettings.room
    });
  }

  cancel() {
    this.scope.$destroy();
    this.modal.remove();
  }

  dismiss(data) {
    this.modal.hide();
    return data.metSettings.room
  }
}

ShowRoomSettingsService.$name = 'ShowRoomSettings';
ShowRoomSettingsService.$inject = ['$rootScope', '$ionicModal'];

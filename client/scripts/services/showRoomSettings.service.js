import { Service } from 'angular-ecmascript/module-helpers';

import settingsTemplateUrl from '../../templates/settings.html';

export default class ShowRoomSettingsService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = settingsTemplateUrl;
  }

  show() {
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      animation: 'slide-in-right',
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();
    });
  }

  hide() {
    this.scope.$destroy();
    this.modal.remove();
  }
}

ShowRoomSettingsService.$name = 'ShowRoomSettings';
ShowRoomSettingsService.$inject = ['$rootScope', '$ionicModal'];

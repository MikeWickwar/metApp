import { Config } from 'angular-ecmascript/module-helpers';

import metronomeTemplateUrl from '../templates/metronome.html';
import mainTemplateUrl from '../templates/main.html';

export default class RoutesConfig extends Config {
  configure() {
    this.$stateProvider
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: mainTemplateUrl
      })
      .state('main.Metronome', {
        url: '/Metronome',
        views: {
          'main-metronome': {
            templateUrl: metronomeTemplateUrl,
            controller: 'MetronomeCtrl as met'
          }
        }
      })
      .state('main.MetSession', {
      url: '/Metronome/:sessionId',
      views: {
        'main-metronome-session': {
          templateUrl: metronomeTemplateUrl,
          controller: 'MetronomeCtrl as met'
        }
      }
    })

    this.$urlRouterProvider.otherwise('main/Metronome');
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

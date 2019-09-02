import { Config } from 'angular-ecmascript/module-helpers';

import metronomeTemplateUrl from '../templates/metronome.html';
import tabsTemplateUrl from '../templates/tabs.html';

export default class RoutesConfig extends Config {
  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl
      })
      .state('tab.Metronome', {
        url: '/Metronome',
        views: {
          'tab-metronome': {
            templateUrl: metronomeTemplateUrl,
            controller: 'MetronomeCtrl as met'
          }
        }
      })
      .state('tab.MetSession', {
      url: '/Metronome/:sessionId',
      views: {
        'tab-metronome-session': {
          templateUrl: metronomeTemplateUrl,
          controller: 'MetronomeCtrl as met'
        }
      }
    })

    this.$urlRouterProvider.otherwise('tab/Metronome');
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

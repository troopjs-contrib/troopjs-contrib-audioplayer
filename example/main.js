/* This is the RequireJS config file bootstraps TroopJS app. */

'use strict';

require.config({
  baseUrl: '../',
  paths:{
    jquery: 'bower_components/jquery/dist/jquery',
    lodash: 'bower_components/lodash/dist/lodash'
  },
  packages: [
    {
      name: 'when',
      location: 'bower_components/when',
      main: 'when.js'
    },
    {
      name: 'poly',
      location: 'bower_components/poly',
      main: 'poly.js'
    },
    {
      name: 'troopjs-composer',
      location: 'bower_components/troopjs-composer'
    },
    {
      name: 'troopjs-core',
      location: 'bower_components/troopjs-core'
    },
    {
      name: 'troopjs-browser',
      location: 'bower_components/troopjs-browser'
    },
    {
      name: 'troopjs-jquery',
      location: 'bower_components/troopjs-jquery'
    },
    {
      name: 'troopjs-utils',
      location: 'bower_components/troopjs-utils'
    },
    {
      name: 'troopjs-requirejs',
      location: 'bower_components/troopjs-requirejs'
    },
    {
      name: 'mu-template',
      location: 'bower_components/mu-template'
    },
    {
      name: 'requirejs-text',
      location: 'bower_components/requirejs-text'
    },
    {
      'name': 'mediaelement',
      'location': 'bower_components/mediaelement/build/',
      'main': 'mediaelement-and-player.min.js'
    },
    {
      "name": "troopjs-audio-player",
      location: '.'
    }
  ],
  deps: [
    'when/monitor/console'
  ],
  map: {
    '*': {
      template: 'mu-template/plugin',
      text: 'requirejs-text/text',
      logger: 'troopjs-core/logger/console'
    }
  },
  config: {
    'troopjs-browser/loom/config': {
      weave: 'data-weave-2',
      woven: 'data-woven-2',
      unweave: 'data-unweave-2'
    }
  },
  callback: function loadDeps() {
    require([
      'jquery',
      'troopjs-browser/application/widget'
    ], function Bootstrap(jQuery, Application, RecordingService) {
      jQuery(function ready($) {
        Application($('html'), 'bootstrap').start().then(function () {
          $('.audio-player').woven().spread(function (player1, player2) {
            player1 = player1[0];
            player1.load();
            player1.play();
            setTimeout(function () {
              player1.stop();
            }, 5000);

            setTimeout(function(){
              player2 = player2[0];
              player2.pause();
              player2.setSrc('http://10.43.224.10:8085/media?id=ab44c379-84c7-48c9-9a3f-e157631268bb');
              player2.load();
              player2.play();

            }, 6000);
          });
        });
      });
    });
  }
});

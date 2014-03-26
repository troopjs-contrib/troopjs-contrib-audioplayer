define([
  'module',
  'troopjs-browser/component/widget',
  'troopjs-utils/merge',
  'template!./audio-player.html',
  'mediaelement',
  'poly/array'
], function (module, Widget, merge, playerHtml) {
  'use strict';


  // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
  var MEDIA_EVENTS = [
    'loadeddata',
    'progress',
    'timeupdate',
    'seeked',
    'canplay',
    'play',
    'playing',
    'pause',
    'loadedmetadata',
    'ended',
    'volumechange'
  ];

  var DEFAULT_AUDIO_CONFIG = {
    type: 'audio/mp3',
    preload: 'none',
    // Belows are mediaelement api configurations:
    loop: false,
    alwaysShowHours: false,
    startVolume: 0.8,
    pauseOtherPlayers: true,
    showTimecodeFrameCount: false
  };

  var cfg = module.config();

  return Widget.extend(function ($element) {
    this.configure({}, DEFAULT_AUDIO_CONFIG, cfg, $element.data());
  }, {
    'sig/start': function () {
      var me = this;
      var cfg = this.configure();
      var player = $(playerHtml(cfg));
      me.html(player);
      player.mediaelementplayer(
        merge.call(cfg, {
          success: function ($el) {
            MEDIA_EVENTS.forEach(function (type) {
              $el.addEventListener(type, function ($evt) {
                me.publish('audio/'+ $evt.type);
              }, false);
            });
          }
        })
      );
    }
  });
});

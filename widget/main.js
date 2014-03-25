define([
  'module',
  'lodash',
  'troopjs-browser/component/widget',
  'template!./audio-player.html',
  'mediaelement'
], function (module, _, Widget, playerHtml) {
  'use strict';


  var DEFAULT_AUDIO_CONFIG = {
    type: 'audio/mp3',
    preload: 'none'
  };

  var MEDIAELEMENTPLAYER_DEFAULT_CONFIG = {
    loop: false,
    alwaysShowHours: false,
    startVolume: 0.8,
    pauseOtherPlayers: true,
    showTimecodeFrameCount: false
  }

  return Widget.extend(function ($element) {
    this.config = _.extend({}, DEFAULT_AUDIO_CONFIG, $element.data());
  }, {
    'sig/start': function () {
      var me = this;
      var player = $(playerHtml(this.config));
      me.html(player);
      player.mediaelementplayer(
        _.extend(
          MEDIAELEMENTPLAYER_DEFAULT_CONFIG,
          {
            success: function (mediaElement, domObject) {
              mediaElement.addEventListener('play', function (e) {
                // this.currentTime = 30;
                me.publish('audio/play');
              }, false);

              mediaElement.addEventListener('playing', function (e) {
                me.publish('audio/playing');
              }, false);

              mediaElement.addEventListener('pause', function (e) {
                me.publish('audio/pause');
              }, false);

              mediaElement.addEventListener('ended', function (e) {
                me.publish('audio/ended');
              }, false);

              mediaElement.addEventListener('seeked', function (e) {
                me.publish('audio/seeked');
              }, false);

              mediaElement.addEventListener('timeupdate', function (e) {
                me.publish('audio/play');
              }, false);

              mediaElement.addEventListener('error', function (e) {
                // TODO: Log Error here
                // Warn : Cassandra server is not stable right now
              }, false);
            }
          }));
    }
  });
});
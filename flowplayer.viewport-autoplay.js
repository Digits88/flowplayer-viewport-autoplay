/*!

   Viewport autoplay  plugin for Flowplayer HTML5

   Copyright (c) 2016-2017, Flowplayer Drive Oy

   Released under the MIT License:
   http://www.opensource.org/licenses/mit-license.php

   Requires Flowplayer HTML5 version 7.x or greater
   $GIT_DESC$

*/
(function() {

  var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

  var extension = function(flowplayer) {
    let common = flowplayer.common;
    flowplayer(function(api, root) {
      if (!api.conf.autoplay) return;
      api.conf.autoplay = false;

      if (api.conf.muted || flowplayer.support.mutedAutoplay) {
        common.addClass(root, 'is-muted-autoplaying');
        var ap = document.createElement('div');
        ap.className = 'fp-autoplay-overlay';
        ap.innerHTML = 'Click to unmute.. <a class="pause"></a>';
        root.appendChild(ap);

        ap.addEventListener('click', function(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          api.mute(false);
          common.removeClass(root, 'is-muted-autoplaying');
          if (flowplayer.support.mutedAutoplay) flowplayer.common.find('.fp-engine', root)[0].muted = false;
          root.removeChild(ap);
        });

        ap.querySelector('.pause').addEventListener('click', function(ev) {
          ev.preventDefault();
          api.unload();
        });
      }

      function startPlaybackIfInViewport() {
        if (isElementInViewport(root)) {
          if (!api.splash && flowplayer.support.mutedAutoplay) flowplayer.common.find('.fp-engine', root)[0].muted = true;
          if (api.splash) api.load();
          else api.resume();
        }
        else if (api.playing) {
          api.pause();
        }
      }

      api.on('ready', startPlaybackIfInViewport);

      flowplayer.bean.on(window, 'scroll', function() {
        requestAnimationFrame(startPlaybackIfInViewport);
      });
    });

  };

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  if (typeof module === 'object' && module.exports) module.exports = extension;
  else if (typeof window.flowplayer === 'function') extension(window.flowplayer);

})();


import { initASWebGLue, ASWebGLReady } from './ASWebGLue.js';

var last_time = 0;
var exports = {};

// LISTEN TO KEYBOARD EVENTS
var leftKeyPress = false;
var rightKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;
var spaceKeyPress = false;

var soundArray = [];

var song_ready = false;
var song;
var laser_ready = false;
var laser;
var laser_buffer;
var explosion_ready = false;
var explosion;
var explosion_buffer;
var audioCtx = new AudioContext();

document.addEventListener('keydown', (event) => {
  if (event.code == 'ArrowLeft') {
    leftKeyPress = true;
  }
  if (event.code == 'ArrowUp') {
    upKeyPress = true;
  }
  if (event.code == 'ArrowRight') {
    rightKeyPress = true;
  }
  if (event.code == 'ArrowDown') {
    downKeyPress = true;
  }
  if (event.code == 'Space') {
    spaceKeyPress = true;
  }

  if (song_ready == true) {
    song.start(0);
    song_ready = false;
  }

});

document.addEventListener('keyup', (event) => {
  if (event.code == 'ArrowLeft') {
    leftKeyPress = false;
  }
  if (event.code == 'ArrowUp') {
    upKeyPress = false;
  }
  if (event.code == 'ArrowRight') {
    rightKeyPress = false;
  }
  if (event.code == 'ArrowDown') {
    downKeyPress = false;
  }
  if (event.code == 'Space') {
    spaceKeyPress = false;
  }
});

// EACH FRAME RENDER RUNS THIS FUNCTION
function renderFrame() {
  let delta = 0;
  if (last_time !== 0) {
    delta = (new Date().getTime() - last_time);
  }
  last_time = new Date().getTime();

  exports.LoopCallback(delta,
    leftKeyPress, rightKeyPress,
    upKeyPress, downKeyPress,
    spaceKeyPress);

  requestAnimationFrame(renderFrame);
}

function getAudio() {
  song = audioCtx.createBufferSource();
  laser = audioCtx.createBufferSource();
  explosion = audioCtx.createBufferSource();

  let request = new XMLHttpRequest();

  request.open('GET', './audio/song-hq.mp3', true);

  request.responseType = 'arraybuffer';


  request.onload = function () {
    let audioData = request.response;

    audioCtx.decodeAudioData(audioData, function (buffer) {
      song.buffer = buffer;

      song.connect(audioCtx.destination);
      song.loop = true;
      song_ready = true;
    },

      function (e) { console.log("Error with decoding audio data" + e.err); });

    // BEGIN LASER

    let laser_request = new XMLHttpRequest();

    laser_request.open('GET', './audio/laser.mp3', true);

    laser_request.responseType = 'arraybuffer';


    laser_request.onload = function () {
      let laser_audioData = laser_request.response;

      audioCtx.decodeAudioData(laser_audioData, function (buffer) {
        laser.buffer = buffer;
        laser_buffer = buffer;

        laser.connect(audioCtx.destination);
        laser_ready = true;
      },

        function (e) { console.log("Error with decoding audio data" + e.err); });

    }

    laser_request.send();

    // BEGIN EXP
    let explosion_request = new XMLHttpRequest();

    explosion_request.open('GET', './audio/explosion.mp3', true);

    explosion_request.responseType = 'arraybuffer';

    explosion_request.onload = function () {
      let explosion_audioData = explosion_request.response;

      audioCtx.decodeAudioData(explosion_audioData, function (buffer) {
        explosion.buffer = buffer;
        explosion_buffer = buffer;

        explosion.connect(audioCtx.destination);
        explosion_ready = true;
      },

        function (e) { console.log("Error with decoding audio data" + e.err); });

    }

    explosion_request.send();

    // END EXP

    laser_request.send();
    // END LASER
  }

  request.send();
}

// THE startGame FUNCTION CALLS initASWebGLue AND INSTANTIATES THE WASM MODULE
export function startGame(wasm_file) {

  getAudio();

  const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

  var importObject = {
    env: {
      memory: memory,
      seed: Date.now,
      playLaser: function () {
        if (laser_ready == true) {
          laser.start(0);
          laser_ready = false;
          setTimeout(function () {
            let buffer = laser_buffer;
            laser = audioCtx.createBufferSource();
            laser.buffer = buffer;
            laser.connect(audioCtx.destination);
            laser_ready = true;
          }, 100);
        }
      },
      playExplosion: function () {
        if (explosion_ready == true) {
          explosion.start(0);
          explosion_ready = false;
          setTimeout(function () {
            explosion = audioCtx.createBufferSource();
            explosion.buffer = explosion_buffer;
            explosion.connect(audioCtx.destination);
            explosion_ready = true;
          }, 100);
        }
      },
    }
  };

  initASWebGLue(importObject);

  (async () => {
    // use WebAssembly.instantiateStreaming in combination with
    // fetch instead of WebAssembly.instantiate and fs.readFileSync
    let obj = await WebAssembly.instantiateStreaming(
      fetch(wasm_file),
      importObject);
    exports = obj.instance.exports;
    ASWebGLReady(obj, importObject);
    exports.StartGame();
    requestAnimationFrame(renderFrame);
  })();
}

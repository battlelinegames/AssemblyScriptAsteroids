
import { initASWebGLue, ASWebGLReady } from './ASWebGLue.js';

// The last_time variable is used to track the time between frame renders.
var last_time = 0;

// The exports object contains the functions exported from the WASM module
var exports = {};

// Are any of the arrow keys or the space bars pressed.
var leftKeyPress = false;
var rightKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;
var spaceKeyPress = false;

// Sound related variables.  A song loop, laser and explosion sound.

// The buffer source objects
var song;
var laser;
var explosion;

// The buffers
var laser_buffer;
var explosion_buffer;

// The audio context
var audioCtx = new AudioContext();

// When a keydown event is pressed, set the bool for that key to true
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

  // The sound will not be started until the first key is pressed.
  if (song.ready == true) {
    song.start(0);
    song.ready = false;
  }

});

// When a keyup event is pressed, set the bool for that key to false
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

// Each frame render runs this function
function renderFrame() {
  let delta = 0;
  if (last_time !== 0) {
    delta = (new Date().getTime() - last_time);
  }
  last_time = new Date().getTime();

  // call the LoopCallback function in the WASM module
  exports.LoopCallback(delta,
    leftKeyPress, rightKeyPress,
    upKeyPress, downKeyPress,
    spaceKeyPress);

  // requestAnimationFrame calls renderFrame the next time a frame is rendered
  requestAnimationFrame(renderFrame);
}

// get and decode an individual audio file
async function getAudioSource(file_location) {
  let buffer_source = audioCtx.createBufferSource();
  let data = await fetch(file_location);
  let array_buffer_data = await data.arrayBuffer();
  buffer_source.buffer = await audioCtx.decodeAudioData(array_buffer_data);
  buffer_source.connect(audioCtx.destination);
  return buffer_source;
}

// load audio files
async function getAudio() {
  song = await getAudioSource('./audio/song-hq.mp3');
  song.ready = true;

  laser = await getAudioSource('./audio/laser.mp3');
  laser_buffer = laser.buffer;
  laser.ready = true;

  explosion = await getAudioSource('./audio/explosion.mp3');
  explosion_buffer = explosion.buffer;
  explosion.ready = true;

}

// THE startGame FUNCTION CALLS initASWebGLue AND INSTANTIATES THE WASM MODULE
export function startGame(wasm_file) {

  // load the audio when the game is started.
  getAudio();

  const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

  var importObject = {
    env: {
      memory: memory,
      seed: Date.now,
      playLaser: function () {
        if (laser.ready == true) {
          laser.start(0);
          laser.ready = false;
          setTimeout(function () {
            let buffer = laser_buffer;
            laser = audioCtx.createBufferSource();
            laser.buffer = buffer;
            laser.connect(audioCtx.destination);
            laser.ready = true;
          }, 100);
        }
      },
      playExplosion: function () {
        if (explosion.ready == true) {
          explosion.start(0);
          explosion.ready = false;
          setTimeout(function () {
            explosion = audioCtx.createBufferSource();
            explosion.buffer = explosion_buffer;
            explosion.connect(audioCtx.destination);
            explosion.ready = true;
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

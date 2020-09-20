
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

// The Audio objects
var song;
var laser;
var explosion;

// When a keydown event is pressed, set the bool for that key to true
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    leftKeyPress = true;
  }
  if (event.code === 'ArrowUp') {
    upKeyPress = true;
  }
  if (event.code === 'ArrowRight') {
    rightKeyPress = true;
  }
  if (event.code === 'ArrowDown') {
    downKeyPress = true;
  }
  if (event.code === 'Space') {
    spaceKeyPress = true;
  }

  // The sound will not be started until the first key is pressed.
  if (song.ready === true) {
    song.play();
    song.ready = false;
  }

});

// When a keyup event is pressed, set the bool for that key to false
document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') {
    leftKeyPress = false;
  }
  if (event.code === 'ArrowUp') {
    upKeyPress = false;
  }
  if (event.code === 'ArrowRight') {
    rightKeyPress = false;
  }
  if (event.code === 'ArrowDown') {
    downKeyPress = false;
  }
  if (event.code === 'Space') {
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

// load audio files
function getAudio() {
  song = new Audio('./audio/song-hq.mp3');
  song.loop = true;
  song.ready = false;
  song.addEventListener("canplaythrough", event => {
    song.ready = true;
  });

  laser = new Audio('./audio/laser.mp3');
  laser.addEventListener("canplaythrough", event => {
    laser.ready = true;
  });

  explosion = new Audio('./audio/explosion.mp3');
  explosion.addEventListener("canplaythrough", event => {
    explosion.ready = true;
  });
}

// the startGame function calls initASWebGLue and instantiates the wasm module
export function startGame(wasm_file) {

  // load the audio when the game is started.
  getAudio();

  const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

  var importObject = {
    env: {
      memory: memory,
      seed: Date.now,
      playLaser: function () {
        laser.play();
      },
      playExplosion: function () {
        explosion.play();
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

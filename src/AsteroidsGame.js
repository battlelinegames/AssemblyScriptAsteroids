
import { initASWebGLue, ASWebGLReady } from './ASWebGLue.js';

var last_time = 0;
var exports = {};

var leftKeyPress = false;
var rightKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;
var spaceKeyPress = false;

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

export function startGame(wasm_file) {
  const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

  var importObject = {
    env: {
      memory: memory,
      seed: Date.now,
    }
  };

  initASWebGLue(importObject, exports);

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

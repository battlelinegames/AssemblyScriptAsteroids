# AssemblyScript Asteroid Game
I'm currently working on bringing WebGL to [AssemblyScript](https://www.assemblyscript.org/).  I have a partial set of bindings that I have used for this game available on Github [Here](https://github.com/battlelinegames/ASWebGLue).

![alt text](https://github.com/battlelinegames/AssemblyScriptAsteroids/blob/master/images/AssemblyScriptAsteroids.png?raw=true "AssemblyScript Asteroids Game")

[Play Online](https://embed.com/wasm/asteroid.html)

## WebGL
There are two files in this project that allow you to use WebGL in AssemblyScript.  The bindings in this project are incomplete.  I will be adding more bindings into the ASWebGLue project on Github.  If there is functionality you would like to see added to ASWebGLue, please contact me on twitter: [@battagline](https://twitter.com/battagline) or on the AssemblyScript [Discord](https://discord.gg/hvadbD).  Using WebGL requires the JavaScript glue file ASWebGLue.js and the AssemblyScript bindings in webgl.asc.  This asteroid shooter game does not have a lot of features.  I created it as a proof of concept for using WebGL from within AssemblyScript.  My goal is to create a series of tutorials starting with a walkthrough of how I created this game and the WebGL bindings.

### WebGL Bindings
The AssemblyScript bindings are all inside of the webgl.asc file.  I am using the AssemblyScript lang plugin for VS Code by BattleLine Games LLC. (that's me).  The plugin provides syntax highlighting for asc files in your project.  The .asc extension requires that you compile your AssemblyScript with the ```--extension asc``` flag when you compile your WASM file. The alternative is to use the .ts extension and rely on TypeScript syntax highlighting. One problem with the binding file is that AssemblyScript does not support function overloading.  Because of this, I need to chose a single function signature to use unless I rename the function.  I'm hoping this will change with later versions of AssemblyScript. The bindings file is a series of ```export declare``` function definitions corresponding to the functions in the webgl.idl, as well as type definitions.  Most of the WebGL types are stored in arrays in the JavaScript glue code, with AssemblyScript passing integer values back and forth that are used as indexes into these arrays.

### WebGL Glue
In this app, the JavaScript file AsteroidGame.js imports the following two functions from ASWebGLue.js:
```
import { initASWebGLue, ASWebGLReady } from './ASWebGLue.js';
```




```
  <script type="module" src='asteroidshooter.min.js'></script>
  <script type="module">
    import { startGame } from './asteroidshooter.min.js';
    startGame('AsteroidShooter.wasm');
  </script>
```
**CHR** contains the sprite (character) data that gets loaded into the          


# SHAMELESS PLUG from Rick Battagline            

I make web games for a living, and if you want to help me out please play them when you're bored at work. (win, win)                                  

https://www.classicsolitaire.com                             

https://www.icardgames.com                                    

https://www.candymahjong.com                                  

https://www.embed.com                                         


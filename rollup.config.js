//import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/AsteroidsGame.js',
  //  plugins: [terser()],
  output: {
    file: 'build/asteroidshooter.min.js',
    format: 'esm', // 'iife',
    compact: true,
  },
  //sourceMap: 'inline',
};
export default {
  input: 'src/AsteroidsGame.js',
  output: {
    file: 'build/asteroidshooter.min.js',
    format: 'esm', // 'iife',
    compact: true,
  },
  //sourceMap: 'inline',
};
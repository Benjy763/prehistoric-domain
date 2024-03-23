import { MainScene } from './components/scenes.config';

function requireAll(req) {
  req.keys().forEach(req);
}

// require aframe
require('aframe');

//require vendors
require('./vendors/aframe-troika-text/aframe-troika-text.min.js');
require('./vendors/water/refractor.js');
require('./vendors/water/reflector.js');
require('./vendors/water/water2.js');

// Require libs
require('aframe-extras');
// require('aframe-curve-component');
//require('aframe-fps-counter-component');
//require('super-hands');
//require('./vendors/aframe-gif-shader/dist/aframe-gif-component.js');

// Require all components
require('./assets/style/styles.css');
requireAll(require.context('./components/', true, /\.js$/));
// require('aframe-particle-system-component');
// require('aframe-fps-look-controls-component');
// require('aframe-troika-text');

const transformedString = (inputString) =>
  inputString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
require(`./main-scenes/${transformedString(MainScene)}/${transformedString(
  MainScene
)}-main-scene.html`);

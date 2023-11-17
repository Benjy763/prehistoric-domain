import { MainScene } from './components/scenes.config';

function requireAll(req) {
  req.keys().forEach(req);
}

// Require libs
require('aframe-extras');
require('aframe-curve-component');
require('aframe-fps-counter-component');
//require('super-hands');
//require('./vendors/aframe-gif-shader/dist/aframe-gif-component.js');

// Require all components
require('./assets/style/loader.css');
requireAll(require.context('./components/', true, /\.js$/));
require('aframe-particle-system-component');
require('aframe-fps-look-controls-component');
require('aframe-troika-text');

const transformedString = (inputString) =>
  inputString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
require(`./main-scenes/${transformedString(MainScene)}/${transformedString(
  MainScene
)}-main-scene.html`);

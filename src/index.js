import { MainScene } from './components/scenes.config';

function requireAll(req) {
  req.keys().forEach(req);
}

// Require libs
require('aframe');
require('aframe-extras');
require('aframe-curve-component');
// require('aframe-fps-counter-component');
//require('super-hands');
//require('./vendors/aframe-gif-shader/dist/aframe-gif-component.js');

// Require all components
require('./style/loader.css');
requireAll(require.context('./components/', true, /\.js$/));
require('aframe-particle-system-component');
require('aframe-fps-look-controls-component');

// Main Scenes
switch (MainScene) {
  case 'tour':
    require('./tour-main-scene.html');
    break;
  case 'aviary':
    require('./aviary-main-scene.html');
    break;
  case 'lagoon':
    require('./lagoon-main-scene.html');
    break;
}

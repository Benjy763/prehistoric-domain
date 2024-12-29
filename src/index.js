import { MainScene } from './components/scenes.config';

function requireAll(req) {
  req.keys().forEach(req);
}

// require aframe
require('aframe');

//require vendors
require('/vendors/aframe-troika-text/aframe-troika-text.min.js');
// Require libs
require('aframe-extras');

// Require all components
require('/assets/style/styles.css');
requireAll(require.context('./components/', true, /\.js$/));

const transformedString = (inputString) =>
  inputString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
require(
  `./main-scenes/${transformedString(MainScene)}/${transformedString(
    MainScene
  )}-main-scene.html`
);

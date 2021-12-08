function requireAll(req) {
  req.keys().forEach(req);
}

// Require libs
require('aframe');
require('aframe-extras');
// require('aframe-fps-counter-component');
require('super-hands');
require('aframe-curve-component');
require('./vendors/aframe-gif-shader/dist/aframe-gif-component.js');

// Require all components.
require('./style/loader.css');
requireAll(require.context('./components/', true, /\.js$/));

require('aframe-particle-system-component');
require('./scene.html');

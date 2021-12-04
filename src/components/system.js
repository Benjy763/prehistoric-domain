/*
  This is the main game file.
  Here there are main mecanisms to launch the experience, change scene, loadings...
  Also there are utility functions that help making scenes (ex move object on curves, logs...)
*/

import { debug } from './debug.const';
import { languages } from './languages.config';
import { scenes } from './scenes.config';

AFRAME.registerSystem('game', {
  schema: {},
  // ----- Launch and changing scene functions --------
  init: function () {
    this.firstScene = scenes.selection;
    this.displayDistance = 100; // 150 to test
    this.language = languages.selection;
    this.languages = languages;
    this.scenes = scenes;
    this.carReference;
    this.actuelScene = this.firstScene;
    this.tourStarted = false;
    this.vr = false;
    this.initLanguage();
    this.loadingAssets();

    // Debug events
    if (debug) {
      // Remove embedded for debug
      document.getElementById('main-scene-wrapper').embedded = false;
      // Display vr mirror in fullscreen
      document.getElementById('main-scene-content').classList.add('fullscreen');
      // Unclock debug listener
      this.startDebugListener();
    }
  },
  initLanguage: function () {
    if (localStorage.getItem('language') !== null) {
      this.language = localStorage.getItem('language');
    }
  },
  registerCar: function (car) {
    // Save all car references at start
    Object.keys(this.scenes).forEach((scene) => {
      if (this.scenes[scene].car === car.el.id) {
        this.scenes[scene].carReference = car;
      }
    });

    // Send reference to the actual scene
    if (car.el.id !== this.scenes[this.actuelScene].car) {
      return;
    }
    this.carReference = car;
    this.sendCarReference(car);
  },
  sendCarReference(car) {
    const event = new Event('carRegistered');
    car.el.dispatchEvent(event);
  },
  initClickEvents: function () {
    document.getElementById('enter').onclick = () => {
      this.vr = false;
      // Remove loading interface
      document.getElementById('static-loading').style.display = 'none';
      // Add scene screen
      document.getElementById('main-scene-wrapper').style.zIndex = '10';

      this.startTour();
    };

    document.getElementById('enter-vr').onclick = () => {
      this.vr = true;
      // Remove loading interface
      document.getElementById('static-loading').style.display = 'none';
      // Add scene screen
      document.getElementById('main-scene-wrapper').style.zIndex = '10';

      this.startTour();
    };
  },
  startTour() {
    if (this.tourStarted) {
      return;
    }

    setTimeout(() => {
      // Display scene
      this.displayScene();
      // Rendering scene
      this.renderingScene(this.firstScene);
    }, 1000);
    this.tourStarted = true;
  },
  // Only for the first time
  displayScene: function () {
    // Hide vr button and loading static screen
    document.querySelector('#enter').style.display = 'none';
    document.querySelector('#enter-vr').style.display = 'none';
    // Display camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[this.firstScene].camera)
      .setAttribute('camera', {
        far: this.displayDistance,
        active: true,
        fov: this.vr ? 80 : 50,
      });

    // Display scene
    document.getElementById('loading-scene').setAttribute('visible', 'false');
    document
      .getElementById(this.scenes[this.firstScene].scene)
      .setAttribute('visible', 'true');
  },
  // Each time we change scene
  changeScene: function (sceneId, render = true) {
    // change scene
    document
      .getElementById(this.scenes[this.actuelScene].scene)
      .setAttribute('visible', 'false');
    document
      .getElementById(this.scenes[sceneId].scene)
      .setAttribute('visible', 'true');

    // change camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[sceneId].camera)
      .setAttribute('camera', { far: this.displayDistance, active: true });

    // Register new scene
    this.actuelScene = sceneId;

    // Notify car reference to the new scene
    this.carReference.stopTrackingCar();
    this.carReference = this.scenes[this.actuelScene].carReference;
    if (this.carReference) {
      this.sendCarReference(this.carReference);
    }

    // Rendering scene
    if (!render) {
      return;
    }
    this.renderingScene(sceneId);
  },
  loadingAssets: function () {
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', () => {
      // Preloading
      setTimeout(() => {
        // Press start
        document.getElementById('loading-logo').style.display = 'none';
        document.getElementById('loading-infos').style.display = 'none';
        document.getElementById('loading-infos').style.display = 'none';
        document.getElementById('enter').style.display = 'block';
        if (AFRAME.utils.device.checkHeadsetConnected()) {
          document.getElementById('enter-vr').style.display = 'block';
        }

        this.initClickEvents();
      }, 2000);
    });
  },
  disableAllCameras: function () {
    Object.keys(this.scenes).forEach((sceneId) => {
      if (this.scenes[sceneId].camera) {
        document
          .getElementById(this.scenes[sceneId].camera)
          .setAttribute('camera', 'active', false);
      }
    });
  },
  renderingScene: function (sceneId) {
    this.loading();
    // Select car to launch event
    const car = document.getElementById(this.scenes[sceneId].car);
    if (!car) {
      return;
    }

    // Launch the scene after the rendering time
    car.querySelector('#rendering').setAttribute('visible', 'true');
    setTimeout(() => {
      car.querySelector('#rendering').setAttribute('visible', 'false');
      const event = new Event('start');
      car.dispatchEvent(event);
      setTimeout(() => {
        this.loading(false);
      }, 5000);

      // Global sound launch
      document.getElementById('jungle-asset').play();
    }, 10000);
  },
  // Section with debug key
  startDebugListener: function () {
    // ----- Section for debug events -----
    document.addEventListener('keyup', (e) => {
      this.vr = false;
      // Start tour in debug mode with key 8 (display in navigator)
      if (e.keyCode == 56) {
        // Remove interface to see vr display
        document.getElementById('static-loading').style.display = 'none';
        // Add scene screen
        document.getElementById('main-scene-wrapper').style.zIndex = '9999';
        // Remove windows for debug
        document
          .getElementById('main-scene-wrapper')
          .classList.remove('scene-wrapper');
        // Display scene
        this.displayScene();
        // Rendering scene
        this.renderingScene(this.firstScene);
      }

      // press key 7 and move car in given position on the curve
      if (e.keyCode == 55) {
        this.carReference.carMarker = scenes.carMarkerForDebug;
      }
    });
  },
  // ----- Main Tools --------
  // ----- Log functions --------
  log: function (text) {
    document
      .querySelector('#log')
      .setAttribute('text', { value: text, color: 'white', width: 0.5 });
  },
  // ----- Curve functions --------
  // Move an object on the given curve according to given speed
  moveOnCurve(object, curve, marker, speed) {
    //console.log(object, curve, marker, speed);
    marker += speed;
    object.position.copy(
      this.convertPosition(curve.getPointAt(marker), object.position.y)
    );
    return marker;
  },
  // Give to the given object the new rotation position after moving on the curve
  updateRotation: function (el, object, curve, marker, speed, offset = 0) {
    const newPosition = this.convertPosition(
      curve.getPointAt(marker + speed),
      object.position.y
    );
    object.lookAt(newPosition.x, newPosition.y, newPosition.z);
    // Correct rotation with offset
    const rotation = el.getAttribute('rotation');
    rotation.y += offset;
    el.setAttribute('rotation', rotation);
  },
  // Convert position in x y z object
  convertPosition: function (position2D, ypos) {
    return {
      x: position2D.x,
      y: ypos, // Must not move
      z: position2D.y,
    };
  },
  // Trunc marker to have better values (ex: 515 instead of 0.5155554)
  truncMarker: function (carMarker) {
    return Math.trunc(carMarker * 1000);
  },
  // ----- Loading functions --------
  loading: function (loading = true) {
    if (!loading) {
      document
        .querySelector('#' + this.scenes[this.actuelScene].car + ' #rig')
        .setAttribute('position', { x: -0.38, y: 0.75, z: 0.5 });
      if (!this.vr) {
        document
          .querySelector('#' + this.scenes[this.actuelScene].car + ' #rig')
          .setAttribute('position', { x: -0.38, y: 0.4, z: 0.54 });
      }
      return;
    }
    document
      .querySelector('#' + this.scenes[this.actuelScene].car + ' #loading-logo')
      .setAttribute('visible', true);
    document
      .querySelector('#' + this.scenes[this.actuelScene].car + ' #rig')
      .setAttribute('position', { x: -0.38, y: -80, z: 0.54 });
  },
  // ----- Languages functions --------
  getVoice(element) {
    return document.getElementById(this.languages[this.language][element]);
  },
});

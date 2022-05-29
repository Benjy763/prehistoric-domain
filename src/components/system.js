/*
  This is the main game file.
  Here there are main mecanisms to launch the experience, change scene, loadings...
  Also there are utility functions that help making scenes (ex move object on curves, logs...)
*/

import { Scenes } from './scenes.config';
import { debug } from './debug.const';
import { languages } from './languages.config';

const SupportedPlatform = [
  'Win32',
  'MacIntel',
  'MacPPC',
  'Mac68K',
  'Win16',
  'Linux i686',
  'Linux x86_64',
  'Windows',
];

AFRAME.registerSystem('system', {
  schema: {},
  // ----- Launch and changing scene functions --------
  init: function () {
    this.scenes = Scenes;
    this.movesManager =
      document.querySelector('a-scene').systems['movesManager'];

    this.firstScene = this.scenes.selection;
    this.displayDistance = 100; // 150 to test
    this.fov = 50;
    this.fovVR = 60;
    this.language = languages.selection;
    this.languages = languages;
    this.carReference;
    this.actuelScene = this.firstScene;
    this.tourStarted = false;
    this.vr = false;

    const userAgentDataPlatform = window.navigator.userAgentData
      ? SupportedPlatform.includes(window.navigator.userAgentData.platform)
      : false;
    this.isMobile =
      !SupportedPlatform.includes(window.navigator.platform) &&
      !userAgentDataPlatform;

    this.initPerformances();
    this.initLanguage();
    this.loadingAssets();

    // Remove embedded for debug
    document.getElementById('main-scene-wrapper').embedded = false;
    // Display vr mirror in fullscreen
    document.getElementById('main-scene-content').classList.add('fullscreen');

    // Debug events
    if (debug) {
      // Unclock debug listener
      this.startDebugListener();
    }

    // Manage clicks
    document.querySelector('canvas').addEventListener(
      'click',
      () => {
        document
          .querySelector('#click-wrapper')
          .setAttribute('style', 'display: none');
      },
      { once: true }
    );
  },
  getActualSceneObject: function () {
    return this.scenes[this.actuelScene];
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
    document.querySelector('#menu-wrapper').style.display = 'none';
    // Display camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[this.firstScene].camera)
      .setAttribute('camera', {
        far: this.displayDistance,
        active: true,
        fov: this.vr ? this.fovVR : this.fov,
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
      .setAttribute('camera', {
        far: this.displayDistance,
        active: true,
        fov: this.vr ? this.fovVR : this.fov,
      });

    // Register new scene
    this.actuelScene = sceneId;

    if (!!this.carReference) {
      // Notify car reference to the new scene
      this.carReference.stopTrackingCar();
      this.carReference = this.scenes[this.actuelScene].carReference;
      if (!!this.carReference) {
        this.sendCarReference(this.carReference);
      }
    }

    // Rendering scene
    if (!render) {
      return;
    }
    this.renderingScene();
  },
  loadingAssets: function () {
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', () => {
      // Preloading
      setTimeout(() => {
        document.getElementById('menu-wrapper').style.display = 'block';
        // Press start
        document.getElementById('loading-logo').style.display = 'none';
        document.getElementById('loading-infos').style.display = 'none';
        document.getElementById('loading-infos').style.display = 'none';
        document.getElementById('enter').style.display = 'block';
        if (this.isMobile) {
          document.getElementById('enter').style.display = 'none';
        }
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
  renderingScene: function () {
    this.loading();
    // Select car to launch event
    const car = document.getElementById(this.scenes[this.actuelScene].car);
    if (!car) {
      return;
    }

    // Launch the scene after the rendering time
    car.querySelector('#rendering').setAttribute('visible', 'true');
    setTimeout(() => {
      car.querySelector('#rendering').setAttribute('visible', 'false');

      const event = new Event('start');
      car.dispatchEvent(event);

      // Delai for tour that is heavy to load
      setTimeout(() => {
        // Set main scene atmosphere color
        const mainScene = document.getElementById('main-scene');
        mainScene.setAttribute('background', {
          color: this.scenes.color,
        });
        // Set main scene fog
        mainScene.setAttribute('fog', {
          type: 'exponential',
          color: this.scenes.color,
          density: this.scenes.density,
        });
        // Set main scene ability to walk
        if (!!this.scenes.canWalk) {
          this.movesManager.enableWalk(this.scenes[this.actuelScene]);
        }
        this.loading(false);
      }, 6000);
    }, 4000);
  },
  // Section with debug key
  startDebugListener: function () {
    // ----- Section for debug events -----
    document.addEventListener('keyup', (e) => {
      // Start tour in debug mode with key 8 (display in navigator)
      if (e.keyCode == 56) {
        this.vr = false;
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
        this.carReference.carMarker = this.scenes.carMarkerForDebug;
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
  // ----- Loading functions --------
  loading: function (loading = true) {
    // Fix to set base camera position depending on device
    const cameraClasses = document.getElementsByClassName('camera-entity');
    [].forEach.call(cameraClasses, (camera) =>
      camera.setAttribute('position', {
        x: 0,
        y: this.vr ? 0 : 1.6,
        z: 0,
      })
    );

    // Fix rig height
    if (!loading) {
      this.movesManager.setRigPosition({
        x: -0.38,
        y: 0.75,
        z: 0.5,
      });
      if (!this.vr) {
        this.movesManager.setRigPosition({
          x: -0.38,
          y: 0.4,
          z: 0.54,
        });
      }
      return;
    }
    document
      .querySelector('#' + this.scenes[this.actuelScene].car + ' #loading-logo')
      .setAttribute('visible', true);
    this.movesManager.setRigPosition({
      x: -0.38,
      y: -80,
      z: 0.34,
    });
  },
  // ----- Performances functions --------
  initPerformances: function () {
    const perfEl = document.getElementById('perf');
    const qualityEl = document.getElementById('quality');
    if (!perfEl || !qualityEl) {
      return;
    }

    // Default performance
    qualityEl.style.borderColor = '#ec652b';
    this.toggle('performance', true);

    perfEl.onclick = () => {
      perfEl.style.borderColor = '#ec652b';
      qualityEl.style.borderColor = '#fff';

      this.toggle('performance', false);
    };
    qualityEl.onclick = () => {
      qualityEl.style.borderColor = '#ec652b';
      perfEl.style.borderColor = '#fff';

      this.toggle('performance', true);
    };

    this.language = 'en';
  },
  toggle: function (className, displayState) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute('visible', displayState);
    }
  },
  // ----- Languages functions --------
  initLanguage: function () {
    const enEl = document.getElementById('language-en');
    const frEl = document.getElementById('language-fr');
    if (!enEl || !frEl) {
      return;
    }

    // Default en
    this.language = 'en';
    enEl.style.borderColor = '#ec652b';

    enEl.onclick = () => {
      this.language = 'en';
      enEl.style.borderColor = '#ec652b';
      frEl.style.borderColor = '#fff';
    };
    frEl.onclick = () => {
      this.language = 'fr';
      frEl.style.borderColor = '#ec652b';
      enEl.style.borderColor = '#fff';
    };
  },
  getVoice(element) {
    return document.getElementById(this.languages[this.language][element]);
  },
});

/*
  This is the main game file.
  Here there are main mecanisms to launch the experience, change scene, loadings...
  Also there are utility functions that help making scenes (ex move object on curves, logs...)
*/

import { Debug } from '../debug.const';
import { Languages } from '../languages.config';
import { Scenes } from '../scenes.config';

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
    this.displayDistance = this.scenes.displayDistance
      ? this.scenes.displayDistance
      : 100;
    this.fov = 45;
    this.fovVR = 45;
    this.language = Languages.selection;
    this.languages = Languages;
    this.carReference;
    this.actuelScene = this.firstScene;
    this.tourStarted = false;
    this.vr = false;
    this.canRecenter = false;
    this.performance = false;

    const userAgentDataPlatform = window.navigator.userAgentData
      ? SupportedPlatform.includes(window.navigator.userAgentData.platform)
      : false;
    this.isMobile =
      !SupportedPlatform.includes(window.navigator.platform) &&
      !userAgentDataPlatform;

    this.initPerformances();
    this.initLanguage();
    this.loadingAssets();

    // Set loading infos
    document
      .querySelector('#loader-logo')
      .setAttribute('src', `/assets/images/${this.scenes.loadingScreen}`);
    document.querySelector('#infos-name').innerHTML = this.scenes.name;

    // Remove embedded for debug
    document.querySelector('#main-scene-wrapper').embedded = false;
    // Display vr mirror in fullscreen
    document.querySelector('#main-scene-content').classList.add('fullscreen');

    // Debug events
    if (Debug) {
      // Unclock debug listener
      this.startDebugListener();
    }
    this.manageGlobalEvents();
  },
  manageGlobalEvents: function () {
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
  initStartingEvents: function () {
    document.querySelector('#enter').onclick = () => {
      this.vr = false;
      // Remove loading interface
      document.querySelector('#static-loading').style.display = 'none';
      // Add scene screen
      document.querySelector('#main-scene-wrapper').style.zIndex = '10';

      this.startTour();
    };

    document.querySelector('#enter-vr').onclick = () => {
      // Already entered in vr
      if (this.vr) {
        return;
      }
      this.vr = true;
      // Trigger Vr Enter event
      const event = new Event('enterVr');
      window.dispatchEvent(event);
      // Remove unused wrapper
      document
        .querySelector('#click-wrapper')
        .setAttribute('style', 'display: none');
      // Display VR button to reenter if needed
      document.querySelector('#reenter-vr').style.display = 'block';
      // Remove loading interface
      document.querySelector('#static-loading').style.display = 'none';
      // Add scene screen
      document.querySelector('#main-scene-wrapper').style.zIndex = '10';

      document.querySelector('#reenter-vr').onclick = () => {
        document.getElementById('enter-vr').click();
      };

      this.startTour();
    };
  },
  startTour() {
    if (this.tourStarted) {
      return;
    }

    setTimeout(() => {
      // Display scene
      this.displayScene(this.firstScene);
      // Rendering scene
      this.renderingScene(this.firstScene);
    }, 1000);
    this.tourStarted = true;
  },

  loadingAssets: function () {
    // Load asset
    document.querySelector('a-assets').addEventListener('loaded', () => {
      // Preloading
      setTimeout(() => {
        document.querySelector('#menu-wrapper').style.display = 'flex';
        if (!this.scenes.needPerformance) {
          document.querySelector('#menu-performance').style.display = 'none';
        }
        if (!this.scenes.needLanguage) {
          document.querySelector('#menu-language').style.display = 'none';
        }
        // Press start
        document.querySelector('#loading-logo').style.display = 'none';
        document.querySelector('#loading-infos .progress-label').style.display =
          'none';
        document.querySelector('#infos-annonce').style.display = 'none';
        document.querySelector('#loader-logo').style.display = 'block';
        document.querySelector('#enter').style.display = 'block';
        if (this.isMobile) {
          document.querySelector('#enter').style.display = 'none';
        }
        if (AFRAME.utils.device.checkHeadsetConnected()) {
          document.querySelector('#enter-vr').style.display = 'block';
        }

        this.initStartingEvents();
      }, 2000);
    });
  },
  changeAtmosphere: function (color, density) {
    // Set main scene atmosphere color
    const mainScene = document.querySelector('#main-scene');
    mainScene.setAttribute('background', {
      color: color,
    });
    mainScene.setAttribute('fog', {
      type: 'exponential',
      color: color,
      density: density,
    });
  },
  // Only for the first time
  displayScene: function (newScene) {
    // Hide loading static screen
    document.querySelector('#menu-wrapper').style.display = 'none';

    // Display scene
    document
      .getElementById(this.scenes[this.actuelScene].scene)
      .setAttribute('visible', 'false');
    document
      .getElementById(this.scenes[newScene].scene)
      .setAttribute('visible', 'true');

    // Display camera
    this.disableAllCameras();
    document
      .getElementById(this.scenes[newScene].camera)
      .setAttribute('camera', {
        far: this.displayDistance,
        active: true,
        fov: this.vr ? this.fovVR : this.fov,
      });

    // Register new scene
    this.actuelScene = newScene;
  },
  // Each time we change scene
  changeScene: function (sceneId, render = true) {
    if (!this.actuelScene || this.actuelScene === sceneId) {
      return;
    }
    // Trigger event
    const event = new Event('changeScene');
    window.dispatchEvent(event);

    // Set main scene atmosphere color
    this.changeAtmosphere('#262c28', '0.001');

    // Display scene
    this.displayScene(sceneId);

    if (!!this.carReference) {
      // Notify car reference to the new scene
      this.carReference.stopTrackingCar();
      this.carReference = this.scenes[this.actuelScene].carReference;
      if (!!this.carReference) {
        this.sendCarReference(this.carReference);
      }
    }

    // Rendering scene
    if (render) {
      this.renderingScene();
    }
  },
  changeEndingScene: function () {
    this.changeAtmosphere('#000', 0.1);
    setTimeout(() => {
      window.location.href = 'https://map.prehistoricdomain.com/';
    }, 8000);
    this.changeScene('ending', false);
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
    console.log('loading start');
    this.setLoading();
    // Select camera scene to launch event
    const cameraScene = document.getElementById(
      this.scenes[this.actuelScene].car
    );
    if (!cameraScene) {
      return;
    }

    // Launch the scene after the rendering time
    setTimeout(() => {
      // Can recenter
      this.canRecenter = true;
      // Set main scene atmosphere color
      this.changeAtmosphere(
        this.scenes.color,
        this.vr ? this.scenes.density[0] : this.scenes.density[1]
      );
      // Set main scene ability to walk
      if (!!this.scenes.canWalk) {
        this.movesManager.enableWalk(this.scenes[this.actuelScene]);
      }
      const event = new Event('start');
      cameraScene.dispatchEvent(event);
      this.setCameraPosition();
    }, 4000);
  },
  setCameraPosition: function () {
    // Fix to set base camera position depending on device
    const cameraClasses = document.getElementsByClassName('camera-entity');
    [].forEach.call(cameraClasses, (camera) =>
      camera.setAttribute('position', {
        x: 0,
        y: this.vr ? 0 : 1.6,
        z: 0,
      })
    );

    this.movesManager.setRigPosition({
      x: this.scenes[this.actuelScene].rigPos.x
        ? this.scenes[this.actuelScene].rigPos.x
        : -0.38,
      y: 0,
      z: this.scenes[this.actuelScene].rigPos.z
        ? this.scenes[this.actuelScene].rigPos.z
        : 0.5,
    });

    setTimeout(() => {
      this.movesManager.fixRigPosition();
      this.setLoading(false);
    }, 1500);
  },
  // ----- Loading functions --------
  setLoading: function (loading = true) {
    document
      .querySelector(
        '#' + this.scenes[this.actuelScene].car + ' #loading-sphere'
      )
      .setAttribute('visible', loading);
  },
  // Section with debug key
  startDebugListener: function () {
    // ----- Section for debug events -----
    document.addEventListener('keyup', (e) => {
      // Start tour in debug mode with key 8 (display in navigator)
      if (e.keyCode == 56) {
        this.vr = false;
        // Remove interface to see vr display
        document.querySelector('#static-loading').style.display = 'none';
        // Add scene screen
        document.querySelector('#main-scene-wrapper').style.zIndex = '9999';
        // Remove windows for debug
        document
          .querySelector('#main-scene-wrapper')
          .classList.remove('scene-wrapper');
        // Display scene
        this.displayScene(this.firstScene);
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
  // ----- Performances functions --------
  initPerformances: function () {
    const perfEl = document.querySelector('#perf');
    const qualityEl = document.querySelector('#quality');
    if (!perfEl || !qualityEl) {
      return;
    }

    // Default performance
    const performanceColor = '#b39760';
    qualityEl.style.borderColor = performanceColor;
    qualityEl.style.opacity = '1';
    this.toggle('performance', true);

    perfEl.onclick = () => {
      perfEl.style.borderColor = performanceColor;
      perfEl.style.opacity = '1';
      qualityEl.style.borderColor = '#d4c9ba';
      qualityEl.style.opacity = '0.6';

      this.toggle('performance', false);
    };
    qualityEl.onclick = () => {
      qualityEl.style.borderColor = performanceColor;
      qualityEl.style.opacity = '1';
      perfEl.style.borderColor = '#d4c9ba';
      perfEl.style.opacity = '0.6';

      this.toggle('performance', true);
    };

    this.language = 'en';
  },
  toggle: function (className, displayState) {
    this.performance = displayState;
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute('visible', displayState);
    }
  },
  // ----- Languages functions --------
  initLanguage: function () {
    const enEl = document.querySelector('#language-en');
    const frEl = document.querySelector('#language-fr');
    if (!enEl || !frEl) {
      return;
    }

    // Default en
    const languageColor = '#b39760';
    this.language = 'en';
    enEl.style.borderColor = languageColor;
    enEl.style.opacity = '1';

    enEl.onclick = () => {
      this.language = 'en';
      enEl.style.borderColor = languageColor;
      enEl.style.opacity = '1';
      frEl.style.borderColor = '#d4c9ba';
      frEl.style.opacity = '0.6';
    };
    frEl.onclick = () => {
      this.language = 'fr';
      frEl.style.borderColor = languageColor;
      frEl.style.opacity = '1';
      enEl.style.borderColor = '#d4c9ba';
      enEl.style.opacity = '0.6';
    };
  },
  getVoice(element) {
    return document.getElementById(this.languages[this.language][element]);
  },
});

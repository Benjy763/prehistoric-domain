/*
  This is the main game file.
  Here there are main mecanisms to launch the experience, change scene, loadings...
  Also there are utility functions that help making scenes (ex move object on curves, logs...)
*/

import { DEBUG } from '../debug.const';
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
  'Windows'
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
    this.ambiantMode = false;
    this.languages = Languages;
    this.carReference;
    this.actuelScene = this.firstScene;
    this.tourStarted = false;
    this.vr = false;
    this.canRecenter = false;
    this.performance = false;
    this.hasAccess = false;

    const userAgentDataPlatform = window.navigator.userAgentData
      ? SupportedPlatform.includes(window.navigator.userAgentData.platform)
      : false;
    // this.isMobile =
    //   !SupportedPlatform.includes(window.navigator.platform) &&
    //   !userAgentDataPlatform;
    this.isMobile = AFRAME.utils.device.isMobile();
    this.isAppleMobile =
      AFRAME.utils.device.isMobile() &&
      /iPhone|iPad|iPod/.test(navigator.userAgent);

    // setTimeout(() => {
    //   this.initPerformances();
    // }, 500);
    // Ask parent for selected langage

    // Check authorization
    this.checkAccess();
    setTimeout(() => {
      if (this.hasAccess !== true) {
        window.location.href = 'https://prehistoricdomain.com';
      }
    }, 5000);

    // Check language
    window.parent.postMessage('getLang', '*');
    window.addEventListener('message', ({ data }) => {
      if (data && typeof data === 'string' && data.startsWith('lang')) {
        this.initLanguage(data.replace('lang', ''));
      }
    });
    this.initLanguage();
    this.initAmbiantMode();
    this.loadingAssets();

    // Set loading infos
    document
      .querySelector('#loader-logo')
      .setAttribute('src', `/assets/images/open.gif`);
    document.querySelector('#infos-name').innerHTML = this.scenes.name;

    // Remove embedded for debug
    document.querySelector('#main-scene-wrapper').embedded = false;
    // Display vr mirror in fullscreen
    document.querySelector('#main-scene-content').classList.add('fullscreen');

    // Debug events
    if (DEBUG) {
      // Unclock debug listener
      this.startDebugListener();
    }
  },
  checkAccess: function () {
    const isProd = window.location.hostname === 'tour.prehistoricdomain.com';
    const isLocalhost = window.location.hostname === 'localhost';
    if (isProd) {
      window.parent.postMessage('getAccess', '*');
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'v4j9kjxzwmjsrlnfbq2ndu68z') {
          this.hasAccess = true;
        }
      });
    } else if (isLocalhost) {
      this.hasAccess = true;
    }
  },
  manageLookControls: function () {
    if (this.isMobile) return;
    // Manage 2D look controls
    document
      .querySelector('#click-wrapper')
      .setAttribute('style', 'display: flex');
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
  openFullscreen: function () {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  },
  exitFullscreen: function () {
    if (!document.fullscreenElement) {
      return;
    }
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },
  initStartingEvents: function () {
    let myEvent =
      'ontouchstart' in document.documentElement ? 'touchend' : 'click';
    document.querySelector('#enter').addEventListener(myEvent, () => {
      if (this.isAppleMobile) {
        document.getElementById('full-audio-asset').play();
      }
      this.openFullscreen();
      this.vr = false;
      // Remove loading interface
      document.querySelector('#static-loading').style.display = 'none';
      // Add scene screen
      document.querySelector('#main-scene-wrapper').style.zIndex = '10';

      this.startTour();
    });

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
        this.initMenuInterval = setInterval(() => {
          if (this.hasAccess) {
            clearInterval(this.initMenuInterval);
            document.querySelector('#menu-wrapper').style.display = 'flex';
            // if (!this.scenes.needPerformance) {
            //   document.querySelector('#menu-performance').style.display = 'none';
            // }
            if (!this.scenes.needLanguage) {
              document.querySelector('#menu-language').style.display = 'none';
            }
            if (!this.scenes.needAmbiantMode) {
              document.querySelector('#menu-ambiant-mode').style.display =
                'none';
            }
            // Press start
            document.querySelector('#loading-logo').style.display = 'none';
            document.querySelector(
              '#loading-infos .progress-label'
            ).style.display = 'none';
            document.querySelector('#infos-annonce').style.display = 'none';
            // document.querySelector('#loader-logo').style.display = 'block';
            document.querySelector('#enter').style.display = 'block';
            // if (this.isMobile) {
            //   document.querySelector('#enter').style.display = 'none';
            // }
            if (AFRAME.utils.device.checkHeadsetConnected() && !this.isMobile) {
              document.querySelector('#enter').style.display = 'none';
              document.querySelector('#enter-vr').style.display = 'block';
            }

            this.initStartingEvents();
          }
        }, 200);
      }, 2000);
    });
  },
  changeAtmosphere: function (fogParams) {
    // Set main scene atmosphere color
    const mainScene = document.querySelector('#main-scene');
    mainScene.setAttribute('background', {
      color: fogParams.color
    });
    mainScene.setAttribute('fog', {
      ...fogParams,
      type: fogParams.type ?? 'exponential',
      density: fogParams.density
        ? this.vr
          ? fogParams.density[0]
          : fogParams.density[1]
        : 0,
      near: fogParams.near
        ? this.vr
          ? fogParams.near[0]
          : fogParams.near[1]
        : 0,
      far: fogParams.far ? (this.vr ? fogParams.far[0] : fogParams.far[1]) : 0
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
        fov: this.vr ? this.fovVR : this.fov
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

    // Display scene
    this.displayScene(sceneId);

    if (this.carReference) {
      // Notify car reference to the new scene
      this.carReference.stopTrackingCar();
      this.carReference = this.scenes[this.actuelScene].carReference;
      if (this.carReference) {
        this.sendCarReference(this.carReference);
      }
    }

    // Rendering scene
    if (render) {
      this.renderingScene();
    }
  },
  changeEndingScene: function () {
    this.changeScene('ending', false);
    document
      .querySelector('#' + this.scenes.ending.camera)
      .setAttribute('camera', 'active', true);
    if (!this.vr) {
      this.exitFullscreen();
    }
    setTimeout(() => {
      const parent = window.parent;
      if (parent && parent.postMessage) {
        parent.postMessage('reloadxp', '*');
      }
    }, 2000);
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
      this.changeAtmosphere(this.scenes.fog);

      // Set main scene ability to walk
      if (this.scenes.canWalk) {
        this.movesManager.enableWalk(this.scenes[this.actuelScene]);
      }
      const event = new Event('start');
      cameraScene.dispatchEvent(event);
      this.setCameraPosition();
      this.manageLookControls();
    }, 4000);
  },
  setCameraPosition: function () {
    // Fix to set base camera position depending on device
    const cameraClasses = document.getElementsByClassName('camera-entity');
    [].forEach.call(cameraClasses, (camera) =>
      camera.setAttribute('position', {
        x: 0,
        y: this.vr ? 0 : 1.6,
        z: 0
      })
    );

    if (
      this.movesManager.savedPosition &&
      this.movesManager.savedPosition.scene === this.actuelScene
    ) {
      this.movesManager.setRigPosition({
        x: this.movesManager.savedPosition.x,
        y: 0,
        z: this.movesManager.savedPosition.z
      });
      this.movesManager.savedPosition = null;
    } else {
      this.movesManager.setRigPosition({
        x: this.scenes[this.actuelScene].rigPos.x
          ? this.scenes[this.actuelScene].rigPos.x
          : -0.38,
        y: 0,
        z: this.scenes[this.actuelScene].rigPos.z
          ? this.scenes[this.actuelScene].rigPos.z
          : 0.5
      });
    }

    this.setLoading(false);
    setTimeout(() => {
      this.movesManager.fixRigPosition();
    }, 1000);
  },
  // ----- Loading functions --------
  setLoading: function (loading = true) {
    window.sceneIsLoading = loading;
    document
      .querySelector('#' + this.scenes.loading.scene)
      .setAttribute('visible', loading);
    document
      .querySelector('#' + this.scenes.loading.camera)
      .setAttribute('camera', 'active', loading);

    document
      .querySelector('#' + this.scenes[this.actuelScene].scene)
      .setAttribute('visible', !loading);
    document
      .querySelector('#' + this.scenes[this.actuelScene].camera)
      .setAttribute('camera', 'active', !loading);
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

    // Default quality
    if (AFRAME.utils.device.checkHeadsetConnected()) {
      this.togglePerf(
        !!this.scenes.isDefaultPerf && !!this.scenes.isDefaultPerf[0]
      );
    } else {
      this.togglePerf(
        !!this.scenes.isDefaultPerf && !!this.scenes.isDefaultPerf[1]
      );
    }

    perfEl.onclick = () => {
      this.togglePerf(true);
    };
    qualityEl.onclick = () => {
      this.togglePerf(false);
    };

    this.language = 'en';
  },
  togglePerf: function (isPerformance) {
    this.performance = isPerformance;
    const selectedColor = '#b39760';
    const defaultColor = '#d4c9ba';
    const perfEl = document.querySelector('#perf');
    const qualityEl = document.querySelector('#quality');

    if (!isPerformance) {
      qualityEl.style.borderColor = selectedColor;
      qualityEl.style.opacity = '1';
      perfEl.style.borderColor = defaultColor;
      perfEl.style.opacity = '0.6';

      let elements = document.getElementsByClassName('performance');
      for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute('visible', true);
      }
      return;
    }

    perfEl.style.borderColor = selectedColor;
    perfEl.style.opacity = '1';
    qualityEl.style.borderColor = defaultColor;
    qualityEl.style.opacity = '0.6';
    let elements = document.getElementsByClassName('performance');
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute('visible', false);
    }
  },
  applyStyle: ({ selectedKey, elements }) => {
    const selectedColor = '#f9f9f9';
    const selectedTextColor = '#191f29';
    const defaultColor = 'transparent';
    const defaultTextColor = '#f9f9f9';
    const selectedOpacity = 1;
    const defaultOpacity = 1;
    Object.entries(elements).forEach(([key, element]) => {
      const isSelected = key === selectedKey;
      element.style.backgroundColor = isSelected ? selectedColor : defaultColor;
      element.style.opacity = isSelected ? selectedOpacity : defaultOpacity;
      element.style.color = isSelected ? selectedTextColor : defaultTextColor;
    });
  },
  // ----- Languages functions --------
  initLanguage: function (lang = 'en') {
    const elements = {
      enEl: document.querySelector('#language-en'),
      frEl: document.querySelector('#language-fr'),
      offEl: document.querySelector('#language-off')
    };
    const { enEl, frEl, offEl } = elements;
    if (!enEl || !frEl) {
      return;
    }
    this.language = lang;
    const selectEn = () => {
      this.language = 'en';
      this.applyStyle({ selectedKey: 'enEl', elements });
    };
    const selectFr = () => {
      this.language = 'fr';
      this.applyStyle({ selectedKey: 'frEl', elements });
    };
    const selectOff = () => {
      this.language = 'off';
      this.applyStyle({ selectedKey: 'offEl', elements });
    };

    if (this.language === 'fr') {
      selectFr();
    } else if (this.language === 'en') {
      selectEn();
    } else {
      selectOff();
    }

    enEl.onclick = () => {
      selectEn();
    };
    frEl.onclick = () => {
      selectFr();
    };
    offEl.onclick = () => {
      selectOff();
    };
  },
  switchAmbiantElements: function (enabled) {
    let ambiantOnElements =
      document.getElementsByClassName('ambiant-mode-show');
    for (let i = 0; i < ambiantOnElements.length; i++) {
      ambiantOnElements[i].setAttribute('visible', enabled);
    }

    let ambiantOffElements =
      document.getElementsByClassName('ambiant-mode-hide');
    for (let i = 0; i < ambiantOffElements.length; i++) {
      ambiantOffElements[i].setAttribute('visible', !enabled);
    }
  },
  initAmbiantMode: function (mode = false) {
    const elements = {
      ambiantOnEl: document.querySelector('#ambiant-on'),
      ambiantOffEl: document.querySelector('#ambiant-off')
    };
    const { ambiantOnEl, ambiantOffEl } = elements;
    if (!ambiantOnEl || !ambiantOffEl) {
      return;
    }
    this.ambiantMode = mode;
    const selectOn = () => {
      this.ambiantMode = true;
      this.applyStyle({ selectedKey: 'ambiantOnEl', elements });
      this.switchAmbiantElements(true);
      document.querySelector('#menu-language').style.display = 'none';
      this.initLanguage('off');
    };
    const selectOff = () => {
      this.ambiantMode = false;
      this.applyStyle({ selectedKey: 'ambiantOffEl', elements });
      this.switchAmbiantElements(false);
      document.querySelector('#menu-language').style.display = 'flex';
      this.initLanguage('en');
    };

    if (this.ambiantMode) {
      selectOn();
    } else {
      selectOff();
    }

    ambiantOnEl.onclick = () => {
      selectOn();
    };
    ambiantOffEl.onclick = () => {
      selectOff();
    };
  },
  getVoice(element) {
    if (this.language === 'off') {
      return false;
    }
    const voiceSound = document.getElementById(
      this.languages[this.language][element]
    );
    if (voiceSound && voiceSound.volume) {
      voiceSound.volume = 0.8;
    }
    return voiceSound;
  }
});

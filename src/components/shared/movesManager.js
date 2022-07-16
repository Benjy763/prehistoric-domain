/*
  This is the curve/movement management file.
*/

import { Scenes } from '../scenes.config';

AFRAME.registerSystem('movesManager', {
  schema: {},
  init: function () {
    this.scenes = Scenes;
    this.isWalkEnabled = null;
  },
  getSystem: function () {
    if (!this.system) {
      this.system = document.querySelector('a-scene').systems['system'];
    }
    return this.system;
  },
  // ----- Movement functions --------
  checkBoundLimits(cameraPosition) {
    if (this.isWalkEnabled === null) {
      return;
    }
    if (cameraPosition.x < this.scenes.walkBounds.x[0]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          x: this.scenes.walkBounds.x[0],
        },
        cameraPosition
      );
    } else if (cameraPosition.x > this.scenes.walkBounds.x[1]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          x: this.scenes.walkBounds.x[1],
        },
        cameraPosition
      );
    } else if (cameraPosition.z < this.scenes.walkBounds.z[0]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          z: this.scenes.walkBounds.z[0],
        },
        cameraPosition
      );
    } else if (cameraPosition.z > this.scenes.walkBounds.z[1]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          z: this.scenes.walkBounds.z[1],
        },
        cameraPosition
      );
    }
  },
  enableWalk() {
    const actualScene = this.getSystem().getActualSceneObject();
    if (this.isWalkEnabled === true) {
      return;
    } else {
      this.isWalkEnabled = true;
    }

    const car = document.getElementById(actualScene.car);
    car.querySelector('#' + actualScene.camera).setAttribute('wasd-controls', {
      acceleration: 10,
      enabled: true,
    });
  },
  disableWalk() {
    const actualScene = this.getSystem().getActualSceneObject();
    if (this.isWalkEnabled === false) {
      return;
    } else {
      this.isWalkEnabled = false;
    }

    const car = document.getElementById(actualScene.car);
    car.querySelector('#' + actualScene.camera).setAttribute('wasd-controls', {
      acceleration: 10,
      enabled: false,
    });
  },
  getCameraPosition() {
    const actualScene = this.getSystem().getActualSceneObject();
    return document.querySelector('#' + actualScene.camera).object3D.position;
  },
  setCameraPosition(newPosition, cameraPosition) {
    if (!cameraPosition) {
      cameraPosition = this.getCameraPosition();
    }
    cameraPosition.x = newPosition.x;
    cameraPosition.z = newPosition.z;
  },
  getRigPosition() {
    const actualScene = this.getSystem().getActualSceneObject();
    return document
      .querySelector('#' + actualScene.car + ' #rig')
      .getAttribute('position');
  },
  setRigPosition(position) {
    const actualScene = this.getSystem().getActualSceneObject();
    document
      .querySelector('#' + actualScene.car + ' #rig')
      .setAttribute('position', position);
  },
  // ----- Curve functions --------
  // Move an object on the given curve according to given speed
  moveOnCurve(object, curve, marker, speed, axe = 'xz', updateRotation = true) {
    marker += speed;
    object.position.copy(
      this.convertPosition(curve.getPointAt(marker), object, axe)
    );
    if (updateRotation) {
      this.updateRotation(object, curve, marker, speed, axe);
    }
    return marker;
  },
  // Give to the given object the new rotation position after moving on the curve
  updateRotation: function (object, curve, marker, speed, axe) {
    const newPosition = this.convertPosition(
      curve.getPointAt(marker + speed),
      object,
      axe
    );
    object.lookAt(newPosition.x, newPosition.y, newPosition.z);
  },
  // Convert position in x y z object
  convertPosition: function (position2D, object, axe = 'xz') {
    const pos = { ...object.position };
    if (axe === 'xz') {
      pos.x = position2D.x;
      pos.z = position2D.y;
    } else if (axe === 'xy') {
      pos.x = position2D.x;
      pos.y = position2D.y;
    } else if (axe === 'yz') {
      pos.y = position2D.x;
      pos.z = position2D.y;
    } else if (axe === '3d') {
      return position2D;
    }
    return pos;
  },
  // Trunc marker to have better values (ex: 515 instead of 0.5155554)
  truncMarker: function (carMarker) {
    return Math.trunc(carMarker * 1000);
  },
});

/*
  This is the curve/movement management file.
*/

import { Scenes } from '../scenes.config';

AFRAME.registerSystem('movesManager', {
  schema: {
    nextScene: {
      default: null,
    },
  },
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
  // ----- Movement Interactions --------

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
  getCameraRotation() {
    const actualScene = this.getSystem().getActualSceneObject();
    return document.querySelector('#' + actualScene.camera).object3D.rotation;
  },
  setCameraRotation(newRotation, cameraRotation) {
    if (!cameraRotation) {
      cameraRotation = this.cameraRotation();
    }
    cameraRotation.y = newRotation.y;
  },
  getWorldCameraPosition() {
    const actualScene = this.getSystem().getActualSceneObject();
    const cameraEl = document.getElementById(actualScene.camera);
    const worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
    return worldPos;
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
  getWorldRigPosition() {
    const actualScene = this.getSystem().getActualSceneObject();
    const rigPos = document.querySelector(
      '#' + actualScene.car + ' #rig'
    ).object3D;
    const worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(rigPos.matrixWorld);
    return worldPos;
  },
  getRigPosition() {
    const actualScene = this.getSystem().getActualSceneObject();
    return document.querySelector('#' + actualScene.car + ' #rig').object3D
      .position;
  },
  setRigPosition(position) {
    const actualScene = this.getSystem().getActualSceneObject();
    document
      .querySelector('#' + actualScene.car + ' #rig')
      .setAttribute('position', position);
  },
  setRigRotation(rotation) {
    const actualScene = this.getSystem().getActualSceneObject();
    document
      .querySelector('#' + actualScene.car + ' #rig')
      .setAttribute('rotation', rotation);
  },
  fixRigPosition() {
    if (!this.getSystem().canRecenter) {
      return;
    }
    const actualScene = this.getSystem().getActualSceneObject();
    const rigPosConfig = actualScene.rigPos;
    let cameraPos = this.getCameraPosition();
    const offsetX = rigPosConfig.x - cameraPos.x;
    const offsetY = rigPosConfig.y - cameraPos.y;
    const offsetZ = rigPosConfig.z - cameraPos.z;

    //let cameraRot = this.getCameraRotation();
    //this.setRigRotation({ x: 0, y: -cameraRot.y, z: 0 });

    // Manage x and z for cars (not needed for other cause you can move)
    if (actualScene.isVehicule) {
      this.setRigPosition({ x: -offsetX, y: offsetY, z: -offsetZ });
      return;
    }
    const curentRigPos = this.getRigPosition();
    this.setRigPosition({ ...curentRigPos, y: offsetY });
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
  convertPosition: function (position, object, axe = 'xz') {
    const pos = { ...object.position };
    if (axe === 'xz') {
      pos.x = position.x;
      pos.z = position.y;
    } else if (axe === 'xy') {
      pos.x = position.x;
      pos.y = position.y;
    } else if (axe === 'yz') {
      pos.y = position.x;
      pos.z = position.y;
    } else if (axe === '3d') {
      return position;
    }
    return pos;
  },
  // Trunc marker to have better values (ex: 515 instead of 0.5155554)
  truncMarker: function (carMarker) {
    return Math.trunc(carMarker * 1000);
  },
});

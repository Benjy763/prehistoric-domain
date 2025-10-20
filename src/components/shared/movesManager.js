/*
  This is the curve/movement management file.
*/

import { Scenes } from '../scenes.config';

AFRAME.registerSystem('movesManager', {
  schema: {
    nextScene: {
      default: null
    }
  },
  init: function () {
    this.scenes = Scenes;
    this.isWalkEnabled = null;
    this.savedPosition = null;
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
          x: this.scenes.walkBounds.x[0]
        },
        cameraPosition
      );
    } else if (cameraPosition.x > this.scenes.walkBounds.x[1]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          x: this.scenes.walkBounds.x[1]
        },
        cameraPosition
      );
    } else if (cameraPosition.z < this.scenes.walkBounds.z[0]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          z: this.scenes.walkBounds.z[0]
        },
        cameraPosition
      );
    } else if (cameraPosition.z > this.scenes.walkBounds.z[1]) {
      this.setCameraPosition(
        {
          ...cameraPosition,
          z: this.scenes.walkBounds.z[1]
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
      enabled: true
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
      enabled: false
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
  getWorldPosition(element) {
    if (!element) {
      return;
    }
    const worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(element.object3D.matrixWorld);
    return worldPos;
  },
  getWorldCameraPosition() {
    const actualScene = this.getSystem().getActualSceneObject();
    const cameraEl = document.getElementById(actualScene.camera);
    return this.getWorldPosition(cameraEl);
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
  getRigRotation() {
    const actualScene = this.getSystem().getActualSceneObject();
    return document.querySelector('#' + actualScene.car + ' #rig').object3D
      .rotation;
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
  distanceFromPoint(pointId) {
    const pointIdPos = this.getWorldPosition(document.getElementById(pointId));
    const rigPosition = this.getWorldCameraPosition();
    const a = rigPosition.x - pointIdPos.x;
    const b = rigPosition.z - pointIdPos.z;

    return Math.sqrt(a * a + b * b);
  },
  // ----- Curve functions --------
  // Move an object on the given curve according to given speed
  moveOnCurve: function (objectConfig, object, curve, marker, speed, options) {
    const {
      turn180 = false,
      useDeltaTime = false,
      needUpdateTime = false,
      needLookAt = true
    } = options || {};

    if (marker === 0 || needUpdateTime) {
      objectConfig.lastUpdateTime = performance.now();
    }
    // Calculate delta time
    const time = performance.now();
    const timeDelta = time - objectConfig.lastUpdateTime;
    // useDeltaTime for legacy compatibility
    let deltaTime = useDeltaTime ? timeDelta / 1000 : 1;
    if (!deltaTime) {
      deltaTime = 0.033; // 30fps on first round
    }
    objectConfig.lastUpdateTime = time;

    // Update marker on curve
    marker = marker + speed * deltaTime;
    if (marker > curve.getLength()) {
      marker = marker - curve.getLength();
    }
    const position = curve.getPointAt(marker);
    if (!position) return marker; // Vérifier si position est undefined

    // Update object position and orientation
    object.position.copy(position);
    const tangent = curve.getTangentAt(marker).normalize();
    if (turn180) {
      tangent.negate();
    }
    if (needLookAt) {
      object.lookAt(position.clone().add(tangent));
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
  }
});

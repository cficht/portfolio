import * as THREE from 'three';

export const desktopPositionsHome = (cameraDepth, setWidth) => {
  return {
    cameraMainPos: new THREE.Vector3(0, 0, cameraDepth),
    cameraStartPos: new THREE.Vector3(0, 2250, cameraDepth),
    sunObject: new THREE.Vector3(3500 * (setWidth / 1440), 1500, -4000),
    airplaneObject: new THREE.Vector3(-3500 * (setWidth / 1440), 1500, -4000),
    treeObject: new THREE.Vector3(-3500 * (setWidth / 1440), -1800, -4000),
    rockObject: new THREE.Vector3(3500 * (setWidth / 1440), -2400, -4000),
    grassObject: new THREE.Vector3(3500 * (setWidth / 1440), -2415, -3990),
    cssObject: new THREE.Vector3(0, 200, -2000),
    planeObject: new THREE.Vector3(0, 200, -2000),
    frameObject: new THREE.Vector3(0, 200, -2000),
    nameObject: new THREE.Vector3(-10, 300, -2000),
    titleObject: new THREE.Vector3(0, 100, -2000),
    projectObject: new THREE.Vector3(1200, -1714.5, -2000),
    projectIcon: new THREE.Vector3(1200, -1400, -2000),
    techObject: new THREE.Vector3(400, -1700, -2000),
    techIcon: new THREE.Vector3(400, -1400, -2000),
    contactObject: new THREE.Vector3(-400, -1700, -2000),
    contactIcon: new THREE.Vector3(-400, -1400, -2000),
    aboutObject: new THREE.Vector3(-1200, -1700, -2000),
    aboutIcon: new THREE.Vector3(-1200, -1400, -2000)
  };
};

export const mobilePositionsHome = (cameraDepth, setWidth) => {
  return {
    cameraMainPos: new THREE.Vector3(0, 0, cameraDepth),
    cameraStartPos: new THREE.Vector3(0, 2250, cameraDepth),
    sunObject: new THREE.Vector3(3750 * (setWidth / 1440), 1500, -4000),
    airplaneObject: new THREE.Vector3(-4200 * (setWidth / 1440), 1500, -4000),
    treeObject: new THREE.Vector3(-3500 * (setWidth / 1440), -1800, -4000),
    rockObject: new THREE.Vector3(4250 * (setWidth / 1440), -2425, -4000),
    grassObject: new THREE.Vector3(4250 * (setWidth / 1440), -2435, -3990),
    cssObject: new THREE.Vector3(0, 0, -2000),
    planeObject: new THREE.Vector3(0, 0, -2000),
    frameObject: new THREE.Vector3(0, 0, -2000),
    nameObject: new THREE.Vector3(-10, 100, -2000),
    titleObject: new THREE.Vector3(0, -100, -2000),
    projectObject: new THREE.Vector3(900, -2450, -2000),
    projectIcon: new THREE.Vector3(900, -2135.5, -2000),
    techObject: new THREE.Vector3(300, -2435.5, -2000),
    techIcon: new THREE.Vector3(300, -2135.5, -2000),
    contactObject: new THREE.Vector3(-300, -2435.5, -2000),
    contactIcon: new THREE.Vector3(-300, -2135.5, -2000),
    aboutObject: new THREE.Vector3(-900, -2435.5, -2000),
    aboutIcon: new THREE.Vector3(-900, -2135.5, -2000)
  };
};

import * as THREE from 'three';

export const desktopPositionsHome = (cameraDepth) => {
  return {
    cameraMain: new THREE.Vector3(0, 0, cameraDepth),
    cameraStart: new THREE.Vector3(0, 2250, cameraDepth),
    sunObject: new THREE.Vector3(3500, 1500, -4000),
    airplaneObject: new THREE.Vector3(-3500, 1500, -4000),
    treeObject: new THREE.Vector3(-3500, -1800, -4000),
    rockObject: new THREE.Vector3(3500, -2400, -4000),
    grassObject: new THREE.Vector3(3500, -2415, -3990),
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

export const mobilePositionsHome = (cameraDepth) => {
  return {
    cameraMain: new THREE.Vector3(0, 0, cameraDepth),
    cameraStart: new THREE.Vector3(0, 2250, cameraDepth),
    sunObject: new THREE.Vector3(1000, 1500, -4000),
    airplaneObject: new THREE.Vector3(-1000, 1500, -4000),
    treeObject: new THREE.Vector3(-1000, -1800, -4000),
    rockObject: new THREE.Vector3(1000, -2425, -4000),
    grassObject: new THREE.Vector3(1000, -2435, -3990),
    cssObject: new THREE.Vector3(0, 0, -1700),
    planeObject: new THREE.Vector3(0, 0, -1700),
    frameObject: new THREE.Vector3(0, 0, -1700),
    nameObject: new THREE.Vector3(-10, 100, -1700),
    titleObject: new THREE.Vector3(0, -100, -1700),
    projectObject: new THREE.Vector3(900, -2450, -1700),
    projectIcon: new THREE.Vector3(900, -2135.5, -1700),
    techObject: new THREE.Vector3(300, -2435.5, -1700),
    techIcon: new THREE.Vector3(300, -2135.5, -1700),
    contactObject: new THREE.Vector3(-300, -2435.5, -1700),
    contactIcon: new THREE.Vector3(-300, -2135.5, -1700),
    aboutObject: new THREE.Vector3(-900, -2435.5, -1700),
    aboutIcon: new THREE.Vector3(-900, -2135.5, -1700)
  };
};

export const aboutPos = {
  cameraMain: new THREE.Vector3(0, -850, 1400),
  treeObject: new THREE.Vector3(200, 5100, 0),
  treeTopObject: new THREE.Vector3(200, 2200, 25),
  treeTopObject2: new THREE.Vector3(200, 2200, -25),
  grassObject: new THREE.Vector3(0, -2250, 100),
  grassObject2: new THREE.Vector3(0, -2250, -100),
  cssObject: new THREE.Vector3(0, -800, 50),
  planeObject: new THREE.Vector3(0, -800, 50),
  frameObject: new THREE.Vector3(0, -800, 50),
  cssObject2: new THREE.Vector3(0, -800, -50),
  planeObject2: new THREE.Vector3(0, -800, -50),
  frameObject2: new THREE.Vector3(0, -800, -50),
  nameObject: new THREE.Vector3(-10, 300, 50),
  logoObject: new THREE.Vector3(0, 900, -3500),
  leftArrowObjectFront: new THREE.Vector3(-100, -1550, 100), 
  rightArrowObjectFront: new THREE.Vector3(100, -1550, 100),
  leftArrowObjectBack: new THREE.Vector3(-100, -1550, -100), 
  rightArrowObjectBack: new THREE.Vector3(100, -1550, -100),
  gitHubObject: new THREE.Vector3(-450, -2100, -2500),
  siteObject: new THREE.Vector3(450, -2100, -2500)
};

export const techPos = {
  cameraMain: new THREE.Vector3(0, 100, 400),
  sunObject: new THREE.Vector3(0, 200, 0),
  nameObject: new THREE.Vector3(0, 900, 1300),
  leftArrowObject: new THREE.Vector3(-50, -350, 1300), 
  rightArrowObject: new THREE.Vector3(50, -350, 1300),
  categoryObject: new THREE.Vector3(-100, -675, 1300),
  upArrowObject: new THREE.Vector3(300, -650, 1300), 
  downArrowObject: new THREE.Vector3(300, -700, 1300)
};

export const projectPos = {
  cameraMain: new THREE.Vector3(0, -1500, -3500),
  rockObject: new THREE.Vector3(-1500, -1950, -3450),
  rockObject2: new THREE.Vector3(1500, -1850, -3450),
  rockObject3: new THREE.Vector3(-1800, -1850, -3050),
  rockObject4: new THREE.Vector3(1900, -2150, -2950),
  grassObject: new THREE.Vector3(0, -2250, -2800),
  cssObject: new THREE.Vector3(0, -1350, -3500),
  planeObject: new THREE.Vector3(0, -1350, -3500),
  frameObject: new THREE.Vector3(0, -1350, -3500),
  nameObject: new THREE.Vector3(-10, -350, -3500),
  logoObject: new THREE.Vector3(0, 900, -3500),
  leftArrowObject: new THREE.Vector3(-100, -2100, -2500), 
  rightArrowObject: new THREE.Vector3(100, -2100, -2500),
  gitHubObject: new THREE.Vector3(-450, -2100, -2500),
  siteObject: new THREE.Vector3(450, -2100, -2500)
};

export const contactPos = {
  cameraMain: new THREE.Vector3(0, -50, -3500),
  airplaneObject: new THREE.Vector3(0, 200, -3500),
  nameObject: new THREE.Vector3(-10, 1000, -3500),
  emailObject: new THREE.Vector3(-650, -650, -3500),
  emailText: new THREE.Vector3(-650, -950, -3500),
  linkedinObject: new THREE.Vector3(0, -650, -3500),
  linkedinText: new THREE.Vector3(0, -950, -3500),
  gitHubObject: new THREE.Vector3(650, -650, -3500),
  gitHubText: new THREE.Vector3(650, -950, -3500)
};
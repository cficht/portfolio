import * as THREE from 'three';

export const desktopPositionsHome = (cameraDepth) => {
  return {
    cameraMain: new THREE.Vector3(0, 0, -2000),
    cameraStart: new THREE.Vector3(0, 6500, cameraDepth),
    sunObject: new THREE.Vector3(3500, 1500, -4000),
    airplaneObject: new THREE.Vector3(-3500, 1500, -4000),
    treeObject: new THREE.Vector3(-3500, -1850, -4000),
    rockObject: new THREE.Vector3(3500, -2450, -4000),
    grassObject: new THREE.Vector3(3500, -2465, -3990),
    grassObject2: new THREE.Vector3(-3500, -2465, -3990),
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
    cameraMain: new THREE.Vector3(0, 0, -2000),
    cameraStart: new THREE.Vector3(0, 6500, cameraDepth),
    sunObject: new THREE.Vector3(1000, 1500, -4000),
    airplaneObject: new THREE.Vector3(-1100, 1500, -4000),
    treeObject: new THREE.Vector3(-1000, -1850, -4000),
    rockObject: new THREE.Vector3(1000, -2475, -4000),
    grassObject: new THREE.Vector3(1000, -2490, -3990),
    grassObject2: new THREE.Vector3(-1000, -2465, -3990),
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
  cameraMain: new THREE.Vector3(0, -850, 0),
  treeObject: new THREE.Vector3(200, 4400, 0),
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
  sunObject: new THREE.Vector3(0, 250, 0),
  nameObject: new THREE.Vector3(0, 1000, 1300),
  leftArrowObject: new THREE.Vector3(-50, -300, 1300), 
  rightArrowObject: new THREE.Vector3(50, -300, 1300),
  categoryObject: new THREE.Vector3(-125, -575, 1300),
  upArrowObject: new THREE.Vector3(325, -525, 1300), 
  downArrowObject: new THREE.Vector3(325, -625, 1300)
};

export const projectPos = {
  cameraMain: new THREE.Vector3(0, -1500, -3500),
  rockObject: new THREE.Vector3(-1500, -2050, -3350),
  rockObject2: new THREE.Vector3(1500, -1950, -3350),
  rockObject3: new THREE.Vector3(-1800, -1950, -3050),
  rockObject4: new THREE.Vector3(1900, -2250, -2950),
  grassObject: new THREE.Vector3(0, -2350, -2800),
  cssObject: new THREE.Vector3(0, -1450, -3500),
  planeObject: new THREE.Vector3(0, -1450, -3500),
  frameObject: new THREE.Vector3(0, -1450, -3500),
  pageObject: new THREE.Vector3(-10, -300, -3500),
  nameObject: new THREE.Vector3(-10, -625, -3500),
  logoObject: new THREE.Vector3(0, 900, -3500),
  leftArrowObject: new THREE.Vector3(-100, -2200, -2500), 
  rightArrowObject: new THREE.Vector3(100, -2200, -2500),
  gitHubObject: new THREE.Vector3(-450, -2200, -2500),
  siteObject: new THREE.Vector3(450, -2200, -2500)
};

export const contactPos = {
  cameraMain: new THREE.Vector3(0, -50, -3500),
  airplaneObject: new THREE.Vector3(0, 200, -3500),
  nameObject: new THREE.Vector3(-10, 1000, -3500),
  emailObject: new THREE.Vector3(-975, -650, -3500),
  emailText: new THREE.Vector3(-975, -950, -3500),
  linkedinObject: new THREE.Vector3(-325, -650, -3500),
  linkedinText: new THREE.Vector3(-325, -950, -3500),
  gitHubObject: new THREE.Vector3(325, -650, -3500),
  gitHubText: new THREE.Vector3(325, -950, -3500),
  resumeObject: new THREE.Vector3(975, -650, -3500),
  resumeText: new THREE.Vector3(975, -950, -3500)
};

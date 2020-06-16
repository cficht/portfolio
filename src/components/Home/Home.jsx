import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createBlankCSSObject } from '../../utilities/initialize-page';
import { createBackground, createClouds, createSun, createAirplane, createTree, createRock, create3DText, createIcon, createPictureFrame } from '../../utilities/create-objects';
import { clouds, field, project, tech, contact, about } from '../../data/objects';
import styles from './Home.css';

const Home = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, cloudObjects, sunObject, airplaneObject, treeObject, rockObject, nameObject, titleObject, projectObject, projectIconObject, techObject, techIconObject, contactObject, contactIconObject, aboutObject, aboutIconObject, selectedObject, targetObject;
  let cameraDepth = 2750;
  let cameraStart = false;
  let navigateOn = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  let initialPos = {
    sunObject: new THREE.Vector3(3500 * (setWidth / 1440), 1500, -4000),
    airplaneObject: new THREE.Vector3(-3500 * (setWidth / 1440), 1500, -4000),
    treeObject: new THREE.Vector3(-3500 * (setWidth / 1440), -1800, -4000),
    rockObject: new THREE.Vector3(3500 * (setWidth / 1440), -2400, -4000),
    cssObject: new THREE.Vector3(0, 200, -2000),
    planeObject: new THREE.Vector3(0, 200, -2000),
    frameObject: new THREE.Vector3(0, 200, -2000),
    nameObject: new THREE.Vector3(-10, 300, -2000),
    titleObject: new THREE.Vector3(0, 100, -2000),
    cameraMainPos: new THREE.Vector3(0, 0, cameraDepth),
    cameraStartPos: new THREE.Vector3(0, 2250, cameraDepth),
    projectObject: new THREE.Vector3(1200, -1700, -2000),
    projectIcon: new THREE.Vector3(1200, -1400, -2000),
    techObject: new THREE.Vector3(400, -1700, -2000),
    techIcon: new THREE.Vector3(400, -1400, -2000),
    contactObject: new THREE.Vector3(-400, -1700, -2000),
    contactIcon: new THREE.Vector3(-400, -1400, -2000),
    aboutObject: new THREE.Vector3(-1200, -1700, -2000),
    aboutIcon: new THREE.Vector3(-1200, -1400, -2000)
  };

  // INITIALIZE PAGE
  useEffect(() => {

    // CAMERA
    if(navigator.userAgent.match(/Android/i) 
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) { 
      cameraDepth = 5000;
      initialPos.projectObject = new THREE.Vector3(1050, -2250, -1000);
      initialPos.projectIcon = new THREE.Vector3(1050, -1950, -1000);
      initialPos.techObject = new THREE.Vector3(350, -2250, -1000);
      initialPos.techIcon = new THREE.Vector3(350, -1950, -1000);
      initialPos.contactObject = new THREE.Vector3(-350, -2250, -1000);
      initialPos.contactIcon = new THREE.Vector3(-350, -1950, -1000);
      initialPos.aboutObject = new THREE.Vector3(-1050, -2250, -1000);
      initialPos.aboutIcon = new THREE.Vector3(-1050, -1950, -1000);
      initialPos.sunObject.x += 225;
      initialPos.airplaneObject.x -= 325;
      initialPos.treeObject.x -= 225;
      initialPos.rockObject.x += 450;
      initialPos.cssObject.y = 0;
      initialPos.planeObject.y = 0;
      initialPos.frameObject.y = 0;
      initialPos.nameObject.y = 100;
      initialPos.titleObject.y = -100;
    }
    camera = new THREE.PerspectiveCamera(45, setWidth / setHeight, 1, 15000);
    camera.position.set(0, 0, cameraDepth);
  
    // RENDERERS
    glRenderer = createGlRenderer(setWidth, setHeight, styles.three_box);
    cssRenderer = createCssRenderer(setWidth, setHeight, styles.three_box); 
    const holder = document.createElement('div');
    holder.className = styles.three_box;
    document.body.appendChild(holder);
    holder.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(glRenderer.domElement);
  
    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x555555);
    glScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 300).normalize();
    glScene.add(directionalLight);
  
    // SCENE
    backgroundObject = createBackground(field);
    glScene.add(backgroundObject);

    cloudObjects = createClouds(clouds);
    cloudObjects.map(cloudObject => glScene.add(cloudObject));

    sunObject = createSun(973, 973, initialPos.sunObject);
    glScene.add(sunObject);

    airplaneObject = createAirplane(920, 311, initialPos.airplaneObject);
    glScene.add(airplaneObject);

    treeObject = createTree(6814, 7571, initialPos.treeObject);
    glScene.add(treeObject);

    rockObject = createRock(797, 340, initialPos.rockObject);
    glScene.add(rockObject);

    createHomePage(1400, 800, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;
    controls.maxPolarAngle = 2;
    controls.minPolarAngle = 1;
    controls.minDistance = 700;
    controls.maxDistance = 4000;
    controls.enableKeys = false;

    // ON START
    camera.position.set(initialPos.cameraStartPos.x, initialPos.cameraStartPos.y, cameraDepth);
    camera.rotation.x = .5;
    cameraStart = true;
    controls.enabled = false;

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('click', onClick, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createHomePage(width, height, position, rotation) {  
    const planeObject = createPlane(width, height, position, rotation);  
    glScene.add(planeObject);  
 
    const cssObject = createBlankCSSObject(width, height, position, rotation, styles.project);  
    cssScene.add(cssObject);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText(nameObject, glScene, '#228B22', initialPos.nameObject, 100, 100, 100, 'Chris Ficht', 'muli_regular')
      .then(name => nameObject = name);
    create3DText(titleObject, glScene, '#558E40', initialPos.titleObject, 60, 60, 60, 'Software Developer', 'muli_regular')
      .then(title => titleObject = title);

    create3DText(projectObject, glScene, '#ff8c00', initialPos.projectObject, 60, 60, 60, 'Portfolio', 'muli_regular', 'PROJECTS')
      .then(project => projectObject = project);
    create3DText(techObject, glScene, '#ff8c00', initialPos.techObject, 60, 60, 60, 'Tech', 'muli_regular', 'TECH')
      .then(tech => techObject = tech);
    create3DText(contactObject, glScene, '#ff8c00', initialPos.contactObject, 60, 60, 60, 'Contact', 'muli_regular', 'CONTACT')
      .then(contact => contactObject = contact);
    create3DText(aboutObject, glScene, '#ff8c00', initialPos.aboutObject, 60, 60, 60, 'About', 'muli_regular', 'ABOUT')
      .then(about => aboutObject = about);


    if(!projectIconObject) createIcon(glScene, initialPos.projectIcon, project)
      .then(projectIcon => projectIconObject = projectIcon);
    if(!techIconObject) createIcon(glScene, initialPos.techIcon, tech)
      .then(techIcon => techIconObject = techIcon);
    if(!contactIconObject) createIcon(glScene, initialPos.contactIcon, contact)
      .then(contactIcon => contactIconObject = contactIcon);
    if(!aboutIconObject) createIcon(glScene, initialPos.aboutIcon, about)
      .then(aboutIcon => aboutIconObject = aboutIcon);

    const frameSize = {
      x: 800,
      y: 800,
      z: 512
    };
    createPictureFrame(glScene, frameSize, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
  }

  // INTERACTION
  function onClick(event) {
    if(cameraStart || navigateOn) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'PROJECTS') {
        targetObject = { 
          position: initialPos.rockObject,
          url: '/projects'
        };
        navigateOn = true;
      }
      if(selectedObject.object.userData === 'TECH') {
        targetObject = { 
          position: initialPos.sunObject,
          url: '/tech'
        };
        navigateOn = true;
      }
      if(selectedObject.object.userData === 'CONTACT') {
        targetObject = { 
          position: initialPos.airplaneObject,
          url: '/contact'
        };
        navigateOn = true;
      }
      if(selectedObject.object.userData === 'ABOUT') {
        targetObject = { 
          position: initialPos.treeObject,
          url: '/about'
        };
        navigateOn = true;
      }
    }
  }

  // CONSTANT UPDATE
  function update() { 
    if(cameraStart) {
      if(camera.rotation.x > 0) camera.rotation.x -= .00225;
      else camera.rotation.x = 0;
      if(camera.position.y > initialPos.cameraMainPos.y) camera.position.y -= 10;
      else {
        camera.position.set(initialPos.cameraMainPos.x, initialPos.cameraMainPos.y, cameraDepth);
        camera.rotation.x = 0;
        cameraStart = false;
        controls.enabled = true;
      }
    }

    if(navigateOn) {
      controls.enabled = false;
      if(controls.target.z > targetObject.position.z) controls.target.z -= 25;
      if(controls.target.y > targetObject.position.y) controls.target.y -= 25;
      if(controls.target.y < targetObject.position.y) controls.target.y += 25;
      if(controls.target.x > targetObject.position.x) controls.target.x -= 25;
      if(controls.target.x < targetObject.position.x) controls.target.x += 25;
      controls.update();    
      if(camera.position.z > targetObject.position.z) camera.position.z -= 25;
      if(camera.position.y > targetObject.position.y) camera.position.y -= 25;
      if(camera.position.y < targetObject.position.y) camera.position.y += 25;
      if(camera.position.x > targetObject.position.x) camera.position.x -= 25;
      if(camera.position.x < targetObject.position.x) camera.position.x += 25;
      if(camera.position.z < 0) {
        navigateOn = false;
        window.location = targetObject.url;
      }
    }

    if(projectIconObject) projectIconObject.rotation.y += .05;
    if(techIconObject) techIconObject.rotation.y += .05;
    if(contactIconObject) contactIconObject.rotation.y += .05;
    if(aboutIconObject) aboutIconObject.rotation.y += .05;

    cloudObjects.map(cloud => cloud.position.x >= 6000 ? cloud.position.x = -6000 : cloud.position.x += 5);
    
    glRenderer.render(glScene, camera);  
    cssRenderer.render(cssScene, camera);
    requestAnimationFrame(update);
  }

  return (
    <>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Home;

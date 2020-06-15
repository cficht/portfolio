import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createAboutCSSObject } from '../../utilities/initialize-page';
import { createBackground, createClouds, createSun, createAirplane, createTree, create3DText, createPictureFrame, createIcon } from '../../utilities/create-objects';
import { randomLogo } from '../../utilities/create-other';
import { about } from '../../data/info';
import { clouds, field, projectLogos, techLogos, contactIcons } from '../../data/objects';
import styles from './Home.css';

const Home = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, cloudObjects, sunObject, airplaneObject, treeObject, cssObject, planeObject, frameObject, nameObject, titleObject, projectObject, projLogoObject, techObject, techLogoObject, contactObject, contactIconObject, selectedObject, targetObject;
  let cameraDepth = 2750;
  let cameraStart = false;
  let navigateOn = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    sunObject: new THREE.Vector3(4000, 1500, -4000),
    airplaneObject: new THREE.Vector3(-4000, 1100, -4000),
    treeObject: new THREE.Vector3(2000, -1700, -4000),
    cssObject: new THREE.Vector3(0, 0, 0),
    planeObject: new THREE.Vector3(0, 0, 0),
    frameObject: new THREE.Vector3(0, 0, 0),
    nameObject: new THREE.Vector3(-10, 800, 0),
    titleObject: new THREE.Vector3(0, 600, 0),
    cameraMainPos: new THREE.Vector3(0, 0, cameraDepth),
    cameraStartPos: new THREE.Vector3(0, 2250, cameraDepth),
    projectObject: new THREE.Vector3(0, -1700, -2000),
    projectLogo: new THREE.Vector3(0, -1400, -2000),
    techObject: new THREE.Vector3(2900, -1700, -2000),
    techLogo: new THREE.Vector3(2900, -1400, -2000),
    contactObject: new THREE.Vector3(-2900, -1700, -2000),
    contactIcon: new THREE.Vector3(-2900, -1400, -2000)
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
    || navigator.userAgent.match(/Windows Phone/i)) cameraDepth = 4000;
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

    createAboutPage(1000, 600, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
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
    // camera.position.set(initialPos.cameraStartPos.x, initialPos.cameraStartPos.y, cameraDepth);
    // camera.rotation.x = .5;
    // controls.enabled = false;
    // cameraStart = true;
    // controls.enableZoom = false;
    // controls.enableRotate = false;
    // controls.enablePan = false;

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('click', onClick, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createAboutPage(width, height, position, rotation, number) {  
    if(!planeObject) { 
      planeObject = createPlane(width, height, position, rotation);  
      glScene.add(planeObject);  
    }
    
    if(!cssObject) {
      cssObject = createAboutCSSObject(width, height, position, rotation, number, about, styles.project);  
      cssScene.add(cssObject);
    } else {
      const newPos = cssObject.position;
      cssScene.remove(cssObject);
      cssObject = createAboutCSSObject(width, height, newPos, rotation, number, about, styles.project);  
      cssScene.add(cssObject);
    }

    create3DText(nameObject, glScene, '#558E40', initialPos.nameObject, 100, 100, 100, 'Chris Ficht', 'muli_regular')
      .then(name => nameObject = name);
    create3DText(titleObject, glScene, '#9FC95C', initialPos.titleObject, 60, 60, 60, 'Software Developer', 'muli_regular')
      .then(title => titleObject = title);
    create3DText(projectObject, glScene, '#ff8c00', initialPos.projectObject, 60, 60, 60, 'Projects', 'muli_regular', '/projects')
      .then(project => projectObject = project);
    create3DText(techObject, glScene, '#ff8c00', initialPos.techObject, 60, 60, 60, 'Tech Stack', 'muli_regular', '/tech')
      .then(tech => techObject = tech);
    create3DText(contactObject, glScene, '#ff8c00', initialPos.contactObject, 60, 60, 60, 'Contact', 'muli_regular', '/contact')
      .then(contact => contactObject = contact);

    const randomProjectLogo = randomLogo(projectLogos);
    if(!projLogoObject) createIcon(glScene, initialPos.projectLogo, randomProjectLogo)
      .then(projectLogo => projLogoObject = projectLogo);
    const randomTechLogo = randomLogo(techLogos);
    if(!techLogoObject) createIcon(glScene, initialPos.techLogo, randomTechLogo)
      .then(techLogo => techLogoObject = techLogo);
    const randomContactIcon = randomLogo(contactIcons);
    if(!contactIconObject) createIcon(glScene, initialPos.contactIcon, randomContactIcon)
      .then(contactIcon => contactIconObject = contactIcon);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    const frameSize = {
      x: 575,
      y: 525,
      z: 512
    };
    createPictureFrame(glScene, frameSize, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0))
      .then(frame => frameObject = frame)
      .then(() => console.log(frameObject));
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
      if(selectedObject.object.id === projectObject.id || selectedObject.object.id === projLogoObject.id) {
        targetObject = { 
          position: new THREE.Vector3(0, -1700, -4000),
          url: '/projects'
        };
        navigateOn = true;
      }
      if(selectedObject.object.id === techObject.id || selectedObject.object.id === techLogoObject.id) {
        targetObject = { 
          position: new THREE.Vector3(4000, 1500, -4000),
          url: '/tech'
        };
        navigateOn = true;
      }
      if(selectedObject.object.id === contactObject.id || selectedObject.object.id === contactIconObject.id) {
        targetObject = { 
          position: new THREE.Vector3(-4000, 1500, -4000),
          url: '/contact'
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

    if(projLogoObject) projLogoObject.rotation.y += .05;
    if(techLogoObject) techLogoObject.rotation.y += .05;
    if(contactIconObject) contactIconObject.rotation.y += .05;
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

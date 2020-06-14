import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createAboutCSSObject } from '../../utilities/initialize-page';
import { createBackground, createSun, createClouds, create3DText, createPictureFrame } from '../../utilities/create-objects';
import { about } from '../../data/info';
import { clouds, field } from '../../data/objects';
import styles from './Home.css';

const Home = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, cloudObjects, cssObject, planeObject, frameObject, sunObject, nameObject, titleObject, projectObject, techObject, contactObject, selectedObject, targetObject;
  let cameraDepth = 2750;
  let cameraStart = false;
  let navigateOn = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    cssObject: new THREE.Vector3(0, 0, 0),
    planeObject: new THREE.Vector3(0, 0, 0),
    frameObject: new THREE.Vector3(0, 0, 0),
    sunObject: new THREE.Vector3(4000, 1500, -4000),
    nameObject: new THREE.Vector3(-10, 800, 0),
    titleObject: new THREE.Vector3(0, 600, 0),
    cameraMainPos: new THREE.Vector3(0, 0, cameraDepth),
    cameraStartPos: new THREE.Vector3(0, 2250, cameraDepth),
    projectObject: new THREE.Vector3(0, -1900, -2500),
    techObject: new THREE.Vector3(3100, 1000, -2500),
    contactObject: new THREE.Vector3(-3100, 1000, -2500)
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
    createAboutPage(1000, 600, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    camera.position.set(initialPos.cameraStartPos.x, initialPos.cameraStartPos.y, cameraDepth);
    camera.rotation.x = .5;
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;
    controls.maxPolarAngle = 2;
    controls.minPolarAngle = 1;
    controls.minDistance = 700;
    controls.maxDistance = 4000;
    controls.enableKeys = false;

    // ON START
    controls.enabled = false;
    cameraStart = true;
    // controls.enableZoom = false;
    // controls.enableRotate = false;
    // controls.enablePan = false;
    // camera.position.set(initialPos.cameraStartPos.x, initialPos.cameraStartPos.y, cameraDepth);

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
      if(selectedObject.object.id === projectObject.id) {
        targetObject = projectObject;
        navigateOn = true;
      }
      if(selectedObject.object.id === techObject.id) {
        targetObject = techObject;
        navigateOn = true;
      }
      if(selectedObject.object.id === contactObject.id) {
        targetObject = contactObject;
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
        window.location = targetObject.userData;
      }
    }

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

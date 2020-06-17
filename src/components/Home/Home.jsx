import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createBlankCSSObject } from '../../utilities/initialize-page';
import { createBackground, createClouds, createSun, createAirplane, createTree, createRock, createGrass, create3DText, createIcon, createPictureFrame } from '../../utilities/create-objects';
import { moveView } from '../../utilities/other';
import { clouds, field, project, tech, contact, about } from '../../data/objects';
import { desktopPositionsHome, mobilePositionsHome } from '../../data/positions';
import styles from './Home.css';

const Home = () => {
  let camera, controls, glRenderer, cssRenderer, initialPos, backgroundObject, cloudObjects, sunObject, airplaneObject, treeObject, rockObject, grassObject, cssObject, planeObject, frameObject, nameObject, titleObject, projectObject, projectIconObject, techObject, techIconObject, contactObject, contactIconObject, aboutObject, aboutIconObject, selectedObject, targetObject;
  let cameraDepth = 2750;
  let cameraStart = false;
  let navigateOn = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const desktopPos = desktopPositionsHome(cameraDepth);
  const mobilePos = mobilePositionsHome(cameraDepth);

  // INITIALIZE PAGE
  useEffect(() => {
    window.addEventListener('pageshow', function(event) {
      if(event.persisted) location.reload();
    });

    // CAMERA
    if(navigator.userAgent.match(/Android/i) 
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) { 
      cameraDepth = 4500;
      initialPos = mobilePos;
    } else {
      initialPos = desktopPos;
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

    rockObject = createRock(797, 340, initialPos.rockObject, .02);
    glScene.add(rockObject);

    grassObject = createGrass(1662, 81, initialPos.grassObject, .09);
    glScene.add(grassObject);

    createHomePage(1600, 900, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;
    controls.maxPolarAngle = 2;
    controls.minPolarAngle = 1;
    controls.minDistance = 700;
    controls.maxDistance = 4550;
    controls.enableKeys = false;

    // ON START
    camera.position.set(initialPos.cameraStartPos.x, initialPos.cameraStartPos.y, cameraDepth);
    camera.rotation.x = .5;
    cameraStart = true;
    controls.enabled = false;
    camera.position.set(initialPos.cameraStartPos.x, initialPos.cameraMainPos.y, cameraDepth);

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('click', onClick, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createHomePage(width, height, position, rotation) {  
    planeObject = createPlane(width, height, position, rotation);  
    glScene.add(planeObject);  
 
    cssObject = createBlankCSSObject(width, height, position, rotation, styles.project);  
    cssScene.add(cssObject);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText(nameObject, glScene, '#228B22', initialPos.nameObject, 100, 100, 100, 'Chris Ficht', 'muli_regular', 'NAME')
      .then(name => nameObject = name);
    create3DText(titleObject, glScene, '#558E40', initialPos.titleObject, 60, 60, 60, 'Software Developer', 'muli_regular', 'TITLE')
      .then(title => titleObject = title);

    create3DText(projectObject, glScene, '#ff8c00', initialPos.projectObject, 60, 60, 60, 'Projects', 'muli_regular', 'PROJECTS')
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
    createPictureFrame(glScene, frameSize, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0))
      .then(frame => frameObject = frame);
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
      glScene.children.forEach(child => {
        if(child.userData === 'PROJECTS') child.position.x += 150;
        if(child.userData === 'ABOUT') child.position.x -= 150;
        if(child.userData === 'TECH' || child.userData === 'CONTACT') {
          child.position.z += 100;
          child.userData === 'TECH' ? child.position.x += 50 : child.position.x -= 50 ;
        } 
      });
      nameObject.position.y += 150;
      titleObject.position.y += 150;
      cssObject.position.y += 150;
      planeObject.position.y += 150;
      frameObject.position.y += 150;

      controls.enabled = false;
      moveView(controls, targetObject);
      controls.update();    
      moveView(camera, targetObject);
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

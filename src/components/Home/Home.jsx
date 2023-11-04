import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createBlankCSSObject } from '../../utilities/initialize-page';
import { createBackground, createWall, createClouds, createSun, createAirplane, createTree, createRock, createGrass, create3DText, createIcon, createPictureFrame, manager } from '../../utilities/create-objects';
import { loadingBar } from '../../utilities/other';
import { clouds, project, tech, contact, about, fieldContact } from '../../data/objects';
import { desktopPositionsHome, mobilePositionsHome } from '../../data/positions';
import styles from '../../Main.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import * as TWEEN from '@tweenjs/tween.js';

let
  camera, 
  controls;
let cameraDepth = 4650;
let mobileDepth = 6900;
let maxAz = .2;
let minAz = -.2;

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  let 
    glRenderer, 
    cssRenderer, 
    selectedObject, 
    targetObject,
    initialPos, 
    backgroundObject, 
    cloudObjects, 
    sunObject, 
    airplaneObject, 
    treeObject, 
    rockObject, 
    grassObject, 
    grassObject2,
    cssObject, 
    planeObject, 
    frameObject, 
    nameObject, 
    titleObject, 
    projectObject, 
    projectIconObject, 
    techObject, 
    techIconObject, 
    contactObject, 
    contactIconObject, 
    aboutObject, 
    aboutIconObject,
    quaternionTween,
    positionTween;

  let modelsLoaded = 0;
  let modelsTotal = 0;
  
  let cameraStart = false;
  let navigateOn = false;
  let mobile = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const desktopPos = desktopPositionsHome(cameraDepth);
  const mobilePos = mobilePositionsHome(mobileDepth);

  // INITIALIZE PAGE
  useEffect(() => {
    window.addEventListener('pageshow', function(event) {
      if(event.persisted) location.reload();
    });

    manager.onStart = function(url, itemsLoaded, itemsTotal) {
      modelsLoaded = itemsLoaded;
      modelsTotal = itemsTotal;
    };
    manager.onLoad = function() {
      setTimeout(() => {
        update();
        setIsLoading(false);
      }, 500);
    };
    manager.onProgress = function(url, itemsLoaded, itemsTotal) {
      setTimeout(() => {
        modelsLoaded = itemsLoaded;
        modelsTotal = itemsTotal;
        loadingBar(styles, modelsLoaded, modelsTotal);
      }, 500);
    };

    // CAMERA
    if(navigator.userAgent.match(/Android/i) 
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) { 
      cameraDepth = mobileDepth;
      initialPos = mobilePos;
      mobile = true;
    } else {
      initialPos = desktopPos;
    }
    
    camera = new THREE.PerspectiveCamera(45, setWidth / setHeight, 1, 15000);
    camera.position.set(0, 0, cameraDepth - 2000);
  
    // RENDERERS
    glRenderer = createGlRenderer(setWidth, setHeight, styles.three_box);
    cssRenderer = createCssRenderer(setWidth, setHeight, styles.three_box); 
    const holder = document.createElement('div');
    holder.className = styles.three_box;
    document.body.appendChild(holder);
    holder.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(glRenderer.domElement);
  
    // LIGHTING
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 500).normalize();
    glScene.add(directionalLight);
  
    // SCENE
    backgroundObject = createBackground(fieldContact);
    glScene.add(backgroundObject);

    const wall1 = createWall(10000, 5000, new THREE.Vector3(0, 0, -4890));
    glScene.add(wall1);
    const wall2 = createWall(10000, 5000, new THREE.Vector3(10000, 0, -4890));
    glScene.add(wall2);
    const wall3 = createWall(10000, 5000, new THREE.Vector3(-10000, 0, -4890));
    glScene.add(wall3);
    const wall4 = createWall(10000, 5000, new THREE.Vector3(20000, 0, -4890));
    glScene.add(wall4);
    const wall5 = createWall(10000, 5000, new THREE.Vector3(30000, 0, -4890));
    glScene.add(wall5);
    const wall6 = createWall(10000, 5000, new THREE.Vector3(-20000, 0, -4890));
    glScene.add(wall6);

    cloudObjects = createClouds(clouds);
    cloudObjects.map(cloudObject => glScene.add(cloudObject));
    sunObject = createSun(973, 973, initialPos.sunObject, .1);
    glScene.add(sunObject);
    airplaneObject = createAirplane(920, 311, initialPos.airplaneObject, .05);
    glScene.add(airplaneObject);
    treeObject = createTree(6814, 7571, initialPos.treeObject, .01);
    glScene.add(treeObject);
    rockObject = createRock(797, 340, initialPos.rockObject, .02, 0);
    glScene.add(rockObject);
    grassObject = createGrass(1662, 81, initialPos.grassObject, .09);
    glScene.add(grassObject);
    grassObject2 = createGrass(1662, 81, initialPos.grassObject2, .09);
    glScene.add(grassObject2);

    createHomePage(1600, 1000, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createHome3DGeometry();  

    // STATIC OBJECT POSITIONS
    backgroundObject.updateMatrix();
    treeObject.updateMatrix();
    sunObject.updateMatrix();
    airplaneObject.updateMatrix();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = maxAz;
    controls.minAzimuthAngle = minAz;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth - 1100;
    controls.maxDistance = cameraDepth;
    controls.enableKeys = false;
    controls.mouseButtons = {
      ORBIT: THREE.MOUSE.ROTATE,
      ZOOM: THREE.MOUSE.DOLLY,
    };

    // ON START
    // camera.position.set(initialPos.cameraStart.x, initialPos.cameraStart.y, cameraDepth);
    // camera.rotation.x = 0;
    // cameraStart = true;
    // controls.enabled = false;
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('mousedown', onClick, true);
    cssRenderer.domElement.addEventListener('mousemove', onOver, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  useEffect(() => {
    const ratio = (window.innerWidth / window.innerHeight);
    const coverLeft = document.getElementsByClassName(styles.cover_left)[0];
    const coverRight = document.getElementsByClassName(styles.cover_right)[0];
    if(coverLeft && coverRight) {
      coverLeft.style.width = `${ratio * 10}%`;
      coverRight.style.width = `${ratio * 10}%`;
    }
    if(ratio > 3.37) {
      window.location = '/aspect/home';
    }
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createHomePage(width, height, position, rotation) {  
    planeObject = createPlane(width, height, position, rotation);  
    glScene.add(planeObject);  
 
    cssObject = createBlankCSSObject(width, height, position, rotation, styles.home);  
    cssScene.add(cssObject);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createHome3DGeometry() {  
    create3DText('#ff8c00', initialPos.nameObject, 100, 100, 100, 'Chris Ficht', 'muli_regular', 'NAME')
      .then(name => nameObject = name)
      .then(() => glScene.add(nameObject));
    create3DText('#ff8c00', initialPos.titleObject, 60, 60, 60, 'Software Developer', 'muli_regular', 'TITLE')
      .then(title => titleObject = title)
      .then(() => glScene.add(titleObject));

    create3DText('#ff8c00', initialPos.projectObject, 60, 60, 60, 'Projects', 'muli_regular', 'PROJECTS')
      .then(project => projectObject = project)
      .then(() => glScene.add(projectObject));
    create3DText('#ff8c00', initialPos.techObject, 60, 60, 60, 'Tech', 'muli_regular', 'TECH')
      .then(tech => techObject = tech)
      .then(() => glScene.add(techObject));
    create3DText('#ff8c00', initialPos.contactObject, 60, 60, 60, 'Contact', 'muli_regular', 'CONTACT')
      .then(contact => contactObject = contact)
      .then(() => glScene.add(contactObject));
    create3DText('#ff8c00', initialPos.aboutObject, 60, 60, 60, 'About', 'muli_regular', 'ABOUT')
      .then(about => aboutObject = about)
      .then(() => glScene.add(aboutObject));


    createIcon(initialPos.projectIcon, project, true)
      .then(projectIcon => projectIconObject = projectIcon)
      .then(() => glScene.add(projectIconObject));
    createIcon(initialPos.techIcon, tech, true)
      .then(techIcon => techIconObject = techIcon)
      .then(() => glScene.add(techIconObject));
    createIcon(initialPos.contactIcon, contact, true)
      .then(contactIcon => contactIconObject = contactIcon)
      .then(() => glScene.add(contactIconObject));
    createIcon(initialPos.aboutIcon, about, true)
      .then(aboutIcon => aboutIconObject = aboutIcon)
      .then(() => glScene.add(aboutIconObject));

    createPictureFrame({ x: 800, y: 800, z: 512 }, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0))
      .then(frame => frameObject = frame)
      .then(() => glScene.add(frameObject));
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
          q: selectedObject.object.quaternion,
          position: initialPos.rockObject,
          url: '/projects'
        };
        navigateOn = true;
      }
      if(selectedObject.object.userData === 'TECH') {
        targetObject = {
          q: selectedObject.object.quaternion,
          position: initialPos.sunObject,
          url: '/tech'
        };
        navigateOn = true;
      }
      if(selectedObject.object.userData === 'CONTACT') {
        targetObject = { 
          q: selectedObject.object.quaternion,
          position: initialPos.airplaneObject,
          url: '/contact'
        };
        navigateOn = true;
      }
      if(selectedObject.object.userData === 'ABOUT') {
        targetObject = { 
          q: selectedObject.object.quaternion,
          position: initialPos.treeObject,
          url: '/about'
        };
        navigateOn = true;
      }

      if(!navigateOn) return;

      const originalCameraPosition = camera.position;
      const startRotation = camera.quaternion.clone();
      camera.lookAt(targetObject.position);
      const endRotation = camera.quaternion.clone();
      camera.quaternion.copy(startRotation);

      quaternionTween = new TWEEN.Tween(camera.quaternion)
        .to(endRotation, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      positionTween = new TWEEN.Tween(originalCameraPosition)
        .to(targetObject.position, 2000)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
    }
  }

  function onOver(event) {
    if(event.buttons > 0) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'PROJECTS' || selectedObject.object.userData === 'TECH' || selectedObject.object.userData === 'CONTACT' || selectedObject.object.userData === 'ABOUT') {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    } 
  }

  // CONSTANT UPDATE
  function update() { 
    if(cameraStart) {
      if(camera.position.y > initialPos.cameraMain.y) camera.position.y -= 30;
      else {
        camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
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
      quaternionTween.update();
      positionTween.update();

      if(camera.position.z < -2500 && !mobile) {
        navigateOn = false;
        history.push(targetObject.url);
      }
      if(camera.position.z < 0 && mobile) {
        navigateOn = false;
        history.push(targetObject.url);
      }
    }

    if(projectIconObject) projectIconObject.rotation.y += .05;
    if(techIconObject) techIconObject.rotation.y += .05;
    if(contactIconObject) contactIconObject.rotation.y += .05;
    if(aboutIconObject) aboutIconObject.rotation.y += .05;

    cloudObjects.map(cloud => cloud.position.x >= 10000 ? cloud.position.x = -10000 : cloud.position.x += 5);
    
    glRenderer.render(glScene, camera);  
    cssRenderer.render(cssScene, camera);
    requestAnimationFrame(update);
  }

  const loadingScreen = () => {
    if(isLoading) {
      return (
        <div className={styles.loading}>
          <div className={styles.loading_contents}>
            Loading
            <p className={styles.loading_text}>0.00%</p>
            <div className={styles.progress}>
              <div className={styles.bar}></div>
            </div>
          </div>
        </div>
      );
    }
  };
        

  return (
    <>
      { loadingScreen() }
      <div className={styles.cover_left}/>
      <div className={styles.cover_right}/> 
      <div ref={ref => (ref)} />
    </>
  );
};

export default Home;

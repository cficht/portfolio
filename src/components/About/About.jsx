import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createAboutCSSObject } from '../../utilities/initialize-page';
import { createBackground, createTree, createGrass, createTreeTop, create3DText, createArrow, createPictureFrame, manager } from '../../utilities/create-objects';
import { loadingBar } from '../../utilities/other';
import { about } from '../../data/info';
import { projectField } from '../../data/objects';
import { aboutPos as initialPos } from '../../data/positions';
import styles from '../../Main.css';

let 
  camera, 
  controls;
let cameraDepth = 3500;
let mobileDepth = 4900;
let maxAz = .3;
let minAz = -.3;

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  let 
    glRenderer, 
    cssRenderer, 
    selectedObject,
    backgroundObject, 
    treeObject, 
    treeTopObject, 
    treeTopObject2, 
    grassObject, 
    grassObject2, 
    nameObject;

  let arrowObjects = [];

  let modelsLoaded = 0;
  let modelsTotal = 0;

  let flipRight = false, flipLeft = false, backSide = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  // INITIALIZE PAGE
  useEffect(() => {
    window.addEventListener('pageshow', function(event) {
      if(event.persisted) location.reload();
    });

    manager.onStart = function(url, itemsLoaded, itemsTotal) {
      modelsLoaded = itemsLoaded;
      modelsTotal = itemsTotal;
      loadingBar(styles, modelsLoaded, modelsTotal);
    };
    manager.onLoad = function() {
      createAboutPages(1400, 1000, initialPos.cssObject, new THREE.Vector3(0, 0, 0), about.bio);
      createAboutPages(1200, 800, initialPos.cssObject2, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0), about.other);
      update();
      setIsLoading(false);
    };
    manager.onProgress = function(url, itemsLoaded, itemsTotal) {
      modelsLoaded = itemsLoaded;
      modelsTotal = itemsTotal;
      loadingBar(styles, modelsLoaded, modelsTotal);
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
      if(window.orientation !== 0) window.location = '/landscape';
      cameraDepth = mobileDepth;
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
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 500).normalize();
    glScene.add(directionalLight);
  
    // SCENE
    backgroundObject = createBackground(projectField);
    glScene.add(backgroundObject);
    treeObject = createTree(2500, 2778, initialPos.treeObject, .27);
    glScene.add(treeObject);
    grassObject = createGrass(1662, 300, initialPos.grassObject, .2, 'tall');
    glScene.add(grassObject);
    grassObject2 = createGrass(1662, 300, initialPos.grassObject2, .2, 'tall');
    glScene.add(grassObject2);
    treeTopObject = createTreeTop(2400, 1574, initialPos.treeTopObject, .15);
    glScene.add(treeTopObject);
    treeTopObject2 = createTreeTop(2400, 1574, initialPos.treeTopObject2, .15);
    glScene.add(treeTopObject2);

    createProject3DGeometry();  

    // STATIC OBJECT POSITIONS
    backgroundObject.updateMatrix();
    treeObject.updateMatrix();
    treeTopObject.updateMatrix();
    treeTopObject2.updateMatrix();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = maxAz;
    controls.minAzimuthAngle = minAz;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth - 2500;
    controls.maxDistance = cameraDepth;
    controls.enableKeys = false;
    controls.mouseButtons = {
      ORBIT: THREE.MOUSE.ROTATE,
      ZOOM: THREE.MOUSE.DOLLY,
    };
    
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('mousedown', onClick, true);
    cssRenderer.domElement.addEventListener('mousemove', onOver, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createAboutPages(width, height, position, rotation, content) {  
    const planeObject = createPlane(width, height, position, rotation);  
    glScene.add(planeObject);   
    const cssObject = createAboutCSSObject(width, height, position, rotation, content, styles.about);  
    cssScene.add(cssObject);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText('#ff8c00', initialPos.nameObject, 115, 115, 100, 'About', 'muli_regular')
      .then(name => nameObject = name)
      .then(() => glScene.add(nameObject));

    arrowObjects = [...arrowObjects, createArrow('#ff8c00', initialPos.leftArrowObjectFront, new THREE.Euler(0, 0, 0), 'LAST', 1.2, true)];
    arrowObjects = [...arrowObjects, createArrow('#ff8c00', initialPos.rightArrowObjectFront, new THREE.Euler(0, 0, -180 * THREE.MathUtils.DEG2RAD), 'NEXT', 1.2, true)];
    arrowObjects = [...arrowObjects, createArrow('#ff8c00', initialPos.leftArrowObjectBack, new THREE.Euler(0, 0, 0), 'NEXT', 1.2, true)];
    arrowObjects = [...arrowObjects, createArrow('#ff8c00', initialPos.rightArrowObjectBack, new THREE.Euler(0, 0, -180 * THREE.MathUtils.DEG2RAD), 'LAST', 1.2, true)];
    arrowObjects.map(arrow => glScene.add(arrow));

    createPictureFrame({ x: 700, y: 800, z: 512 }, initialPos.frameObject, new THREE.Euler(0, -180 * THREE.MathUtils.DEG2RAD, 0))
      .then(frame => glScene.add(frame));
    createPictureFrame({ x: 600, y: 600, z: 512 }, initialPos.frameObject2, new THREE.Euler(0, 0, 0))
      .then(frame => glScene.add(frame));
  }

  // INTERACTION
  function onClick(event) {
    if(flipLeft || flipRight) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'NEXT') {
        backSide = !backSide;
        flipLeft = false;
        flipRight = true;
      }
      if(selectedObject.object.userData === 'LAST') { 
        backSide = !backSide;
        flipRight = false;
        flipLeft = true;
      }
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
      if(selectedObject.object.userData === 'NEXT' || selectedObject.object.userData === 'LAST') {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    } 
  }

  function resetCamera() {
    if(flipLeft || flipRight) return;
    controls.reset();
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);
  }

  // CONSTANT UPDATE
  function update() { 
    if(flipRight) {
      if(cssScene.quaternion._y <= -.999999 && backSide) {
        flipRight = false;
        glScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
        cssScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
      }
      if(cssScene.quaternion._y >= -.01 && !backSide) {
        flipRight = false;
        glScene.rotation.set(0, 0, 0);
        cssScene.rotation.set(0, 0, 0);
      } else {
        cssScene.rotation.y -= 0.02;
        glScene.rotation.y -= 0.02;
      } 
    }
    if(flipLeft) {
      if(cssScene.quaternion._y >= .999999 && backSide) {
        flipLeft = false;
        glScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
        cssScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
      }  
      if(cssScene.quaternion._y >= -.01 && !backSide) {
        flipLeft = false;
        glScene.rotation.set(0, 0, 0);
        cssScene.rotation.set(0, 0, 0);
      } else {
        cssScene.rotation.y += 0.02;
        glScene.rotation.y += 0.02;
      }  
    }
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
      <div className={styles.hud_box}> 
        <div className={styles.hud_contents}>
          <a href="/">Home</a>
          <a>About</a>
          <a href="/contact">Contact</a>
          <a href="/tech">Tech</a>
          <a href="/projects">Projects</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default About;

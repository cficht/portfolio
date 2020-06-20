import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createAboutCSSObject } from '../../utilities/initialize-page';
import { createBackground, createSun, create3DText, createArrow, createIcon } from '../../utilities/create-objects';
// import { about } from '../../data/info';
import { sky, techLogos } from '../../data/objects';
import styles from './Tech.css';

const Tech = () => {
  let camera, controls, pivot, glRenderer, cssRenderer, backgroundObject, sunObject, nameObject, categoryObject, selectedObject;
  let rotateRight = false, rotateLeft = false;
  let techCount = 0;
  let cameraDepth = 2750;
  let zoomMax = 4000;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    sunObject: new THREE.Vector3(0, 0, 0),
    cssObject: new THREE.Vector3(0, -700, 50),
    planeObject: new THREE.Vector3(0, -700, 50),
    frameObject: new THREE.Vector3(0, -700, 50),
    nameObject: new THREE.Vector3(0, 1300, 0),
    categoryObject: new THREE.Vector3(0, -750, 800),
    leftArrow: new THREE.Vector3(-30, -375, 1300), 
    rightArrow: new THREE.Vector3(30, -375, 1300),
    upArrow: new THREE.Vector3(500, -725, 800), 
    downArrow: new THREE.Vector3(500, -775, 800)
  };

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
      cameraDepth = 3500;
      zoomMax = 4400;
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
    backgroundObject = createBackground(sky);
    glScene.add(backgroundObject);

    sunObject = createSun(973, 973, initialPos.sunObject, .11);
    glScene.add(sunObject);

    // createAboutPages(1400, 800, initialPos.cssObject, new THREE.Vector3(0, 0, 0), about.bio);
    // createAboutPages(1000, 600, initialPos.cssObject2, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0), about.other);
    createTech();
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1;
    controls.minAzimuthAngle = -1;
    controls.maxPolarAngle = 2;
    controls.minPolarAngle = 1;
    controls.minDistance = 1500;
    controls.maxDistance = zoomMax;
    controls.enableKeys = false;
    
    camera.position.set(0, 100, cameraDepth + 900);
    controls.target = new THREE.Vector3(0, 100, 400);

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('mousedown', onDown, true);
    cssRenderer.domElement.addEventListener('mouseup', onUp, true);
    cssRenderer.domElement.addEventListener('touchstart', onDown, true);
    cssRenderer.domElement.addEventListener('touchend', onUp, true);
    cssRenderer.domElement.addEventListener('click', onClick, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createTech() {  
    pivot = new THREE.Group();
    pivot.position.set(0.0, 0.0, 0);
    glScene.add(pivot);
    
    // VISUALISE PIVOT
    const pivotSphereGeo = new THREE.SphereGeometry(0.01);
    const pivotSphere = new THREE.Mesh(pivotSphereGeo);
    pivotSphere.position.set(0, 0, 0);
    pivotSphere.position.z = 0.1;
    glScene.add(pivotSphere);
    
    glScene.add(new THREE.AxesHelper());

    create3DText(categoryObject, glScene, '#ff8c00', initialPos.categoryObject, 70, 70, 100, techLogos[techCount].category, 'muli_regular')
      .then(category => categoryObject = category);

    techLogos[techCount].models.map((tech, i) => {
      const logoPosition = new THREE.Vector3(1300 * Math.sin(THREE.Math.degToRad(360 * (i / techLogos[techCount].models.length))), 0, 1300 * Math.cos(THREE.Math.degToRad(360 * (i / techLogos[techCount].models.length))));
      createIcon(glScene, logoPosition, tech)
        .then(logo => {
          logo.geometry.rotateZ(THREE.Math.degToRad(270));
          logo.rotation.set(0, 0, Math.PI / 2);
          pivot.add(logo);
        });
      create3DText(false, glScene, '#ff8c00', logoPosition, 50, 50, 100, tech.name, 'muli_regular')
        .then(text => {
          text.geometry.rotateZ(THREE.Math.degToRad(270));
          text.position.y = -250;
          text.rotation.set(0, 0, Math.PI / 2);
          pivot.add(text);
        });
    });
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {      
    create3DText(nameObject, glScene, '#ff8c00', initialPos.nameObject, 115, 115, 100, 'Tech Stack', 'muli_regular')
      .then(name => nameObject = name);
    createArrow(glScene, '#ff8c00', initialPos.leftArrow, new THREE.Euler(0, 0, 0), 'LAST', .6);
    createArrow(glScene, '#ff8c00', initialPos.rightArrow, new THREE.Euler(0, 0, -180 * THREE.MathUtils.DEG2RAD), 'NEXT', .6);
    createArrow(glScene, '#ff8c00', initialPos.upArrow, new THREE.Euler(0, 0, -90 * THREE.MathUtils.DEG2RAD), 'UP', .6);
    createArrow(glScene, '#ff8c00', initialPos.downArrow, new THREE.Euler(0, 0, -270 * THREE.MathUtils.DEG2RAD), 'DOWN', .6);
  }

  // INTERACTION
  function onDown(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    if(event.type === 'mousedown') {
      mouse.x = (event.clientX / setWidth) * 2 - 1;
      mouse.y = - (event.clientY / setHeight) * 2 + 1;
    }
    if(event.type === 'touchstart') {
      event.preventDefault();
      mouse.x = (event.touches[0].clientX / setWidth) * 2 - 1;
      mouse.y = - (event.touches[0].clientY / setHeight) * 2 + 1;
    }
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'NEXT') {
        rotateLeft = false;
        rotateRight = true;
      }
      if(selectedObject.object.userData === 'LAST') { 
        rotateRight = false;
        rotateLeft = true;
      }
    }
  }

  function onUp() {
    rotateLeft = false;
    rotateRight = false;
  }

  function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'UP' && techCount < techLogos.length - 1) {
        techCount++;
        glScene.remove(pivot);
        createTech();
      }
      if(selectedObject.object.userData === 'DOWN' && techCount > 0) { 
        techCount--;
        glScene.remove(pivot);
        createTech();
      }
    }
  }

  function resetCamera() {
    event.preventDefault();
    controls.reset();
    camera.position.set(0, 100, cameraDepth + 900);
    controls.target = new THREE.Vector3(0, 0, 400);
  }

  // CONSTANT UPDATE
  function update() { 
    if(rotateRight) {
      pivot.rotation.y += 0.01;
      pivot.children.forEach(child => {
        child.rotation.y = 0 - pivot.rotation.y;
      });
    }
    if(rotateLeft) {
      pivot.rotation.y -= 0.01;
      pivot.children.forEach(child => {
        child.rotation.y = 0 - pivot.rotation.y;
      });
    }
    glRenderer.render(glScene, camera);  
    cssRenderer.render(cssScene, camera);
    requestAnimationFrame(update);
  }

  return (
    <>
      <div className={styles.hud_box}> 
        <div className={styles.hud_contents}>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/projects">Projects</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Tech;

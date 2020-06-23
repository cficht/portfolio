import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer } from '../../utilities/initialize-page';
import { createBackground, createSun, create3DText, createArrow, createIcon, createClouds } from '../../utilities/create-objects';
import { sky, techLogos, cloudsTech } from '../../data/objects';
import { techPos as initialPos } from '../../data/positions';
import styles from '../../Main.css';

const Tech = () => {
  let camera, controls, pivot, glRenderer, cssRenderer, backgroundObject, sunObject, cloudObjects, nameObject, categoryObject, leftArrowObject, rightArrowObject, upArrowObject, downArrowObject, selectedObject;
  let rotateRight = false, rotateLeft = false, changeTech = false;
  let techCount = 0;
  let cameraDepth = 4000;
  let mobileDepth = 5200;
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

    // CAMERA
    if(navigator.userAgent.match(/Android/i) 
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) cameraDepth = mobileDepth;
    
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

    cloudObjects = createClouds(cloudsTech);
    cloudObjects.map(cloudObject => glScene.add(cloudObject));

    createTech();
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = .3;
    controls.minAzimuthAngle = -.3;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth - 1500;
    controls.maxDistance = cameraDepth - 400;
    controls.enableKeys = false;
    
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);

    // EVENT LISTENERS
    glRenderer.domElement.addEventListener('mousedown', onDown, true);
    glRenderer.domElement.addEventListener('mouseup', onUp, true);
    glRenderer.domElement.addEventListener('touchstart', onDown, true);
    glRenderer.domElement.addEventListener('touchend', onUp, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createTech(newYPos = 0) {  
    pivot = new THREE.Group();
    pivot.position.set(0.0, newYPos, 0);
    glScene.add(pivot);
    
    const pivotGeometry = new THREE.SphereGeometry(0.01);
    const pivotSphere = new THREE.Mesh(pivotGeometry);
    pivotSphere.position.set(0, 0, 0);
    pivotSphere.position.z = 0.1;
    glScene.add(pivotSphere);
    
    glScene.add(new THREE.AxesHelper());
    create3DText(categoryObject, glScene, '#ff8c00', initialPos.categoryObject, 50, 50, 35, techLogos[techCount].category, 'muli_regular')
      .then(category => categoryObject = category);

    techLogos[techCount].models.map((tech, i) => {
      const logoPosition = new THREE.Vector3(1300 * Math.sin(THREE.Math.degToRad(360 * (i / techLogos[techCount].models.length))), 225, 1300 * Math.cos(THREE.Math.degToRad(360 * (i / techLogos[techCount].models.length))));
      createIcon(glScene, logoPosition, tech)
        .then(logo => {
          logo.geometry.rotateZ(THREE.Math.degToRad(270));
          logo.rotation.set(0, 0, Math.PI / 2);
          pivot.add(logo);
        });
      create3DText(false, glScene, '#FF4500', logoPosition, 50, 50, 35, tech.name, 'muli_regular')
        .then(text => {
          text.geometry.rotateZ(THREE.Math.degToRad(270));
          text.position.y = -75;
          text.rotation.set(0, 0, Math.PI / 2);
          pivot.add(text);
        });
    });
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {      
    create3DText(nameObject, glScene, '#ff8c00', initialPos.nameObject, 80, 80, 65, 'Tech Stack', 'muli_regular')
      .then(name => nameObject = name);
    leftArrowObject = createArrow(glScene, '#EFFD5F', initialPos.leftArrowObject, new THREE.Euler(0, 0, 0), 'LAST', .8);
    rightArrowObject = createArrow(glScene, '#EFFD5F', initialPos.rightArrowObject, new THREE.Euler(0, 0, -180 * THREE.MathUtils.DEG2RAD), 'NEXT', .8);
    upArrowObject = createArrow(glScene, '#EFFD5F', initialPos.upArrowObject, new THREE.Euler(0, 0, -90 * THREE.MathUtils.DEG2RAD), 'UP', .8);
    downArrowObject = createArrow(glScene, '#EFFD5F', initialPos.downArrowObject, new THREE.Euler(0, 0, -270 * THREE.MathUtils.DEG2RAD), 'DOWN', .8);
  }

  // INTERACTION
  function onDown(event) {
    if(changeTech) return;
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
    if(selectedObject.object.userData === 'UP' && techCount < techLogos.length - 1) {
      techCount++;
      changeTech = true;
    }
    if(selectedObject.object.userData === 'DOWN' && techCount > 0) { 
      techCount--;
      changeTech = true;
    }
  }

  function onUp() {
    rotateLeft = false;
    rotateRight = false;
  }

  function resetCamera() {
    controls.reset();
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);
  }

  // CONSTANT UPDATE
  function update() { 
    cloudObjects.map(cloud => cloud.position.x <= -7000 ? cloud.position.x = 7000 : cloud.position.x -= 10);
    if(rotateRight) {
      pivot.rotation.y += 0.02;
      pivot.children.map(child => {
        child.rotation.y = 0 - pivot.rotation.y;
      });
    }
    if(rotateLeft) {
      pivot.rotation.y -= 0.02;
      pivot.children.map(child => {
        child.rotation.y = 0 - pivot.rotation.y;
      });
    }
    if(changeTech) {
      pivot.position.y += 100;
      categoryObject.position.y -= 100;
      leftArrowObject.position.y += 100;
      rightArrowObject.position.y += 100;
      upArrowObject.position.y -= 100;
      downArrowObject.position.y -= 100;
      if(pivot.position.y > 5000) {
        glScene.remove(pivot);
        createTech(5000);
        changeTech = false;
      }
    } 
    if(!changeTech && pivot.position.y > 0) pivot.position.y -= 100;
    if(!changeTech && categoryObject?.position.y < initialPos.categoryObject.y) categoryObject.position.y += 100;
    if(!changeTech && leftArrowObject?.position.y > initialPos.leftArrowObject.y) leftArrowObject.position.y -= 100;
    if(!changeTech && rightArrowObject?.position.y > initialPos.rightArrowObject.y) rightArrowObject.position.y -= 100;
    if(!changeTech && upArrowObject?.position.y < initialPos.upArrowObject.y) upArrowObject.position.y += 100;
    if(!changeTech && downArrowObject?.position.y < initialPos.downArrowObject.y) downArrowObject.position.y += 100;
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
          <a>Tech</a>
          <a href="/projects">Projects</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Tech;

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer } from '../../utilities/initialize-page';
import { createBackground, createSun, create3DText, createArrow, createIcon, createClouds, manager } from '../../utilities/create-objects';
import { loadingBar } from '../../utilities/other';
import { sky, techLogos, cloudsTech } from '../../data/objects';
import { techPos as initialPos } from '../../data/positions';
import styles from '../../Main.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

let 
  camera, 
  controls;
let cameraDepth = 4000;
let mobileDepth = 5000;
let maxAz = .3;
let minAz = -.3;

const Tech = () => {
  const [isLoading, setIsLoading] = useState(true);

  let 
    pivot, 
    pivotSphere,
    glRenderer, 
    cssRenderer, 
    selectedObject,
    backgroundObject, 
    sunObject, 
    cloudObjects, 
    nameObject, 
    categoryObject, 
    leftArrowObject, 
    rightArrowObject, 
    upArrowObject, 
    downArrowObject;

  let techObjects = [];

  let modelsLoaded = 0;
  let modelsTotal = 0;
  
  let rotateRight = false, rotateLeft = false, changeTech = false;
  let techCount = 0;
  let mobile = false;
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
    };
    manager.onLoad = function() {
      setTimeout(() => {
        createTech();
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
      mobile = true;
      if(window.orientation !== 0) window.location = '/landscape/tech';
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
    backgroundObject = createBackground(sky);
    glScene.add(backgroundObject);

    sunObject = createSun(973, 973, initialPos.sunObject, .11);
    glScene.add(sunObject);

    cloudObjects = createClouds(cloudsTech);
    cloudObjects.map(cloudObject => glScene.add(cloudObject));

    createProject3DGeometry();  

    // STATIC OBJECT POSITIONS
    backgroundObject.updateMatrix();
    sunObject.updateMatrix();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = maxAz;
    controls.minAzimuthAngle = minAz;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth - 1500;
    controls.maxDistance = cameraDepth - 400;
    controls.enableKeys = false;
    controls.mouseButtons = {
      ORBIT: THREE.MOUSE.ROTATE,
      ZOOM: THREE.MOUSE.DOLLY,
    };
    
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);

    // EVENT LISTENERS
    glRenderer.domElement.addEventListener('mousedown', onDown, true);
    glRenderer.domElement.addEventListener('mouseup', onUp, true);
    glRenderer.domElement.addEventListener('touchstart', onDown, true);
    glRenderer.domElement.addEventListener('touchend', onUp, true);
    cssRenderer.domElement.addEventListener('mousemove', onOver, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createTech(newYPos = 0) {  
    if(!glScene.children.find(child => child === pivot)) {
      pivot = new THREE.Group();
      pivot.position.set(0.0, newYPos, 0);
      glScene.add(pivot);
      
      const pivotGeometry = new THREE.SphereGeometry(0.01);
      pivotSphere = new THREE.Mesh(pivotGeometry);
      pivotSphere.position.set(0, 0, 0);
      pivotSphere.position.z = 0.1;
      glScene.add(pivotSphere);
      
      glScene.add(new THREE.AxesHelper());
  
      let lastCatPos;
      if(categoryObject) lastCatPos = categoryObject.position;
      categoryObject = techObjects[techCount].category;
      if(lastCatPos) categoryObject.position.set(lastCatPos.x, lastCatPos.y, lastCatPos.z);
      glScene.add(categoryObject);
  
      techObjects[techCount].tech.map(techData => {
        techData.icon.rotation.set(0, 0, Math.PI / 2);
        techData.name.rotation.set(0, 0, Math.PI / 2);
        pivot.add(techData.icon);
        pivot.add(techData.name);
      });
    } else {
      pivot.children = [];
      pivot.position.set(0.0, newYPos, 0);
      pivot.rotation.set(0, 0, 0);
      if(techObjects[techCount].tech.length === 2) pivot.rotation.set(0, Math.PI / 2, 0); // MORE DATABASE MODELS
      pivotSphere.position.set(0, 0, 0);
      pivotSphere.position.z = 0.1;

      let lastCatPos;
      if(categoryObject) lastCatPos = categoryObject.position;
      categoryObject = techObjects[techCount].category;
      if(lastCatPos) categoryObject.position.set(lastCatPos.x, lastCatPos.y, lastCatPos.z);
      if(!glScene.children.find(child => child === categoryObject)) glScene.add(categoryObject);

      techObjects[techCount].tech.map(techData => {
        techData.icon.rotation.set(0, 0, Math.PI / 2);
        techData.name.rotation.set(0, 0, Math.PI / 2);
        if(techObjects[techCount].tech.length === 2) techData.icon.rotation.set(0, -(Math.PI / 2), Math.PI / 2); // MORE DATABASE MODELS
        if(techObjects[techCount].tech.length === 2) techData.name.rotation.set(0, -(Math.PI / 2), Math.PI / 2); // MORE DATABASE MODELS
        pivot.add(techData.icon);
        pivot.add(techData.name);
      });
    }
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {      
    create3DText('#ff8c00', initialPos.nameObject, 80, 80, 65, 'Tech Stack', 'muli_regular')
      .then(name => nameObject = name)
      .then(() => glScene.add(nameObject));

    leftArrowObject = createArrow('#EFFD5F', initialPos.leftArrowObject, new THREE.Euler(0, 0, 0), 'NEXT', .9, true);
    glScene.add(leftArrowObject);
    rightArrowObject = createArrow('#EFFD5F', initialPos.rightArrowObject, new THREE.Euler(0, 0, -180 * THREE.MathUtils.DEG2RAD), 'LAST', .9, true);
    glScene.add(rightArrowObject);
    upArrowObject = createArrow('#EFFD5F', initialPos.upArrowObject, new THREE.Euler(0, 0, -90 * THREE.MathUtils.DEG2RAD), 'DOWN', .9, true);
    glScene.add(upArrowObject);
    downArrowObject = createArrow('#EFFD5F', initialPos.downArrowObject, new THREE.Euler(0, 0, -270 * THREE.MathUtils.DEG2RAD), 'UP', .9, true);
    glScene.add(downArrowObject);

    techLogos.map((tech, j) => {
      const categoryProm = create3DText('#ff8c00', initialPos.categoryObject, 50, 50, 35, tech.category, 'muli_regular');
      techObjects.push({
        category: '',
        tech: []
      });

      tech.models.map((tech, i) => {
        const logoPosition = new THREE.Vector3(1300 * Math.sin(THREE.Math.degToRad(360 * (i / techLogos[j].models.length))), 225, 1300 * Math.cos(THREE.Math.degToRad(360 * (i / techLogos[j].models.length)))); 
        const logoIcon = createIcon(logoPosition, tech)
          .then(logo => {
            logo.geometry.rotateZ(THREE.Math.degToRad(270));
            logo.rotation.set(0, 0, Math.PI / 2);
            return logo;
          });
        const logoText = create3DText('#FF4500', logoPosition, 50, 50, 35, tech.name, 'muli_regular')
          .then(text => {
            text.geometry.rotateZ(THREE.Math.degToRad(270));
            text.position.y = -75;
            text.rotation.set(0, 0, Math.PI / 2);
            return text;
          });
        return Promise.all([logoIcon, logoText]).then((values) => {
          techObjects[j].tech.push({
            icon: values[0], 
            name: values[1]
          });
        });
      });

      return Promise.all([categoryProm]).then((values) => {
        techObjects[j].category = values[0];
      });
    });
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
    else if(selectedObject.object.userData === 'UP' && techCount === techLogos.length - 1) {
      techCount = 0;
      changeTech = true;
    }
    else if(selectedObject.object.userData === 'DOWN' && techCount > 0) { 
      techCount--;
      changeTech = true;
    }
    else if(selectedObject.object.userData === 'DOWN' && techCount === 0) { 
      techCount = techLogos.length - 1;
      changeTech = true;
    }
  }

  function onUp() {
    rotateLeft = false;
    rotateRight = false;
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
      if(selectedObject.object.userData === 'NEXT' || selectedObject.object.userData === 'LAST' || selectedObject.object.userData === 'UP' || selectedObject.object.userData === 'DOWN') {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    } 
  }

  function resetCamera() {
    controls.reset();
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);
  }

  // CONSTANT UPDATE
  function update() { 
    if(mobile && window.orientation !== 0) window.location = '/landscape/tech';
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
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a style={{ opacity: 0.5, pointerEvents: 'none' }}>Tech</a>
          <Link to="/projects">Projects</Link>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Tech;

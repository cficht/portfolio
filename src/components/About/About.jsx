import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createAboutCSSObject } from '../../utilities/initialize-page';
import { createBackground, createTree, createGrass, create3DText, createArrow, createPictureFrame } from '../../utilities/create-objects';
import { about } from '../../data/info';
import { projectField } from '../../data/objects';
import styles from './About.css';

const About = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, treeObject, treeTopObject, treeTopObject2, grassObject, grassObject2, nameObject, selectedObject;
  let flipRight = false, flipLeft = false, backSide = false;
  let cameraDepth = 2750;
  let zoomMax = 4000;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    treeObject: new THREE.Vector3(200, 5100, 0),
    treeTopObject: new THREE.Vector3(200, 2200, 25),
    treeTopObject2: new THREE.Vector3(200, 2200, -25),
    grassObject: new THREE.Vector3(0, -2250, 100),
    grassObject2: new THREE.Vector3(0, -2250, -100),
    cssObject: new THREE.Vector3(0, -700, 50),
    planeObject: new THREE.Vector3(0, -700, 50),
    frameObject: new THREE.Vector3(0, -700, 50),
    cssObject2: new THREE.Vector3(0, -700, -50),
    planeObject2: new THREE.Vector3(0, -700, -50),
    frameObject2: new THREE.Vector3(0, -700, -50),
    nameObject: new THREE.Vector3(-10, 300, 50),
    logoObject: new THREE.Vector3(0, 900, -3500),
    leftArrowObjectFront: new THREE.Vector3(-100, -1500, 100), 
    rightArrowObjectFront: new THREE.Vector3(100, -1500, 100),
    leftArrowObjectBack: new THREE.Vector3(-100, -1500, -100), 
    rightArrowObjectBack: new THREE.Vector3(100, -1500, -100),
    gitHubObject: new THREE.Vector3(-450, -2100, -2500),
    siteObject: new THREE.Vector3(450, -2100, -2500)
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
    backgroundObject = createBackground(projectField);
    glScene.add(backgroundObject);

    treeObject = createTree(6814, 7571, initialPos.treeObject, .11);
    glScene.add(treeObject);

    grassObject = createGrass(1662, 300, initialPos.grassObject, .2, 'tall');
    glScene.add(grassObject);

    grassObject2 = createGrass(1662, 300, initialPos.grassObject2, .2, 'tall');
    glScene.add(grassObject2);

    const textureLoader = new THREE.TextureLoader();
    function createTreeTop(width, height, position, scale, flip) {
      const tree_url = './images/common_images/treetop.png';
      const treeMaterial = new THREE.MeshToonMaterial({ map: textureLoader.load(tree_url), alphaTest: 0.4, transparent: true, side: THREE.DoubleSide, shininess: 0 });
      const treeGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
      treeGeometry.center();
      const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
      treeMesh.scale.set(width * scale, height * scale, 1);
      treeMesh.position.set(position.x, position.y, position.z);
      flip ? treeMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0)) : treeMesh.rotation.copy(new THREE.Euler(0, 0, 0));
      treeMesh.userData = 'TREETOP';
      return treeMesh;
    }

    treeTopObject = createTreeTop(2400, 1574, initialPos.treeTopObject, .15);
    glScene.add(treeTopObject);
    treeTopObject2 = createTreeTop(2400, 1574, initialPos.treeTopObject2, .15);
    glScene.add(treeTopObject2);

    createAboutPages(1400, 800, initialPos.cssObject, new THREE.Vector3(0, 0, 0), about.bio);
    createAboutPages(1000, 600, initialPos.cssObject2, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0), about.other);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1;
    controls.minAzimuthAngle = -1;
    controls.maxPolarAngle = 1.6;
    controls.minPolarAngle = 1;
    controls.minDistance = 1500;
    controls.maxDistance = zoomMax;
    controls.enableKeys = false;
    
    camera.position.set(0, -850, cameraDepth + 900);
    controls.target = new THREE.Vector3(0, -850, 400);

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('click', onClick, true);
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
    create3DText(nameObject, glScene, '#228B22', initialPos.nameObject, 115, 115, 100, 'About', 'muli_regular')
      .then(name => nameObject = name);
    createArrow(glScene, '#ff8c00', initialPos.leftArrowObjectFront, new THREE.Euler(0, 0, 0), 'LAST');
    createArrow(glScene, '#ff8c00', initialPos.rightArrowObjectFront, new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD), 'NEXT');
    createArrow(glScene, '#ff8c00', initialPos.leftArrowObjectBack, new THREE.Euler(0, 0, 0), 'NEXT');
    createArrow(glScene, '#ff8c00', initialPos.rightArrowObjectBack, new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD), 'LAST');
    createPictureFrame(glScene, { x: 800, y: 800, z: 512 }, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
    createPictureFrame(glScene, { x: 600, y: 600, z: 512 }, initialPos.frameObject2, new THREE.Euler(0, 0, 0));
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

  function resetCamera() {
    if(flipLeft || flipRight) return;
    controls.reset();
    camera.position.set(0, -850, cameraDepth + 900);
    controls.target = new THREE.Vector3(0, -850, 1400);
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

  return (
    <>
      <div className={styles.hud_box}> 
        <div className={styles.hud_contents}>
          <a href="/">Home</a>
          <a href="/Contact">Contact</a>
          <a href="/">Tech</a>
          <a href="/projects">Projects</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default About;

import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createProjectCssObject, createAboutCSSObject } from '../../utilities/initialize-page';
import { createBackground, createTree, createRock, createGrass, create3DText, createIcon, createArrow, createPictureFrame } from '../../utilities/create-objects';
import { projectChange } from '../../utilities/other';
import { about } from '../../data/info';
import { projectField } from '../../data/objects';
import styles from './About.css';

const About = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, treeObject, grassObject, cssObject, planeObject, frameObject, nameObject, leftArrowObject, rightArrowObject, selectedObject;
  let flipRight = false, flipLeft = false, backSide = false, changeSlide = false, waitSlide = false, nextProject = false, lastProject = false, changeProject = false;
  let cameraDepth = 2750;
  let zoomMax = 4000;
  let projectCount = 0;
  let slideCount = 0;
  const slideMax = 2;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    treeObject: new THREE.Vector3(200, 5100, 0),
    grassObject: new THREE.Vector3(0, -2250, 100),
    cssObject: new THREE.Vector3(0, -700, 100),
    planeObject: new THREE.Vector3(0, -700, 100),
    frameObject: new THREE.Vector3(0, -700, 100),
    nameObject: new THREE.Vector3(-10, 300, 100),
    logoObject: new THREE.Vector3(0, 900, -3500),
    leftArrowObject: new THREE.Vector3(-100, -1500, 100), 
    rightArrowObject: new THREE.Vector3(100, -1500, 100),
    gitHubObject: new THREE.Vector3(-450, -2100, -2500),
    siteObject: new THREE.Vector3(450, -2100, -2500)
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
      cameraDepth = 3500;
      zoomMax = 4600;
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

    createProjectPage(1400, 800, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1;
    controls.minAzimuthAngle = -1;
    controls.maxPolarAngle = 1.75;
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
  function createProjectPage(width, height, position, rotation, number) {  
    if(!planeObject) { 
      planeObject = createPlane(width, height, position, rotation);  
      glScene.add(planeObject);  
    }
    
    if(!cssObject) {
      cssObject = createAboutCSSObject(width, height, position, rotation, number, about, styles.about, slideCount);  
      cssScene.add(cssObject);
    } else {
      const newPos = cssObject.position;
      cssScene.remove(cssObject);
      cssObject = createAboutCSSObject(width, height, newPos, rotation, number, about, styles.about, slideCount);  
      cssScene.add(cssObject);
    }
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText(nameObject, glScene, '#228B22', initialPos.nameObject, 115, 115, 100, 'About', 'muli_regular')
      .then(name => nameObject = name);
    leftArrowObject = createArrow(glScene, '#ff8c00', initialPos.leftArrowObject, new THREE.Euler(0, 0, 0), 'LAST');
    rightArrowObject = createArrow(glScene, '#ff8c00', initialPos.rightArrowObject, new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD), 'NEXT');
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
        // controls.enabled = false;
      }
      if(selectedObject.object.userData === 'LAST') { 
        backSide = !backSide;
        flipRight = false;
        flipLeft = true;
        // controls.enabled = false;
      }
      // if(selectedObject.object.userData === 'SLIDE') { 
      //   flipRight = true;
      //   waitSlide = true;
      // }
      // if(selectedObject.object.userData === 'GITHUB') window.open(projects[projectCount].github, '_blank');
      // if(selectedObject.object.userData === 'SITE') window.open(projects[projectCount].site, '_blank');
    }
  }

  // CHANGE PROJECT OR SLIDE
  // function newProject(type) {
  //   if(type === 'Project') {
  //     slideCount = 0;
  //     leftArrowObject.material.color.set(projects[projectCount].secondaryColor);
  //     rightArrowObject.material.color.set(projects[projectCount].secondaryColor);
  //   } else {
  //     slideCount < slideMax ? slideCount++ : slideCount = 0;
  //   }
  //   createProjectPage(1500, type === 'Project' ? 1300 : 1300, initialPos.cssObject, cssObject.rotation, projectCount);
  // }

  // function resetPositions() {
  //   nextProject = false;
  //   lastProject = false;
  //   changeProject = false;
  //   cssObject.position.x = initialPos.cssObject.x;
  //   planeObject.position.x = initialPos.planeObject.x;
  //   frameObject.position.x = initialPos.frameObject.x;
  //   nameObject.position.x = initialPos.nameObject.x;
  //   leftArrowObject.position.y = initialPos.leftArrowObject.y;
  //   rightArrowObject.position.y = initialPos.rightArrowObject.y;
  //   gitHubObject.position.y = initialPos.gitHubObject.y;
  //   siteObject.position.y = initialPos.siteObject.y;
  // }

  function resetCamera() {
    controls.reset();
    camera.position.set(0, -850, cameraDepth + 900);
    controls.target = new THREE.Vector3(0, -850, 400);
  }

  // CONSTANT UPDATE
  function update() { 
    if(flipRight) {
      if(cssScene.quaternion._y <= -.999999) {
        flipRight = false;
        glScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
        cssScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
      }
      cssScene.rotation.y -= 0.02;
      glScene.rotation.y -= 0.02;
    }
    if(flipLeft) {
      if(cssScene.quaternion._y >= .999999) {
        flipLeft = false;
        glScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
        cssScene.rotation.set(0, - 180 * THREE.MathUtils.DEG2RAD, 0);
      }   
      cssScene.rotation.y += 0.02;
      glScene.rotation.y += 0.02;
    }

    // if(waitSlide && !changeSlide) {
    //   rockObject.position.x -= 150;
    //   rockObject2.position.x += 150;
    //   rockObject3.position.x -= 150;
    //   rockObject4.position.x += 150;
    //   grassObject.position.y -= 150;
    // }
    // if(waitSlide && changeSlide) {
    //   if(rockObject.position.x < initialPos.rockObject.x) rockObject.position.x += 150;
    //   if(rockObject2.position.x > initialPos.rockObject2.x) rockObject2.position.x -= 150;
    //   if(rockObject3.position.x < initialPos.rockObject3.x) rockObject3.position.x += 150;
    //   if(rockObject4.position.x > initialPos.rockObject4.x) rockObject4.position.x -= 150;
    //   if(grassObject.position.y < initialPos.grassObject.y) grassObject.position.y += 150;
    //   else { 
    //     waitSlide = false;
    //     changeSlide = false;
    //   }
    // }
    
    // if(nextProject) {
    //   changeProject = projectChange(-1, 'PICTURE', cssObject, glScene, changeProject, newProject);
    //   if(leftArrowObject.position.y === initialPos.leftArrowObject.y & changeProject === true) resetPositions();
    // }

    // if(lastProject) {
    //   changeProject = projectChange(1, 'PICTURE', cssObject, glScene, changeProject, newProject);
    //   if(rightArrowObject.position.y === initialPos.rightArrowObject.y & changeProject === true) resetPositions();    
    // }
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

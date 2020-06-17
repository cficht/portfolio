import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createProjectCssObject } from '../../utilities/initialize-page';
import { createBackground, createRock, createGrass, create3DText, createIcon, createArrow, createPictureFrame } from '../../utilities/create-objects';
import { projectChange } from '../../utilities/other';
import { projects } from '../../data/info';
import { projectField, github, site } from '../../data/objects';
import styles from './Projects.css';

const Projects = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, rockObject, rockObject2, grassObject,  cssObject, planeObject, frameObject, nameObject, leftArrowObject, rightArrowObject, gitHubObject, siteObject, selectedObject;
  let nextSlide = false, changeSlide = false, nextProject = false, lastProject = false, changeProject = false;
  let cameraDepth = 2750;
  let projectCount = 0;
  let slideCount = 0;
  const slideMax = 2;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    rockObject: new THREE.Vector3(-1500, -1750, -3050),
    rockObject2: new THREE.Vector3(1500, -1750, -3050),
    grassObject: new THREE.Vector3(0, -2350, -2800),
    cssObject: new THREE.Vector3(0, -1550, -3900),
    planeObject: new THREE.Vector3(0, -1550, -3900),
    frameObject: new THREE.Vector3(0, -1550, -3900),
    nameObject: new THREE.Vector3(-10, -550, -3900),
    logoObject: new THREE.Vector3(0, 900, -3500),
    leftArrowObject: new THREE.Vector3(-100, -2200, -2750), 
    rightArrowObject: new THREE.Vector3(100, -2200, -2750),
    gitHubObject: new THREE.Vector3(-450, -2200, -2750),
    siteObject: new THREE.Vector3(450, -2200, -2750)
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
    || navigator.userAgent.match(/Windows Phone/i)) cameraDepth = 4500;
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

    rockObject = createRock(797, 340, initialPos.rockObject, .15);
    glScene.add(rockObject);

    rockObject2 = createRock(797, 340, initialPos.rockObject2, .15, true);
    glScene.add(rockObject2);

    grassObject = createGrass(1662, 300, initialPos.grassObject, .18, 'tall');
    glScene.add(grassObject);


    createProjectPage(1500, 1100, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1;
    controls.minAzimuthAngle = -1;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1;
    controls.minDistance = 1500;
    controls.maxDistance = 5050;
    controls.enableKeys = false;
    
    camera.position.set(0, -1500, cameraDepth - 3000);
    controls.target = new THREE.Vector3(0, -1500, -3500);

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
      cssObject = createProjectCssObject(width, height, position, rotation, number, projects, styles.project, slideCount);  
      cssScene.add(cssObject);
    } else {
      const newPos = cssObject.position;
      cssScene.remove(cssObject);
      cssObject = createProjectCssObject(width, height, newPos, rotation, number, projects, styles.project, slideCount);  
      cssScene.add(cssObject);
    }

    create3DText(nameObject, glScene, projects[number].logoColor, initialPos.nameObject, 115, 115, 100, projects[number].name, 'muli_regular')
      .then(name => nameObject = name);
    if(!gitHubObject) createIcon(glScene, initialPos.gitHubObject, github)
      .then(gitHub => gitHubObject = gitHub);
    if(!siteObject) createIcon(glScene, initialPos.siteObject, site)
      .then(site => siteObject = site);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    leftArrowObject = createArrow(glScene, projects[projectCount].secondaryColor, initialPos.leftArrowObject, new THREE.Euler(0, 0, 0), 'LAST');
    rightArrowObject = createArrow(glScene, projects[projectCount].secondaryColor, initialPos.rightArrowObject, new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD), 'NEXT');
    const frameSize = {
      x: 900,
      y: 1100,
      z: 512
    };
    createPictureFrame(glScene, frameSize, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0))
      .then(frame => frameObject = frame);
  }

  // INTERACTION
  function onClick(event) {
    if(nextProject || lastProject) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'NEXT' && projectCount < projects.length - 1) {
        lastProject = false;
        nextProject = true; 
        projectCount = projectCount + 1;
      }
      if(selectedObject.object.userData === 'LAST' && projectCount > 0) { 
        nextProject = false; 
        lastProject = true;
        projectCount = projectCount - 1;
      }
      if(selectedObject.object.userData === 'SLIDE') nextSlide = true;
      if(selectedObject.object.userData === 'GITHUB') window.open(projects[projectCount].github, '_blank');
      if(selectedObject.object.userData === 'SITE') window.open(projects[projectCount].site, '_blank');
    }
  }

  // CHANGE PROJECT OR SLIDE
  function newProject(type) {
    if(type === 'Project') {
      slideCount = 0;
      leftArrowObject.material.color.set(projects[projectCount].secondaryColor);
      rightArrowObject.material.color.set(projects[projectCount].secondaryColor);
    } else {
      slideCount < slideMax ? slideCount++ : slideCount = 0;
    }
    createProjectPage(1500, type === 'Project' ? 1100 : 1100, initialPos.cssObject, cssObject.rotation, projectCount);
  }

  function resetPositions() {
    nextProject = false;
    lastProject = false;
    changeProject = false;
    cssObject.position.x = initialPos.cssObject.x;
    planeObject.position.x = initialPos.planeObject.x;
    frameObject.position.x = initialPos.frameObject.x;
    nameObject.position.x = initialPos.nameObject.x;
    leftArrowObject.position.y = initialPos.leftArrowObject.y;
    rightArrowObject.position.y = initialPos.rightArrowObject.y;
    gitHubObject.position.y = initialPos.gitHubObject.y;
    siteObject.position.y = initialPos.siteObject.y;
  }

  function resetCamera() {
    controls.reset();
    camera.position.set(0, -1500, cameraDepth - 3000);
    controls.target = new THREE.Vector3(0, -1500, -3500);
  }

  // CONSTANT UPDATE
  function update() { 
    // console.log(controls);
    // cloudObjects.map(cloud => cloud.position.x >= 6000 ? cloud.position.x = -6000 : cloud.position.x += 5);

    if(nextSlide) {
      if(cssObject.quaternion._y >= 0) {
        if(cssObject.quaternion._y >= .99 && changeSlide === false) {
          newProject('Slide');
          changeSlide = true;
        }
        frameObject.rotation.y += 0.06;
        cssObject.rotation.y += 0.06;
        planeObject.rotation.y += 0.06;       
      } else {
        nextSlide = false;
        changeSlide = false;
        frameObject.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
        planeObject.rotation.set(0, 0, 0);
        cssObject.rotation.set(0, 0, 0);
      }
    }
    
    if(nextProject) {
      changeProject = projectChange(-1, 'PICTURE', cssObject, glScene, changeProject, newProject);
      if(leftArrowObject.position.y > initialPos.leftArrowObject.y & changeProject === true) resetPositions();
    }

    if(lastProject) {
      changeProject = projectChange(1, 'PICTURE', cssObject, glScene, changeProject, newProject);
      if(rightArrowObject.position.y > initialPos.rightArrowObject.y & changeProject === true) resetPositions();    
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
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Tech</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Projects;

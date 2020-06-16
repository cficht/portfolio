import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createProjectCssObject } from '../../utilities/initialize-page';
import { createBackground, createClouds, create3DText, createIcon, createArrow, createPictureFrame } from '../../utilities/create-objects';
import { projectChange } from '../../utilities/other';
import { projects } from '../../data/info';
import { clouds, field, github, site } from '../../data/objects';
import styles from './Projects.css';

const Projects = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, cloudObjects, cssObject, planeObject, frameObject, nameObject, leftArrowObject, rightArrowObject, gitHubObject, siteObject, selectedObject;
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
    cssObject: new THREE.Vector3(0, 100, 0),
    planeObject: new THREE.Vector3(0, 100, 0),
    frameObject: new THREE.Vector3(0, 100, 0),
    nameObject: new THREE.Vector3(-10, 800, 0),
    logoObject: new THREE.Vector3(0, 900, 0),
    leftArrowObject: new THREE.Vector3(-100, -650, 0), 
    rightArrowObject: new THREE.Vector3(100, -650, 0),
    gitHubObject: new THREE.Vector3(-450, -650, 0),
    siteObject: new THREE.Vector3(450, -650, 0)
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
    createProjectPage(1200, 800, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
    createProject3DGeometry();  
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;
    controls.maxPolarAngle = 2;
    controls.minPolarAngle = 1;
    controls.minDistance = 700;
    controls.maxDistance = 4000;
    controls.enableKeys = false;

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

    create3DText(nameObject, glScene, projects[number].logoColor, initialPos.nameObject, 100, 100, 100, projects[number].name, 'muli_regular')
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
      x: 700,
      y: 700,
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
    createProjectPage(1200, type === 'Project' ? 800 : 700, initialPos.cssObject, cssObject.rotation, projectCount);
  }

  function resetPositions() {
    nextProject = false;
    lastProject = false;
    changeProject = false;
    cssObject.position.x = initialPos.cssObject.x;
    planeObject.position.x = initialPos.planeObject.x;
    frameObject.position.x = initialPos.frameObject.x;
    nameObject.position.x = initialPos.nameObject.x;
    leftArrowObject.position.x = initialPos.leftArrowObject.x;
    rightArrowObject.position.x = initialPos.rightArrowObject.x;
    gitHubObject.position.x = initialPos.gitHubObject.x;
    siteObject.position.x = initialPos.siteObject.x;
  }

  // CONSTANT UPDATE
  function update() { 
    cloudObjects.map(cloud => cloud.position.x >= 6000 ? cloud.position.x = -6000 : cloud.position.x += 5);

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
      changeProject = projectChange(-1, 'LAST', cssObject, glScene, changeProject, newProject);
      if(leftArrowObject.position.x < initialPos.leftArrowObject.x & changeProject === true) resetPositions();
    }

    if(lastProject) {
      changeProject = projectChange(1, 'NEXT', cssObject, glScene, changeProject, newProject);
      if(rightArrowObject.position.x > initialPos.rightArrowObject.x & changeProject === true) resetPositions();    
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
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => controls.reset()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Projects;

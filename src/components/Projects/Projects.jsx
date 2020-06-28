import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createProjectCssObject } from '../../utilities/initialize-page';
import { createBackground, createRock, createGrass, create3DText, createIcon, createArrow, createPictureFrame, manager } from '../../utilities/create-objects';
import { projectChange } from '../../utilities/other';
import { projects } from '../../data/info';
import { projectField, github, site } from '../../data/objects';
import { projectPos as initialPos } from '../../data/positions';
import styles from '../../Main.css';

let 
  camera, 
  controls;
let cameraDepth = 200;
let mobileDepth = 1400;

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);

  let 
    glRenderer, 
    cssRenderer, 
    selectedObject,
    backgroundObject, 
    rockObject, 
    rockObject2, 
    rockObject3, 
    rockObject4, 
    grassObject, 
    cssObject, 
    planeObject, 
    frameObject, 
    pageObject, 
    nameObject, 
    leftArrowObject, 
    rightArrowObject, 
    gitHubObject, 
    siteObject;

  let projectObjects = [];
  
  let nextSlide = false, changeSlide = false, waitSlide = false, nextProject = false, lastProject = false, changeProject = false;
  let projectCount = 0;
  let slideCount = 0;
  const slideMax = 2;
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
      console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    manager.onLoad = function() {
      console.log('Files loadeded!');
      createProjectPage(1700, 1000, initialPos.cssObject, new THREE.Vector3(0, 0, 0), 0);
      update();
      setIsLoading(false);
    };
    manager.onProgress = function(url, itemsLoaded, itemsTotal) {
      console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    manager.onError = function(url) {
      console.log('There was an error loading ' + url);
    };

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
    backgroundObject = createBackground(projectField);
    glScene.add(backgroundObject);
    rockObject = createRock(797, 340, initialPos.rockObject, .15, 0, true);
    glScene.add(rockObject);
    rockObject2 = createRock(687, 503, initialPos.rockObject2, .17, 1);
    glScene.add(rockObject2);
    rockObject3 = createRock(543, 480, initialPos.rockObject3, .15, 2, true);
    glScene.add(rockObject3);
    rockObject4 = createRock(348, 259, initialPos.rockObject4, .25, 3);
    glScene.add(rockObject4);
    grassObject = createGrass(1662, 300, initialPos.grassObject, .18, 'tall');
    glScene.add(grassObject);

    createProject3DGeometry();  

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = .3;
    controls.minAzimuthAngle = -.3;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth + 2400;
    controls.maxDistance = cameraDepth + 3500;
    controls.enableKeys = false;
    
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);

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

    let nameObjPos;
    if(nameObject) nameObjPos = nameObject.position;
    glScene.remove(nameObject);
    nameObject = projectObjects[number].name;
    if(nameObjPos) nameObject.position.set(nameObjPos.x, nameObjPos.y, nameObjPos.z);
    glScene.add(nameObject);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText('#228B22', initialPos.pageObject, 120, 120, 120, 'Projects', 'muli_regular', 'PROJECTS')
      .then(page => pageObject = page)
      .then(() => glScene.add(pageObject));

    leftArrowObject = createArrow(projects[projectCount].secondaryColor, initialPos.leftArrowObject, new THREE.Euler(0, 0, 0), 'LAST');
    glScene.add(leftArrowObject);
    rightArrowObject = createArrow(projects[projectCount].secondaryColor, initialPos.rightArrowObject, new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD), 'NEXT');
    glScene.add(rightArrowObject);

    projects.map(project => {
      create3DText(project.logoColor, initialPos.nameObject, 85, 85, 85, project.name, 'muli_regular')
        .then(projectName => projectObjects.push({ name: projectName }));
    });
    
    createIcon(initialPos.gitHubObject, github)
      .then(gitHub => gitHubObject = gitHub)
      .then(() => glScene.add(gitHubObject));
    createIcon(initialPos.siteObject, site)
      .then(site => siteObject = site)
      .then(() => glScene.add(siteObject));

    createPictureFrame({ x: 1000, y: 1000, z: 512 }, initialPos.frameObject, new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0))
      .then(frame => frameObject = frame)
      .then(() => glScene.add(frameObject));
  }

  // INTERACTION
  function onClick(event) {
    if(nextProject || lastProject || nextSlide || waitSlide) return;
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
        projectCount++;
      }
      if(selectedObject.object.userData === 'LAST' && projectCount > 0) { 
        nextProject = false; 
        lastProject = true;
        projectCount--;
      }
      if(selectedObject.object.userData === 'SLIDE') { 
        nextSlide = true;
        waitSlide = true;
      }
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
    createProjectPage(1700, type === 'Project' ? 1000 : 1000, initialPos.cssObject, cssObject.rotation, projectCount);
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
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);
  }

  // CONSTANT UPDATE
  function update() { 
    if(nextSlide) {
      if(rockObject3.position.x < -7000) waitSlide = false;
      if(cssObject.quaternion._y >= 0) {
        if(cssObject.quaternion._y >= .99 && changeSlide === false) {
          newProject('Slide');
          changeSlide = true;
        }
        if(!waitSlide) {
          frameObject.rotation.y += 0.06;
          cssObject.rotation.y += 0.06;
          planeObject.rotation.y += 0.06;  
        }   
      } else {
        nextSlide = false;
        waitSlide = true;
        frameObject.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
        planeObject.rotation.set(0, 0, 0);
        cssObject.rotation.set(0, 0, 0);
      }
    }

    if(waitSlide && !changeSlide) {
      rockObject.position.x -= 150;
      rockObject2.position.x += 150;
      rockObject3.position.x -= 150;
      rockObject4.position.x += 150;
      grassObject.position.y -= 150;
    }
    if(waitSlide && changeSlide) {
      if(rockObject.position.x < initialPos.rockObject.x) rockObject.position.x += 150;
      if(rockObject2.position.x > initialPos.rockObject2.x) rockObject2.position.x -= 150;
      if(rockObject3.position.x < initialPos.rockObject3.x) rockObject3.position.x += 150;
      if(rockObject4.position.x > initialPos.rockObject4.x) rockObject4.position.x -= 150;
      if(grassObject.position.y < initialPos.grassObject.y) grassObject.position.y += 150;
      else { 
        waitSlide = false;
        changeSlide = false;
      }
    }
    
    if(nextProject) {
      changeProject = projectChange(-1, 'PICTURE', cssObject, glScene, changeProject, newProject);
      if(leftArrowObject.position.y === initialPos.leftArrowObject.y & changeProject === true) resetPositions();
    }

    if(lastProject) {
      changeProject = projectChange(1, 'PICTURE', cssObject, glScene, changeProject, newProject);
      if(rightArrowObject.position.y === initialPos.rightArrowObject.y & changeProject === true) resetPositions();    
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
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/tech">Tech</a>
          <a>Projects</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Projects;

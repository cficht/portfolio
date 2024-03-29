import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import {
  createGlRenderer,
  createCssRenderer,
  createPlane,
  createProjectCssObject,
  updateProjectCssObject,
} from '../../utilities/initialize-page';
import {
  createBackground,
  createRock,
  createGrass,
  create3DText,
  createIcon,
  createArrow,
  createPictureFrame,
  manager,
} from '../../utilities/create-objects';
import { projectChange, loadingBar } from '../../utilities/other';
import { projects } from '../../data/info';
import { projectField, github, site } from '../../data/objects';
import { projectPos as initialPos } from '../../data/positions';
import styles from '../../Main.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

let camera, controls;
let cameraDepth = 200;
let mobileDepth = 1400;
let maxAz = 0.3;
let minAz = -0.3;

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);

  let glRenderer,
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

  let modelsLoaded = 0;
  let modelsTotal = 0;

  let nextSlide = false,
    changeSlide = false,
    waitSlide = false,
    nextProject = false,
    lastProject = false,
    changeProject = false;
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
      modelsLoaded = itemsLoaded;
      modelsTotal = itemsTotal;
    };
    manager.onLoad = function() {
      setTimeout(() => {
        createProjectPage(
          1900,
          1200,
          initialPos.cssObject,
          new THREE.Vector3(0, 0, 0),
          0
        );
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
    if(
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
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
    rockObject = createRock(797, 340, initialPos.rockObject, 0.15, 0, true);
    glScene.add(rockObject);
    rockObject2 = createRock(687, 503, initialPos.rockObject2, 0.17, 1);
    glScene.add(rockObject2);
    rockObject3 = createRock(543, 480, initialPos.rockObject3, 0.15, 2, true);
    glScene.add(rockObject3);
    rockObject4 = createRock(348, 259, initialPos.rockObject4, 0.25, 3);
    glScene.add(rockObject4);
    grassObject = createGrass(1662, 300, initialPos.grassObject, 0.18, 'tall');
    glScene.add(grassObject);

    createProject3DGeometry();

    // STATIC OBJECT POSITIONS
    backgroundObject.updateMatrix();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = maxAz;
    controls.minAzimuthAngle = minAz;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth + 2400;
    controls.maxDistance = cameraDepth + 3500;
    controls.enableKeys = false;
    controls.mouseButtons = {
      ORBIT: THREE.MOUSE.ROTATE,
      ZOOM: THREE.MOUSE.DOLLY,
    };

    camera.position.set(
      initialPos.cameraMain.x,
      initialPos.cameraMain.y,
      cameraDepth
    );
    controls.target.set(
      initialPos.cameraMain.x,
      initialPos.cameraMain.y,
      initialPos.cameraMain.z
    );

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('mousedown', onClick, true);
    cssRenderer.domElement.addEventListener('mousemove', onOver, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  useEffect(() => {
    const ratio = (window.innerWidth / window.innerHeight);
    const coverLeft = document.getElementsByClassName(styles.cover_left)[0];
    const coverRight = document.getElementsByClassName(styles.cover_right)[0];
    const hudBox = document.getElementsByClassName(styles.hud_box)[0];
    if(coverLeft && coverRight && hudBox && ratio > 2.11) {
      coverLeft.style.width = `${ratio * 10}%`;
      coverRight.style.width = `${ratio * 10}%`;
      hudBox.style.width = `calc(${(100 - ((ratio * 10) * 2))}%)`;
      hudBox.children[0].style.borderTopLeftRadius = '0px';
      hudBox.children[0].style.borderTopRightRadius = '0px';
    }
    if(ratio > 3.37) {
      window.location = '/aspect/projects';
    }
  }, []);

  // SETUP OBJECTS THAT WILL CHANGE
  function createProjectPage(width, height, position, rotation, number) {
    if(!planeObject) {
      planeObject = createPlane(width, height, position, rotation);
      glScene.add(planeObject);
    }

    if(!cssObject) {
      cssObject = createProjectCssObject(
        width,
        height,
        position,
        rotation,
        number,
        projects,
        styles.project,
        slideCount
      );
      cssScene.add(cssObject);
    } else {
      cssObject.element.style.opacity = 0;
      const newElement = updateProjectCssObject(
        width,
        height,
        number,
        projects,
        styles.project,
        slideCount
      );
      cssObject.element = newElement;
    }

    let nameObjPos;
    if(nameObject) {
      nameObjPos = nameObject.position;
      nameObject.material.visible = false;
    }
    nameObject = projectObjects[number].name;
    nameObject.material.visible = true;
    if(nameObjPos)
      nameObject.position.set(nameObjPos.x, nameObjPos.y, nameObjPos.z);
    if(!glScene.children.find((child) => child === nameObject))
      glScene.add(nameObject);
  }

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {
    create3DText(
      '#ff8c00',
      initialPos.pageObject,
      120,
      120,
      120,
      'Projects',
      'muli_regular',
      'PROJECTS'
    )
      .then((page) => (pageObject = page))
      .then(() => glScene.add(pageObject));

    leftArrowObject = createArrow(
      projects[projectCount].secondaryColor,
      initialPos.leftArrowObject,
      new THREE.Euler(0, 0, 0),
      'LAST',
      1,
      true
    );
    glScene.add(leftArrowObject);
    rightArrowObject = createArrow(
      projects[projectCount].secondaryColor,
      initialPos.rightArrowObject,
      new THREE.Euler(0, 0, -180 * THREE.MathUtils.DEG2RAD),
      'NEXT',
      1,
      true
    );
    glScene.add(rightArrowObject);

    projects.map((project) => {
      create3DText(
        project.logoColor,
        initialPos.nameObject,
        85,
        85,
        85,
        project.name,
        'muli_regular',
        'PROJECTNAME'
      ).then((projectName) => projectObjects.push({ name: projectName }));
    });

    createIcon(initialPos.gitHubObject, github, true, 10, 0)
      .then((gitHub) => (gitHubObject = gitHub))
      .then(() => glScene.add(gitHubObject));
    createIcon(initialPos.siteObject, site, true, 10, 0)
      .then((site) => (siteObject = site))
      .then(() => glScene.add(siteObject));

    createPictureFrame(
      { x: 1000, y: 1000, z: 512 },
      initialPos.frameObject,
      new THREE.Euler(0, -180 * THREE.MathUtils.DEG2RAD, 0)
    )
      .then((frame) => (frameObject = frame))
      .then(() => glScene.add(frameObject));
  }

  // INTERACTION
  function onClick(event) {
    if(nextProject || lastProject || nextSlide || waitSlide) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = -(event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(
        selectedObject.object.userData === 'NEXT' &&
        projectCount < projects.length - 1
      ) {
        lastProject = false;
        nextProject = true;
        projectCount++;
      } else if(
        selectedObject.object.userData === 'NEXT' &&
        projectCount === projects.length - 1
      ) {
        lastProject = false;
        nextProject = true;
        projectCount = 0;
      } else if(
        selectedObject.object.userData === 'LAST' &&
        projectCount > 0
      ) {
        nextProject = false;
        lastProject = true;
        projectCount--;
      } else if(
        selectedObject.object.userData === 'LAST' &&
        projectCount === 0
      ) {
        nextProject = false;
        lastProject = true;
        projectCount = projects.length - 1;
      } else if(selectedObject.object.userData === 'SLIDE') {
        nextSlide = true;
        waitSlide = true;
      } else if(selectedObject.object.userData === 'GITHUB')
        window.open(projects[projectCount].github, '_blank');
      else if(selectedObject.object.userData === 'SITE' && projects[projectCount].site !== 'none')
        window.open(projects[projectCount].site, '_blank');
    }
  }

  function onOver(event) {
    if(event.buttons > 0) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = -(event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(
        selectedObject.object.userData === 'NEXT' ||
        selectedObject.object.userData === 'LAST' ||
        selectedObject.object.userData === 'GITHUB' ||
        (selectedObject.object.userData === 'SITE' && projects[projectCount].site !== 'none')
      ) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    }
  }

  // CHANGE PROJECT OR SLIDE
  function newProject(type) {
    if(type === 'Project') {
      slideCount = 0;
      leftArrowObject.material.color.set(projects[projectCount].secondaryColor);
      rightArrowObject.material.color.set(
        projects[projectCount].secondaryColor
      );
    } else {
      slideCount < slideMax ? slideCount++ : (slideCount = 0);
    }
    if(projects[projectCount].site === 'none') {
      siteObject.material.transparent = true;
      siteObject.material.opacity = 0.3;
    } else if(projects[projectCount].site !== 'none' && siteObject.material.transparent === true) {
      siteObject.material.transparent = false;
      siteObject.material.opacity = 1;
    }
    createProjectPage(
      1900,
      type === 'Project' ? 1200 : 1200,
      initialPos.cssObject,
      cssObject.rotation,
      projectCount
    );
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
    camera.position.set(
      initialPos.cameraMain.x,
      initialPos.cameraMain.y,
      cameraDepth
    );
    controls.target.set(
      initialPos.cameraMain.x,
      initialPos.cameraMain.y,
      initialPos.cameraMain.z
    );
  }

  // CONSTANT UPDATE
  function update() {
    if(nextSlide) {
      if(rockObject3.position.x < -7000) waitSlide = false;
      if(cssObject.quaternion._y >= 0) {
        if(cssObject.quaternion._y >= 0.99 && changeSlide === false) {
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
        frameObject.rotation.copy(
          new THREE.Euler(0, -180 * THREE.MathUtils.DEG2RAD, 0)
        );
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
      if(rockObject.position.x < initialPos.rockObject.x)
        rockObject.position.x += 150;
      if(rockObject2.position.x > initialPos.rockObject2.x)
        rockObject2.position.x -= 150;
      if(rockObject3.position.x < initialPos.rockObject3.x)
        rockObject3.position.x += 150;
      if(rockObject4.position.x > initialPos.rockObject4.x)
        rockObject4.position.x -= 150;
      if(grassObject.position.y < initialPos.grassObject.y)
        grassObject.position.y += 150;
      else {
        waitSlide = false;
        changeSlide = false;
      }
    }

    if(nextProject) {
      changeProject = projectChange(
        -1,
        'PICTURE',
        cssObject,
        glScene,
        changeProject,
        newProject
      );
      if(
        (leftArrowObject.position.y === initialPos.leftArrowObject.y) &
        (changeProject === true)
      )
        resetPositions();
    }

    if(lastProject) {
      changeProject = projectChange(
        1,
        'PICTURE',
        cssObject,
        glScene,
        changeProject,
        newProject
      );
      if(
        (rightArrowObject.position.y === initialPos.rightArrowObject.y) &
        (changeProject === true)
      )
        resetPositions();
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
      {loadingScreen()}
      <div className={styles.cover_left}/>
      <div className={styles.hud_box}>
        <div className={styles.hud_contents}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/tech">Tech</Link>
          <a style={{ opacity: 0.5, pointerEvents: 'none' }}>Projects</a>
          <div className={styles.camera} onClick={() => resetCamera()}>
            <img src="./images/common_images/camera.png"/>
          </div>
        </div>
      </div>
      <div className={styles.cover_right}/> 
      <div ref={(ref) => ref} />
    </>
  );
};

export default Projects;

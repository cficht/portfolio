import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer } from '../../utilities/initialize-page';
import { createBackground, createWall, createAirplane, createClouds, create3DText, createIcon, manager } from '../../utilities/create-objects';
import { loadingBar } from '../../utilities/other';
import { fieldContact, cloudsContact, githubContact, linkedin, email, resume } from '../../data/objects';
import { contactPosDesktop, contactPosMobile } from '../../data/positions';
import styles from '../../Main.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

let
  camera, 
  controls;
let cameraDepth = 300;
let mobileDepth = 1500;
let maxAz = .3;
let minAz = -.3;

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const initialPos = useRef(null);

  let 
    glRenderer, 
    cssRenderer, 
    selectedObject,
    backgroundObject, 
    airplaneObject, 
    cloudObjects, 
    movingWall, 
    movingWall2, 
    movingWall3, 
    movingWall4, 
    nameObject, 
    gitHubObject, 
    gitHubText, 
    linkedinObject, 
    linkedinText, 
    emailObject, 
    emailText,
    resumeObject,
    resumeText;

  let modelsLoaded = 0;
  let modelsTotal = 0;
  
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
      cameraDepth = mobileDepth;
      initialPos.current = window.orientation !== 0
        ? contactPosDesktop
        : contactPosMobile;
    } else {
      initialPos.current = contactPosDesktop;
    }
      
    camera = new THREE.PerspectiveCamera(45, setWidth / setHeight, 1, 10000);
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
    backgroundObject = createBackground(fieldContact);
    glScene.add(backgroundObject);

    airplaneObject = createAirplane(920, 311, initialPos.current.airplaneObject, .1);
    glScene.add(airplaneObject);

    cloudObjects = createClouds(cloudsContact);
    cloudObjects.map(cloudObject => glScene.add(cloudObject));

    movingWall = createWall(10000, 5000, new THREE.Vector3(0, 0, -4990));
    glScene.add(movingWall);
    movingWall2 = createWall(10000, 5000, new THREE.Vector3(10000, 0, -4990));
    glScene.add(movingWall2);
    movingWall3 = createWall(10000, 5000, new THREE.Vector3(-10000, 0, -4990));
    glScene.add(movingWall3);
    movingWall4 = createWall(10000, 5000, new THREE.Vector3(20000, 0, -4990));
    glScene.add(movingWall4);

    createProject3DGeometry();  

    // STATIC OBJECT POSITIONS
    backgroundObject.updateMatrix();
    airplaneObject.updateMatrix();

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
    
    camera.position.set(initialPos.current.cameraMain.x, initialPos.current.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.current.cameraMain.x, initialPos.current.cameraMain.y, initialPos.current.cameraMain.z);

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
      window.location = '/aspect/contact';
    }
  }, []);

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText('#ff8c00', initialPos.current.nameObject, 115, 115, 100, 'Contact', 'muli_regular')
      .then(name => nameObject = name)
      .then(() => glScene.add(nameObject));
    create3DText('#ff8c00', initialPos.current.emailText, 60, 60, 60, 'Email', 'muli_regular', 'EMAIL')
      .then(email => emailText = email)
      .then(() => glScene.add(emailText));
    create3DText('#ff8c00', initialPos.current.linkedinText, 60, 60, 60, 'LinkedIn', 'muli_regular', 'LINKEDIN')
      .then(linkedin => linkedinText = linkedin)
      .then(() => glScene.add(linkedinText));
    create3DText('#ff8c00', initialPos.current.gitHubText, 60, 60, 60, 'GitHub', 'muli_regular', 'GITHUB')
      .then(github => gitHubText = github)
      .then(() => glScene.add(gitHubText));
    create3DText('#ff8c00', initialPos.current.resumeText, 60, 60, 60, 'Resume', 'muli_regular', 'RESUME')
      .then(resume => resumeText = resume)
      .then(() => glScene.add(resumeText));

    createIcon(initialPos.current.emailObject, email, true, 15)
      .then(email => emailObject = email)
      .then(() => glScene.add(emailObject));
    createIcon(initialPos.current.linkedinObject, linkedin, true, 15)
      .then(linkedin => linkedinObject = linkedin)
      .then(() => glScene.add(linkedinObject));
    createIcon(initialPos.current.gitHubObject, githubContact, true, 15)
      .then(github => gitHubObject = github)
      .then(() => glScene.add(gitHubObject));
    createIcon(initialPos.current.resumeObject, resume, true, 15)
      .then(resume => resumeObject = resume)
      .then(() => glScene.add(resumeObject));
  }

  // INTERACTION
  function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    const filteredIntersects = intersects.filter(intersect => intersect.object.userData !== 'CLOUD');
    if(filteredIntersects.length > 0) {
      selectedObject = filteredIntersects[0];
      if(selectedObject.object.userData === 'GITHUB') window.open('https://github.com/cficht', '_blank');
      if(selectedObject.object.userData === 'LINKEDIN') window.open('https://www.linkedin.com/in/chrisficht/', '_blank');
      if(selectedObject.object.userData === 'EMAIL') window.open('mailto:chris.ficht@gmail.com', '_blank');
      if(selectedObject.object.userData === 'RESUME') window.open('./resume/chris_ficht_resume.pdf', '_blank');
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
    const filteredIntersects = intersects.filter(intersect => intersect.object.userData !== 'CLOUD');
    if(filteredIntersects.length > 0) {
      selectedObject = filteredIntersects[0];
      if(
        selectedObject.object.userData === 'GITHUB' ||
        selectedObject.object.userData === 'LINKEDIN' ||
        selectedObject.object.userData === 'EMAIL' ||
        selectedObject.object.userData === 'RESUME'
      ) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    } 
  }

  function resetCamera() {
    controls.reset();
    camera.position.set(initialPos.current.cameraMain.x, initialPos.current.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.current.cameraMain.x, initialPos.current.cameraMain.y, initialPos.current.cameraMain.z);
  }

  // CONSTANT UPDATE
  function update() { 
    if(movingWall) movingWall.position.x -= 10;
    if(movingWall2) movingWall2.position.x -= 10;
    if(movingWall3) movingWall3.position.x -= 10;
    if(movingWall4) movingWall4.position.x -= 10;
    if(movingWall.position.x === -20000) movingWall.position.x = 20000;
    if(movingWall2.position.x === -20000) movingWall2.position.x = 20000;
    if(movingWall3.position.x === -20000) movingWall3.position.x = 20000;
    if(movingWall4.position.x === -20000) movingWall4.position.x = 20000;

    cloudObjects.map(cloud => cloud.position.x <= -6000 ? cloud.position.x = 6000 : cloud.position.x -= 10);
    if(emailObject) emailObject.rotation.y += .03;
    if(linkedinObject) linkedinObject.rotation.y += .03;
    if(gitHubObject) gitHubObject.rotation.y += .03;
    if(resumeObject) resumeObject.rotation.y += .03;
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
      <div className={styles.cover_left}/>
      <div className={styles.hud_box}>
        <div className={styles.hud_contents}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <a style={{ opacity: 0.5, pointerEvents: 'none' }}>Contact</a>
          <Link to="/tech">Tech</Link>
          <Link to="/projects">Projects</Link>
          <div className={styles.camera} onClick={() => resetCamera()}>
            <img src="./images/common_images/camera.png"/>
          </div>
        </div>
      </div>
      <div className={styles.cover_right}/>    
      <div ref={ref => (ref)} />
    </>
  );
};

export default Contact;

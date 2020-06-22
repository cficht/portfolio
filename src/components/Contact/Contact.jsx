import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer } from '../../utilities/initialize-page';
import { createBackground, createWall, createAirplane, createClouds, create3DText, createIcon } from '../../utilities/create-objects';
import { fieldContact, cloudsContact, githubContact, linkedin, email } from '../../data/objects';
import styles from './Contact.css';

const Contact = () => {
  let camera, controls, glRenderer, cssRenderer, backgroundObject, airplaneObject, cloudObjects, movingWall, movingWall2, movingWall3, movingWall4, nameObject, gitHubObject, gitHubText, linkedinObject, linkedinText, emailObject, emailText, selectedObject;
  let cameraDepth = 250;
  let mobileDepth = 750;
  // deskZoom = 3750
  // mobZoom = 4250
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const initialPos = {
    cameraMain: new THREE.Vector3(0, -50, -3500),
    airplaneObject: new THREE.Vector3(0, 200, -3500),
    nameObject: new THREE.Vector3(-10, 1000, -3500),
    emailObject: new THREE.Vector3(-650, -650, -3500),
    emailText: new THREE.Vector3(-650, -950, -3500),
    linkedinObject: new THREE.Vector3(0, -650, -3500),
    linkedinText: new THREE.Vector3(0, -950, -3500),
    gitHubObject: new THREE.Vector3(650, -650, -3500),
    gitHubText: new THREE.Vector3(650, -950, -3500)
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
    backgroundObject = createBackground(fieldContact);
    glScene.add(backgroundObject);

    airplaneObject = createAirplane(920, 311, initialPos.airplaneObject, .1);
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
    update();

    // CONTROLS
    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = .3;
    controls.minAzimuthAngle = -.3;
    controls.maxPolarAngle = 1.75;
    controls.minPolarAngle = 1.25;
    controls.minDistance = cameraDepth + 2400;
    controls.maxDistance = cameraDepth + 3500;
    controls.enableKeys = false;
    // deskZoom = 3750
    // mobZoom = 4250
    
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);

    // EVENT LISTENERS
    cssRenderer.domElement.addEventListener('click', onClick, true);
    window.addEventListener('resize', () => location.reload());
  }, []);

  // SETUP OBJECTS THAT WILL NOT CHANGE
  function createProject3DGeometry() {  
    create3DText(nameObject, glScene, '#228B22', initialPos.nameObject, 115, 115, 100, 'Contact', 'muli_regular')
      .then(name => nameObject = name);
    create3DText(emailText, glScene, '#ff8c00', initialPos.emailText, 60, 60, 60, 'Email', 'muli_regular', 'EMAIL')
      .then(email => emailText = email);
    create3DText(linkedinText, glScene, '#ff8c00', initialPos.linkedinText, 60, 60, 60, 'LinkedIn', 'muli_regular', 'LINKEDIN')
      .then(linkedin => linkedinText = linkedin);
    create3DText(gitHubText, glScene, '#ff8c00', initialPos.gitHubText, 60, 60, 60, 'GitHub', 'muli_regular', 'GITHUB')
      .then(github => gitHubText = github);

    if(!emailObject) createIcon(glScene, initialPos.emailObject, email)
      .then(email => emailObject = email);
    if(!linkedinObject) createIcon(glScene, initialPos.linkedinObject, linkedin)
      .then(linkedin => linkedinObject = linkedin);
    if(!gitHubObject) createIcon(glScene, initialPos.gitHubObject, githubContact)
      .then(github => gitHubObject = github);
  }

  // INTERACTION
  function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true);
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'GITHUB') window.open('https://github.com/cficht', '_blank');
      if(selectedObject.object.userData === 'LINKEDIN') window.open('https://www.linkedin.com/in/chrisficht/', '_blank');
      if(selectedObject.object.userData === 'EMAIL') window.open('mailto:chris.ficht@gmail.com', '_blank');
    }
  }

  function resetCamera() {
    controls.reset();
    camera.position.set(initialPos.cameraMain.x, initialPos.cameraMain.y, cameraDepth);
    controls.target.set(initialPos.cameraMain.x, initialPos.cameraMain.y, initialPos.cameraMain.z);
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
          <a href="/tech">Tech</a>
          <a href="/projects">Projects</a>
          <input type="image" src="./images/common_images/camera.png" alt="center camera" onClick={() => resetCamera()}/>
        </div>       
      </div>
      <div ref={ref => (ref)} />
    </>
  );
};

export default Contact;

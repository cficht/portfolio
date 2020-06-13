import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createProjectCssObject } from '../../utilities/initialize-page';
import { createColoredMaterial } from '../../utilities/create-other';
import { createBackground, createClouds, create3DText } from '../../utilities/create-objects';
import { GLTFLoader } from '../../loaders/GLTFLoader';
import { STLLoader } from '../../loaders/STLLoader.js';
import { projects } from '../../data/projects';
import { clouds, field } from '../../data/objects';
import { fetchScheme } from '../../services/color-api';
import styles from './Projects.css';

const Projects = () => {
  const [firstScheme, setFirstScheme] = useState([]);
  let camera, glRenderer, cssRenderer, controls, backgroundObject, cloudObjects, cssObject, selectedObject, planeObject, frameObject, nameObject, leftArrowObject, rightArrowObject, gitHubObject, siteObject, schemeCopy;
  let nextSlide = false, changeSlide = false, nextRotate = false, lastRotate = false, changeProject = false;
  let count = 0;
  let slideCount = 0;
  const slideMax = 2;
  let cameraDepth = 2750;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  const glScene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const defPos = {
    cssObject: new THREE.Vector3(0, 100, 0),
    planeObject: new THREE.Vector3(0, 100, 0),
    frameObject: new THREE.Vector3(0, 100, 0),
    nameObject: new THREE.Vector3(0, 800, 0),
    logoObject: new THREE.Vector3(0, 900, 0),
    leftArrowObject: new THREE.Vector3(-100, -650, 0), 
    rightArrowObject: new THREE.Vector3(100, -650, 0),
    gitHubObject: new THREE.Vector3(-450, -650, 0),
    siteObject: new THREE.Vector3(450, -650, 0)
  };

  useEffect(() => {
    //analogic, complement, analogic-complement
    fetchScheme(projects[count].logoColor.slice(1), 'analogic')
      .then(scheme => setFirstScheme(scheme));
  }, []);

  useEffect(() => {
    if(firstScheme.length === 0) return;

    // INITIALIZE CAMERA
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
  
    // INITIALIZE RENDERERS
    glRenderer = createGlRenderer(setWidth, setHeight, styles.three_box);
    cssRenderer = createCssRenderer(setWidth, setHeight, styles.three_box); 
    const holder = document.createElement('div');
    holder.className = styles.three_box;
    document.body.appendChild(holder);
    holder.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(glRenderer.domElement);
  
    // INITIALIZE LIGHTING
    const ambientLight = new THREE.AmbientLight(0x555555);
    glScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 300).normalize();
    glScene.add(directionalLight);
  
    // INITIALIZE PAGE AND SCENE
    backgroundObject = createBackground(field.wall, field.ceiling, field.floor, 10000, 5000, 10000);
    glScene.add(backgroundObject);
    cloudObjects = createClouds(clouds);
    cloudObjects.map(cloudObject => glScene.add(cloudObject));
    create3dPage(1200, 800, defPos.cssObject, new THREE.Vector3(0, 0, 0), 0, firstScheme);
    create3dGeometry();  
    update();

    // INITIALIZE CONTROLS
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
  }, [firstScheme]);


  function create3dPage(width, height, position, rotation, number, colors) {  
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

    create3DText(nameObject, glScene, colors[2], defPos.nameObject, 100, 100, 100, projects[number].name)
      .then(name => nameObject = name);
    
    const stlLoader = new STLLoader();
    // CREATE GITHUB OBJECT
    if(!gitHubObject) {
      stlLoader.load('./models/common_models/github_icon.stl', function(geometry) {
        const material = new THREE.MeshToonMaterial({ color: '#000000', flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        mesh.scale.set(15, 15, 15);
        mesh.position.set(defPos.gitHubObject.x, defPos.gitHubObject.y, defPos.gitHubObject.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = 'GITHUB';
        gitHubObject = mesh;
        glScene.add(mesh);
      });
    }

    // CREATE SITE OBJECT
    if(!siteObject) {
      stlLoader.load('./models/common_models/internet_icon.stl', function(geometry) {
        const material = new THREE.MeshToonMaterial({ color: '#000000', flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        mesh.scale.set(15, 15, 15);
        mesh.position.set(defPos.siteObject.x, defPos.siteObject.y, defPos.siteObject.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = 'SITE';
        siteObject = mesh;
        glScene.add(mesh);
      });
    }
  }

  function create3dGeometry() {  

    // CREATE TRIANGLE
    const triangleShape = new THREE.Shape()
      .moveTo(0, -100)
      .lineTo(0, 100)
      .lineTo(-120, 0);

    const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

    const mesh = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings),
      createColoredMaterial(firstScheme[5])
    ); 
    mesh.position.set(defPos.leftArrowObject.x, defPos.leftArrowObject.y, defPos.leftArrowObject.z);
    mesh.userData = 'LAST';
    leftArrowObject = mesh;
    glScene.add(mesh);   

    const mesh2 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings),
      createColoredMaterial(firstScheme[5]));  
    mesh2.position.set(defPos.rightArrowObject.x, defPos.rightArrowObject.y, defPos.rightArrowObject.z);
    mesh2.rotation.copy(new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD));
    mesh2.userData = 'NEXT'; 
    rightArrowObject = mesh2; 
    glScene.add(mesh2);
 
    // CREATE PICTURE FRAME
    const gltfLoader = new GLTFLoader();
    const url = 'models/pictureframe_1/scene.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.scale.set(700, 700, 512);
      root.position.set(defPos.frameObject.x, defPos.frameObject.y, defPos.frameObject.z);
      root.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));

      const mesh = new THREE.MeshToonMaterial({ color: '#b5651d', flatShading: true });
      root.children[0].children[0].children[0].children[0].children[0].material = mesh;
      root.name = 'picture';
      frameObject = root;
      glScene.add(root);
    }); 
  }

  function onClick(event) {
    if(nextRotate || lastRotate) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true); //array
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'NEXT' && count < projects.length - 1) {
        lastRotate = false;
        nextRotate = true; 
        count = count + 1;
      }
      if(selectedObject.object.userData === 'LAST' && count > 0) { 
        nextRotate = false; 
        lastRotate = true;
        count = count - 1;
      }
      if(selectedObject.object.userData === 'SLIDE') nextSlide = true;
      if(selectedObject.object.userData === 'GITHUB') window.open(projects[count].github, '_blank');
      if(selectedObject.object.userData === 'SITE') window.open(projects[count].site, '_blank');
    }
  }

  function newProject() {
    slideCount = 0;
    fetchScheme(projects[count].logoColor.slice(1), 'analogic')
      .then(scheme => {
        schemeCopy = scheme;
        create3dPage(1200, 800, defPos.cssObject, cssObject.rotation, count, schemeCopy);
        leftArrowObject.material.color.set(schemeCopy[5]);
        rightArrowObject.material.color.set(schemeCopy[5]);
      });
  }

  function newSlide() {
    slideCount < slideMax ? slideCount++ : slideCount = 0;
    create3dPage(1200, 700, defPos.cssObject, cssObject.rotation, count, schemeCopy ? schemeCopy : firstScheme);
  }

  // UPDATE
  function update() { 
    if(nextSlide) {
      if(cssObject.quaternion._y >= 0) {
        if(cssObject.quaternion._y >= .99 && changeSlide === false) {
          newSlide();
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

    glScene.children.map(child => {    
      if(child.userData === 'CLOUD') child.position.x += 5;
      if(child.userData === 'CLOUD' && child.position.x > 6000) child.position.x = -6000;
    });

    if(nextRotate) {
      cssObject.position.x -= 100;
      if(cssObject.position.x < -7000) cssObject.position.x = cssObject.position.x + 14000;
      glScene.children.map(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'background' || child.userData === 'CLOUD') return;
        child.position.x -= 100;
        if(child.position.x < -5000) child.visible = false;
        if(child.position.x < 5000 && child.position.x > -5000) child.visible = true;
        if(child.position.x < -7000) { 
          child.position.x = child.position.x + 14000;
          if(changeProject === false && child.userData === 'LAST') {
            newProject();
            changeProject = true;
          }
        }
      });
      if(leftArrowObject.position.x < defPos.leftArrowObject.x & changeProject === true) {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssObject.position.x = defPos.cssObject.x;
        planeObject.position.x = defPos.planeObject.x;
        frameObject.position.x = defPos.frameObject.x;
        nameObject.position.x = defPos.nameObject.x;
        leftArrowObject.position.x = defPos.leftArrowObject.x;
        rightArrowObject.position.x = defPos.rightArrowObject.x;
        gitHubObject.position.x = defPos.gitHubObject.x;
        siteObject.position.x = defPos.siteObject.x;
      }
    }

    if(lastRotate) {
      cssObject.position.x += 100;
      if(cssObject.position.x > 7000) cssObject.position.x = cssObject.position.x - 14000;
      glScene.children.map(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'background' || child.userData === 'CLOUD') return;
        child.position.x += 100;
        if(child.position.x > 5000) child.visible = false;
        if(child.position.x > -5000 && child.position.x < 5000) child.visible = true;
        if(child.position.x > 7000) { 
          child.position.x = child.position.x - 14000;
          if(changeProject === false && child.userData === 'NEXT') {
            newProject();
            changeProject = true;
          }
        }
      });
      if(rightArrowObject.position.x > defPos.rightArrowObject.x & changeProject === true) {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssObject.position.x = defPos.cssObject.x;
        planeObject.position.x = defPos.planeObject.x;
        frameObject.position.x = defPos.frameObject.x;
        nameObject.position.x = defPos.nameObject.x;
        leftArrowObject.position.x = defPos.leftArrowObject.x;
        rightArrowObject.position.x = defPos.rightArrowObject.x;
        gitHubObject.position.x = defPos.gitHubObject.x;
        siteObject.position.x = defPos.siteObject.x;
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

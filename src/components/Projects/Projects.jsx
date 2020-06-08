import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { createGlRenderer, createCssRenderer, createPlane, createProjectCssObject, createColoredMaterial } from '../../utilities/three-create';
import { GLTFLoader } from '../../loaders/GLTFLoader';
import { STLLoader } from '../../loaders/STLLoader.js';
import { projects } from '../../data/projects';
import { fetchScheme } from '../../services/color-api';


import styles from './Projects.css';

const Projects = () => {
  const [firstScheme, setFirstScheme] = useState([]);
  let camera, glScene, cssScene, glRenderer, cssRenderer, controls, cssObject, selectedObject, planeObject, frameObject, nameObject, logoObject, leftArrowObject, rightArrowObject, schemeCopy;
  let count = 0;
  let nextRotate = false;
  let lastRotate = false;
  let changeProject = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  glScene = new THREE.Scene();
  cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const defaultPositions = {
    cssObject: new THREE.Vector3(-700, -200, 0),
    planeObject: new THREE.Vector3(-700, -200, 0),
    frameObject: new THREE.Vector3(-700, -200, 0),
    nameObject: new THREE.Vector3(-700, -600, 0),
    logoObject: new THREE.Vector3(1000, 600, 0),
    leftArrowObject: new THREE.Vector3(-1400, 600, 0), 
    rightArrowObject: new THREE.Vector3(0, 600, 0)
  };

  useEffect(() => {
    //analogic, complement, analogic-complement
    fetchScheme(projects[count].logoColor.slice(1), 'analogic')
      .then(scheme => setFirstScheme(scheme));
  }, []);

  useEffect(() => {
    if(firstScheme.length === 0) return;
    camera = new THREE.PerspectiveCamera(
      45,
      setWidth / setHeight,
      1,
      10000);
    camera.position.set(0, 100, 2000);
  
    glRenderer = createGlRenderer(setWidth, setHeight, styles.three_box);
    cssRenderer = createCssRenderer(setWidth, setHeight, styles.three_box); 
    const holder = document.createElement('div');
    holder.className = styles.three_box;
    document.body.appendChild(holder);
    holder.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(glRenderer.domElement);
  
    const ambientLight = new THREE.AmbientLight(0x555555);
    glScene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 300).normalize();
    glScene.add(directionalLight);
  
    create3dPage(
      1200, 700,
      new THREE.Vector3(-700, -200, 0),
      new THREE.Vector3(0, 0, 0),
      0,
      firstScheme
    );
    create3dGeometry();  
    update();

    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;

    cssRenderer.domElement.addEventListener('click', onClick, true);
  }, [firstScheme]);

  function create3dPage(w, h, position, rotation, number, colors) {  
    if(!planeObject) { 
      planeObject = createPlane(w, h, position, rotation);  
      glScene.add(planeObject);  
    }
    
    if(!cssObject) {
      cssObject = createProjectCssObject(w, h, position, rotation, number, projects, styles.project);  
      cssScene.add(cssObject);
    } else {
      const newPos = cssObject.position;
      cssScene.remove(cssObject);
      cssObject = createProjectCssObject(w, h, newPos, rotation, number, projects, styles.project);  
      cssScene.add(cssObject);
    }
    
    const fontLoader = new THREE.FontLoader();
    if(nameObject) {
      fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        nameObject.geometry = new THREE.TextGeometry(`${projects[number].name}`, {
          font: font,
          size: 1,
          height: 0.5,
          curveSegments: 4,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.05,
          bevelSegments: 3
        });
        nameObject.geometry.center();
      });
      nameObject.material.color.set(colors[2]);
    } else {
      fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const geometry = new THREE.TextGeometry(`${projects[number].name}`, {
          font: font,
          size: 1,
          height: 0.5,
          curveSegments: 4,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.05,
          bevelSegments: 3
        });
        geometry.center();
        const material = new THREE.MeshToonMaterial({
          color: colors[2],
          flatShading: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(100, 100, 100);
        mesh.position.x = -700;
        mesh.position.y = 600;
        mesh.position.z = 0;
        nameObject = mesh;
        glScene.add(mesh);
      });
    }

    const stlLoader = new STLLoader();
    if(logoObject) { 
      stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
        logoObject.material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
        logoObject.geometry = geometry;
      });
    } else {
      stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
        const material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(1000, 600, 0);
        mesh.scale.set(20, 20, 20);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = 'logo';
        logoObject = mesh;
        glScene.add(mesh);
      });
    }
  }

  function create3dGeometry() {  
    const triangleShape = new THREE.Shape()
      .moveTo(0, -100)
      .lineTo(0, 100)
      .lineTo(-120, 0);

    const triangleShape2 = new THREE.Shape()
      .moveTo(0, -100)
      .lineTo(0, 100)
      .lineTo(120, 0);

    const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

    const mesh2 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings),
      createColoredMaterial(firstScheme[5])); 
    mesh2.position.x = -1400;
    mesh2.position.y = 600;
    mesh2.position.z = 0;
    mesh2.userData = 'LAST';
    leftArrowObject = mesh2;
    glScene.add(mesh2);   

    const mesh3 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape2, extrudeSettings),
      createColoredMaterial(firstScheme[5]));  
    mesh3.position.x = 0;
    mesh3.position.y = 600;
    mesh3.position.z = 0;
    mesh3.userData = 'NEXT'; 
    rightArrowObject = mesh3; 
    glScene.add(mesh3);
 
    const gltfLoader = new GLTFLoader();
    const url = 'models/pictureframe_1/scene.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
      root.scale.set(700, 700, 512); 
      root.position.x = -700;
      root.position.y = -200;
      const mesh = new THREE.MeshPhongMaterial({ color: 'blue' });
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
    }
  }

  function newProject() {
    fetchScheme(projects[count].logoColor.slice(1), 'analogic')
      .then(scheme => {
        schemeCopy = scheme;
        create3dPage(
          1200, 700,
          new THREE.Vector3(-700, -200, 0),
          cssObject.rotation,
          count,
          schemeCopy
        );
        leftArrowObject.material.color.set(schemeCopy[5]);
        rightArrowObject.material.color.set(schemeCopy[5]);
      });
  }

  // UPDATE
  function update() {  
    if(logoObject) logoObject.rotation.y += .03;

    if(nextRotate) {
      cssObject.position.x -= 100;
      if(cssObject.position.x < -7000) cssObject.position.x = cssObject.position.x + 14000;
      glScene.children.forEach(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight') return;
        child.position.x -= 100;
        if(child.position.x < -5000) child.visible = false;
        if(child.position.x < 5000 && child.position.x > -5000) child.visible = true;
        if(child.position.x < -7000) { 
          child.position.x = child.position.x + 14000;
          if(changeProject === false) {
            newProject();
            changeProject = true;
          }
        }

      });
      if(glScene.children[3].position.x < -1400 & changeProject === true) {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssObject.position.x = defaultPositions.cssObject.x;
        planeObject.position.x = defaultPositions.planeObject.x;
        frameObject.position.x = defaultPositions.frameObject.x;
        nameObject.position.x = defaultPositions.nameObject.x;
        logoObject.position.x = defaultPositions.logoObject.x;
        leftArrowObject.position.x = defaultPositions.leftArrowObject.x;
        rightArrowObject.position.x = defaultPositions.rightArrowObject.x;
      }
    }

    if(lastRotate) {
      cssObject.position.x += 100;
      if(cssObject.position.x > 7000) cssObject.position.x = cssObject.position.x - 14000;
      glScene.children.forEach(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight') return;
        child.position.x += 100;
        if(child.position.x > 5000) child.visible = false;
        if(child.position.x > -5000 && child.position.x < 5000) child.visible = true;
        if(child.position.x > 7000) { 
          child.position.x = child.position.x - 14000;
          if(changeProject === false) {
            newProject();
            changeProject = true;
          }
        }
      });
      if(glScene.children[6].position.x > 1000 & changeProject === true) {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssObject.position.x = defaultPositions.cssObject.x;
        planeObject.position.x = defaultPositions.planeObject.x;
        frameObject.position.x = defaultPositions.frameObject.x;
        nameObject.position.x = defaultPositions.nameObject.x;
        logoObject.position.x = defaultPositions.logoObject.x;
        leftArrowObject.position.x = defaultPositions.leftArrowObject.x;
        rightArrowObject.position.x = defaultPositions.rightArrowObject.x;
      }
    }

    glRenderer.render(glScene, camera);  
    cssRenderer.render(cssScene, camera);
    requestAnimationFrame(update);
  }

  return (
    <div ref={ref => (ref)} />
  );
};


export default Projects;

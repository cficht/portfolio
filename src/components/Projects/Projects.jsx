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
  let camera, glScene, cssScene, glRenderer, cssRenderer, controls, cssObject, selectedObject, planeObject, frameObject, nameObject, logoObject, imageObject, leftArrowObject, rightArrowObject, upArrowObject, downArrowObject, schemeCopy;
  let count = 0;
  const logoGrid = [10, 10];
  let gridInit = false;
  let nextRotate = false;
  let lastRotate = false;
  let upPicture = false;
  let downPicture = false;
  let changeProject = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  glScene = new THREE.Scene();
  cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const defaultPositions = {
    cssObject: new THREE.Vector3(0, 300, 0),
    planeObject: new THREE.Vector3(0, 300, 0),
    frameObject: new THREE.Vector3(0, 300, 0),
    nameObject: new THREE.Vector3(0, 925, 0),
    imageObject: new THREE.Vector3(0, -600, 0),
    leftArrowObject: new THREE.Vector3(-750, 300, 0), 
    rightArrowObject: new THREE.Vector3(750, 300, 0),
    upArrowObject: new THREE.Vector3(800, -400, 0),
    downArrowObject: new THREE.Vector3(800, -800, 0),
    logoGrid: new THREE.Vector3(-4500, -4500, -1000)
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
    camera.position.set(0, 0, 3150);
  
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
      defaultPositions.cssObject,
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
    cssRenderer.domElement.addEventListener('mousedown' || 'touchstart', onDown, true);
    cssRenderer.domElement.addEventListener('mouseup' || 'touchend', onUp, true);
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
        mesh.position.x = defaultPositions.nameObject.x;
        mesh.position.y = defaultPositions.nameObject.y;
        mesh.position.z = defaultPositions.nameObject.z;
        nameObject = mesh;
        glScene.add(mesh);
      });
    }

    const stlLoader = new STLLoader();
    if(!gridInit) {
      for(let i = 0; i < logoGrid[0]; i++) {
        for(let j = 0; j < logoGrid[1]; j++) {
          stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
            const material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(defaultPositions.logoGrid.x  + (j * 1500), defaultPositions.logoGrid.y + (i * 1500), defaultPositions.logoGrid.z);
            mesh.scale.set(40, 40, 40);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.name = 'logo';
            glScene.add(mesh);
          });
        }
      }
      gridInit = true;
    } else {
      glScene.children.forEach(child => {
        if(child.name === 'logo') {
          stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
            child.material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
            child.geometry = geometry;
          });
        }
      });
    }

    const textureLoader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ color: projects[number].logoColor, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: projects[number].logoColor, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(projects[number].image1), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(projects[number].image2), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ color: projects[number].secondaryColor, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: projects[number].secondaryColor, side: THREE.DoubleSide })
    ];
    if(imageObject) {
      imageObject.material = materials;
    } else {
      const geometry = new THREE.BoxGeometry(1920 * .6, 964 * .6, 964 * .6);
      const boxMesh = new THREE.Mesh(geometry, materials);
      boxMesh.rotation.copy(new THREE.Euler(- 270 * THREE.MathUtils.DEG2RAD, 0, 0));
      boxMesh.position.x = defaultPositions.imageObject.x;
      boxMesh.position.y = defaultPositions.imageObject.y;
      boxMesh.position.z = defaultPositions.imageObject.z;
      const wireGeo = new THREE.EdgesGeometry(boxMesh.geometry);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      wireframe.renderOrder = 2;
      boxMesh.add(wireframe);
      imageObject = boxMesh;
      glScene.add(boxMesh);
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
    mesh2.position.x = defaultPositions.leftArrowObject.x;
    mesh2.position.y = defaultPositions.leftArrowObject.y;
    mesh2.position.z = defaultPositions.leftArrowObject.z;
    mesh2.userData = 'LAST';
    leftArrowObject = mesh2;
    glScene.add(mesh2);   

    const mesh3 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape2, extrudeSettings),
      createColoredMaterial(firstScheme[5]));  
    mesh3.position.x = defaultPositions.rightArrowObject.x;
    mesh3.position.y = defaultPositions.rightArrowObject.y;
    mesh3.position.z = defaultPositions.rightArrowObject.z;
    mesh3.userData = 'NEXT'; 
    rightArrowObject = mesh3; 
    glScene.add(mesh3);

    const mesh4 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape2, extrudeSettings),
      createColoredMaterial(firstScheme[3]));  
    mesh4.rotation.copy(new THREE.Euler(0, 0, - 270 * THREE.MathUtils.DEG2RAD));
    mesh4.position.x = defaultPositions.upArrowObject.x;
    mesh4.position.y = defaultPositions.upArrowObject.y;
    mesh4.position.z = defaultPositions.upArrowObject.z;
    mesh4.userData = 'UP'; 
    upArrowObject = mesh4; 
    glScene.add(mesh4);

    const mesh5 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape2, extrudeSettings),
      createColoredMaterial(firstScheme[3]));  
    mesh5.rotation.copy(new THREE.Euler(0, 0, - 90 * THREE.MathUtils.DEG2RAD));
    mesh5.position.x = defaultPositions.downArrowObject.x;
    mesh5.position.y = defaultPositions.downArrowObject.y;
    mesh5.position.z = defaultPositions.downArrowObject.z;
    mesh5.userData = 'DOWN'; 
    downArrowObject = mesh5; 
    glScene.add(mesh5);
 
    const gltfLoader = new GLTFLoader();
    const url = 'models/pictureframe_1/scene.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
      root.scale.set(700, 700, 512); 
      root.position.x = defaultPositions.frameObject.x;
      root.position.y = defaultPositions.frameObject.y;
      const mesh = new THREE.MeshPhongMaterial({ color: '#b5651d' });
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

  function onDown(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / setWidth) * 2 - 1;
    mouse.y = - (event.clientY / setHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(glScene.children, true); //array
    if(intersects.length > 0) {
      selectedObject = intersects[0];
      if(selectedObject.object.userData === 'UP') {
        downPicture = false;
        upPicture = true; 
      }
      if(selectedObject.object.userData === 'DOWN') {
        upPicture = false;
        downPicture = true; 
      }
    }
  }

  function onUp() {
    upPicture = false;
    downPicture = false;
  }

  function newProject() {
    fetchScheme(projects[count].logoColor.slice(1), 'analogic')
      .then(scheme => {
        schemeCopy = scheme;
        create3dPage(
          1200, 700,
          defaultPositions.cssObject,
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
    if(upPicture) imageObject.rotation.x += .03;
    if(downPicture) imageObject.rotation.x -= .03;
    glScene.children.forEach(child => {
      if(child.name === 'logo') {
        child.rotation.x += .02;
        child.rotation.y += .02;
        child.position.x += 10;
        child.position.y += 10;
        child.position.x > 6000 || child.position.x < -6000 ? child.visible = false : child.visible = true;
        child.position.y > 6000 || child.position.y < -6000 ? child.visible = false : child.visible = true;
        if(child.position.x > 7500) child.position.x = child.position.x - 15000;
        if(child.position.y > 7500) child.position.y = child.position.y - 15000;
      }
    });

    if(nextRotate) {
      cssObject.position.x -= 100;
      if(cssObject.position.x < -7000) cssObject.position.x = cssObject.position.x + 14000;
      glScene.children.forEach(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'logo') return;
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
      if(leftArrowObject.position.x < defaultPositions.leftArrowObject.x & changeProject === true) {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssObject.position.x = defaultPositions.cssObject.x;
        planeObject.position.x = defaultPositions.planeObject.x;
        frameObject.position.x = defaultPositions.frameObject.x;
        nameObject.position.x = defaultPositions.nameObject.x;
        imageObject.position.x = defaultPositions.imageObject.x;
        leftArrowObject.position.x = defaultPositions.leftArrowObject.x;
        rightArrowObject.position.x = defaultPositions.rightArrowObject.x;
        upArrowObject.position.x = defaultPositions.upArrowObject.x;
        downArrowObject.position.x = defaultPositions.downArrowObject.x;
      }
    }

    if(lastRotate) {
      cssObject.position.x += 100;
      if(cssObject.position.x > 7000) cssObject.position.x = cssObject.position.x - 14000;
      glScene.children.forEach(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'logo') return;
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
      if(rightArrowObject.position.x > defaultPositions.rightArrowObject.x & changeProject === true) {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssObject.position.x = defaultPositions.cssObject.x;
        planeObject.position.x = defaultPositions.planeObject.x;
        frameObject.position.x = defaultPositions.frameObject.x;
        nameObject.position.x = defaultPositions.nameObject.x;
        imageObject.position.x = defaultPositions.imageObject.x;
        leftArrowObject.position.x = defaultPositions.leftArrowObject.x;
        rightArrowObject.position.x = defaultPositions.rightArrowObject.x;
        upArrowObject.position.x = defaultPositions.upArrowObject.x;
        downArrowObject.position.x = defaultPositions.downArrowObject.x;
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

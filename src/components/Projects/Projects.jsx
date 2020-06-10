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
  let camera, glScene, cssScene, glRenderer, cssRenderer, controls, cssObject, selectedObject, planeObject, frameObject, nameObject, leftArrowObject, rightArrowObject, gitHubObject, siteObject, schemeCopy;
  let count = 0;
  let slideCount = 0;
  const slideMax = 2;
  const logoGrid = [10, 10];
  let gridInit = false;
  let nextRotate = false;
  let lastRotate = false;
  let changeProject = false;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  glScene = new THREE.Scene();
  cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const defPos = {
    cssObject: new THREE.Vector3(0, 100, 1),
    planeObject: new THREE.Vector3(0, 100, 0),
    frameObject: new THREE.Vector3(0, 100, 0),
    nameObject: new THREE.Vector3(0, 700, 0),
    leftArrowObject: new THREE.Vector3(-100, -550, 0), 
    rightArrowObject: new THREE.Vector3(100, -550, 0),
    gitHubObject: new THREE.Vector3(-450, -550, 0),
    siteObject: new THREE.Vector3(450, -550, 0),
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
      15000);
    camera.position.set(0, 0, 2750);
  
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
      defPos.cssObject,
      new THREE.Vector3(0, 0, 0),
      0,
      firstScheme
    );
    create3dGeometry();  
    update();

    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;

    const floor_url = './images/common_images/floor_tile.jpg';
    const wall_url = './images/common_images/new_wall.png';
    const ceiling_url = './images/common_images/ceiling.png';
    const textureLoader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(wall_url), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(wall_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(ceiling_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(floor_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(wall_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(wall_url), side: THREE.DoubleSide  })
    ];
    const geometry = new THREE.BoxGeometry(10000, 5000, 10000);
    const boxMesh = new THREE.Mesh(geometry, materials);
    boxMesh.position.x = 0;
    boxMesh.position.y = 0;
    boxMesh.position.z = 0;
    boxMesh.name = 'background';
    glScene.add(boxMesh);

    cssRenderer.domElement.addEventListener('click', onClick, true);

  }, [firstScheme]);

  function create3dPage(w, h, position, rotation, number, colors) {  
    if(!planeObject) { 
      planeObject = createPlane(w, h, position, rotation);  
      glScene.add(planeObject);  
    }
    
    if(!cssObject) {
      cssObject = createProjectCssObject(w, h, position, rotation, number, projects, styles.project, slideCount);  
      cssScene.add(cssObject);
    } else {
      const newPos = cssObject.position;
      cssScene.remove(cssObject);
      cssObject = createProjectCssObject(w, h, newPos, rotation, number, projects, styles.project, slideCount);  
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
        mesh.position.x = defPos.nameObject.x;
        mesh.position.y = defPos.nameObject.y;
        mesh.position.z = defPos.nameObject.z;
        nameObject = mesh;
        glScene.add(mesh);
      });
    }

    const stlLoader = new STLLoader();
    // LOGO GRID 
    // if(!gridInit) {
    //   for(let i = 0; i < logoGrid[0]; i++) {
    //     for(let j = 0; j < logoGrid[1]; j++) {
    //       stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
    //         const material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
    //         const mesh = new THREE.Mesh(geometry, material);
    //         geometry.center();
    //         mesh.position.set(defPos.logoGrid.x  + (j * 1500), defPos.logoGrid.y + (i * 1500), defPos.logoGrid.z);
    //         mesh.scale.set(40, 40, 40);
    //         mesh.castShadow = true;
    //         mesh.receiveShadow = true;
    //         mesh.name = 'logo';
    //         glScene.add(mesh);
    //       });
    //     }
    //   }
    //   gridInit = true;
    // } else {
    //   glScene.children.forEach(child => {
    //     if(child.name === 'logo') {
    //       stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
    //         child.material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
    //         geometry.center();
    //         child.geometry = geometry;
    //       });
    //     }
    //   });
    // }

    // GITHUB
    if(!gitHubObject) {
      stlLoader.load('./models/common_models/github_icon.stl', function(geometry) {
        const material = new THREE.MeshPhongMaterial({ color: '#DEDEDE', specular: 0x111111 });
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        mesh.position.set(defPos.gitHubObject.x, defPos.gitHubObject.y, defPos.gitHubObject.z);
        mesh.scale.set(15, 15, 15);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = 'GITHUB';
        gitHubObject = mesh;
        glScene.add(mesh);
      });
    }

    // SITE
    if(!siteObject) {
      stlLoader.load('./models/common_models/internet_icon.stl', function(geometry) {
        const material = new THREE.MeshPhongMaterial({ color: '#DEDEDE', specular: 0x111111 });
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        mesh.position.set(defPos.siteObject.x, defPos.siteObject.y, defPos.siteObject.z);
        mesh.scale.set(15, 15, 15);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = 'SITE';
        siteObject = mesh;
        glScene.add(mesh);
      });
    }
  }

  function create3dGeometry() {  
    const triangleShape = new THREE.Shape()
      .moveTo(0, -100)
      .lineTo(0, 100)
      .lineTo(-120, 0);

    const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

    const mesh2 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings),
      createColoredMaterial(firstScheme[5])); 
    mesh2.position.x = defPos.leftArrowObject.x;
    mesh2.position.y = defPos.leftArrowObject.y;
    mesh2.position.z = defPos.leftArrowObject.z;
    mesh2.userData = 'LAST';
    leftArrowObject = mesh2;
    glScene.add(mesh2);   

    const mesh3 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings),
      createColoredMaterial(firstScheme[5]));  
    mesh3.rotation.copy(new THREE.Euler(0, 0, - 180 * THREE.MathUtils.DEG2RAD));
    mesh3.position.x = defPos.rightArrowObject.x;
    mesh3.position.y = defPos.rightArrowObject.y;
    mesh3.position.z = defPos.rightArrowObject.z;
    mesh3.userData = 'NEXT'; 
    rightArrowObject = mesh3; 
    glScene.add(mesh3);
 
    const gltfLoader = new GLTFLoader();
    const url = 'models/pictureframe_1/scene.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
      root.scale.set(700, 700, 512); 
      root.position.x = defPos.frameObject.x;
      root.position.y = defPos.frameObject.y;
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

      if(selectedObject.object.userData === 'SLIDE') {
        slideCount < slideMax ? slideCount++ : slideCount = 0;
        create3dPage(
          1200, 700,
          defPos.cssObject,
          cssObject.rotation,
          count,
          schemeCopy ? schemeCopy : firstScheme
        );
      }
      if(selectedObject.object.userData === 'GITHUB') window.open(projects[count].github, '_blank');
      if(selectedObject.object.userData === 'SITE') window.open(projects[count].site, '_blank');
    }
  }

  function newProject() {
    slideCount = 0;
    fetchScheme(projects[count].logoColor.slice(1), 'analogic')
      .then(scheme => {
        schemeCopy = scheme;
        create3dPage(
          1200, 700,
          defPos.cssObject,
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
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'logo' || child.name === 'background') return;
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
      glScene.children.forEach(child => {
        if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'logo' || child.name === 'background') return;
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
    <div ref={ref => (ref)} />
  );
};


export default Projects;

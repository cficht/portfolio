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
  let nextSlide = false;
  let changeSlide = false;
  let nextRotate = false;
  let lastRotate = false;
  let changeProject = false;
  let cameraDepth = 2750;
  const setWidth = window.innerWidth;
  const setHeight = window.innerHeight;
  glScene = new THREE.Scene();
  cssScene = new THREE.Scene();
  const OrbitControls = ThreeOrbitControls(THREE);

  const defPos = {
    cssObject: new THREE.Vector3(0, 100, 1),
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

    if(navigator.userAgent.match(/Android/i) 
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) cameraDepth = 4000;
 
    camera = new THREE.PerspectiveCamera(
      45,
      setWidth / setHeight,
      1,
      15000);
    camera.position.set(0, 0, cameraDepth);
  
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
      1200, 800,
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
    controls.maxPolarAngle = 2;
    controls.minPolarAngle = 1;
    controls.minDistance = 700;
    controls.maxDistance = 5000;
    controls.enableKeys = false;
    // controls.enableZoom = false;

    const floor_url = './images/common_images/floor.png';
    const ceiling_url = './images/common_images/ceiling.png';
    const cloudwall_url = './images/common_images/wall_no_clouds.png';
    const textureLoader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cloudwall_url), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cloudwall_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(ceiling_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(floor_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cloudwall_url), side: THREE.DoubleSide  }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(cloudwall_url), side: THREE.DoubleSide  })
    ];
    const geometry = new THREE.BoxGeometry(10000, 5000, 10000);
    const boxMesh = new THREE.Mesh(geometry, materials);
    boxMesh.position.x = 0;
    boxMesh.position.y = 0;
    boxMesh.position.z = 0;
    boxMesh.name = 'background';
    glScene.add(boxMesh);

    const clouds = [
      {
        url: './images/common_images/cloud1.png',
        position: new THREE.Vector3(3000, 750, -2500),
        scale: new THREE.Vector3(326, 152, 1)
      },
      {
        url: './images/common_images/cloud2.png',
        position: new THREE.Vector3(250, 250, -4250),
        scale: new THREE.Vector3(168, 80, 1)
      },
      {
        url: './images/common_images/cloud3.png',
        position: new THREE.Vector3(-3750, 1250, -3000),
        scale: new THREE.Vector3(403, 166, 1)
      },
      {
        url: './images/common_images/cloud4.png',
        position: new THREE.Vector3(5000, -200, -3250),
        scale: new THREE.Vector3(163, 47, 1)
      },
      {
        url: './images/common_images/cloud5.png',
        position: new THREE.Vector3(1500, -400, -4750),
        scale: new THREE.Vector3(47, 21, 1)
      },
      {
        url: './images/common_images/cloud6.png',
        position: new THREE.Vector3(-2000, -200, -4000),
        scale: new THREE.Vector3(121, 52, 1)
      },
      {
        url: './images/common_images/cloud7.png',
        position: new THREE.Vector3(-5000, 100, -4750),
        scale: new THREE.Vector3(55, 22, 1)
      }
    ];

    clouds.forEach(cloud => {
      const cloudTexture = new THREE.TextureLoader().load(cloud.url);
      const cloudMaterial = new THREE.MeshToonMaterial({ map: cloudTexture, alphaTest: 0.4, transparent: true, side: THREE.DoubleSide, });
      const cloudGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
      const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloudMesh.position.set(cloud.position.x, cloud.position.y, cloud.position.z);
      cloudMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
      cloudMesh.scale.set(cloud.scale.x * .25, cloud.scale.y * .25, 1);
      cloudMesh.userData = 'CLOUD';
      glScene.add(cloudMesh);
    });

    cssRenderer.domElement.addEventListener('click', onClick, true);
    window.addEventListener('resize', () => location.reload());
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
      fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
        nameObject.geometry = new THREE.TextGeometry(`${projects[number].name}`, {
          font: font,
          size: 1.5,
          height: 0.3,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.04,
          bevelSegments: 1
        });
        nameObject.geometry.center();
      });
      nameObject.material.color.set(colors[2]);
    } else {
      fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
        const geometry = new THREE.TextGeometry(`${projects[number].name}`, {
          font: font,
          size: 1.5,
          height: 0.3,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.04,
          bevelSegments: 1
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

    // GITHUB
    if(!gitHubObject) {
      stlLoader.load('./models/common_models/github_icon.stl', function(geometry) {
        const material = new THREE.MeshToonMaterial({ color: '#000000', flatShading: true });
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
        const material = new THREE.MeshToonMaterial({ color: '#000000', flatShading: true });
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

      if(selectedObject.object.userData === 'SLIDE') {
        nextSlide = true;
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
          1200, 800,
          defPos.cssObject,
          cssObject.rotation,
          count,
          schemeCopy
        );
        leftArrowObject.material.color.set(schemeCopy[5]);
        rightArrowObject.material.color.set(schemeCopy[5]);
      });
  }

  function newSlide() {
    slideCount < slideMax ? slideCount++ : slideCount = 0;
    create3dPage(
      1200, 700,
      defPos.cssObject,
      cssObject.rotation,
      count,
      schemeCopy ? schemeCopy : firstScheme
    );
  }

  // UPDATE
  function update() { 
    // console.log(window.innerWidth)
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

    glScene.children.forEach(child => {    
      if(child.userData === 'CLOUD') child.position.x += 5;
      if(child.userData === 'CLOUD' && child.position.x > 6000) child.position.x = -6000;
    });

    if(nextRotate) {
      cssObject.position.x -= 100;
      if(cssObject.position.x < -7000) cssObject.position.x = cssObject.position.x + 14000;
      glScene.children.forEach(child => {
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
        // logoObject.position.x = defPos.logoObject.x;
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
        // logoObject.position.x = defPos.logoObject.x;
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

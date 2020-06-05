import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import { CSS3DRenderer, CSS3DObject } from '../../renderers/CSS3DRenderer';
import { GLTFLoader } from '../../loaders/GLTFLoader';
import { projects } from '../../data/projects';
import styles from '../App/App.css';

const Projects = () => {
  let camera, glScene, cssScene, glRenderer, cssRenderer, controls, plane;
  let count = 0;
  let nextRotate = false;
  let lastRotate = false;
  let changeProject = false;
  let projectObject;
  let selectedObject;
  glScene = new THREE.Scene();
  cssScene = new THREE.Scene();

  // {
  //   const bgLoader = new THREE.CubeTextureLoader();
  //   const texture = bgLoader.load([
  //     'space2/pos-x.jpg',
  //     'space2/neg-x.jpg',
  //     'space2/pos-y.jpg',
  //     'space2/neg-y.jpg',
  //     'space2/pos-z.jpg',
  //     'black',
  //   ]);
  //   glScene.background = texture;
  // }

  // initialRotation = cssScene.quaternion;
  const OrbitControls = ThreeOrbitControls(THREE);

  useEffect(() => {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000);
    camera.position.set(0, 100, 1500);
  
    glRenderer = createGlRenderer();
    cssRenderer = createCssRenderer(); 
    document.body.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(glRenderer.domElement);
  
    const ambientLight = new THREE.AmbientLight(0x555555);
    glScene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 300).normalize();
    glScene.add(directionalLight);
  
    create3dPage(
      850, 512,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      0
    );
    create3dGeometry();  
    update();

    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.minDistance = 700;
    controls.maxDistance = 3000;
    controls.maxAzimuthAngle = 1.5;
    controls.minAzimuthAngle = -1.5;
    controls.enableKeys = false;

    cssRenderer.domElement.addEventListener('click', onClick, true);
  }, []);

  function createGlRenderer() {
    var glRenderer = new THREE.WebGLRenderer({ alpha:true });  
    glRenderer.setClearColor(0xECF8FF);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);  
    glRenderer.domElement.style.position = 'absolute';
    glRenderer.domElement.style.zIndex = 1;
    glRenderer.domElement.style.top = 0;  
    return glRenderer;
  }

  function createCssRenderer() {  
    const cssRenderer = new CSS3DRenderer();  
    cssRenderer.setSize(window.innerWidth, window.innerHeight);  
    cssRenderer.domElement.style.position = 'absolute';
    glRenderer.domElement.style.zIndex = 0;
    cssRenderer.domElement.style.top = 0;  
    return cssRenderer;
  }

  function createPlane(w, h, position, rotation) {  
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.0,
      side: THREE.DoubleSide
    });  
    const geometry = new THREE.PlaneGeometry(w, h);  
    const mesh = new THREE.Mesh(geometry, material);  
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;  
    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;
    mesh.rotation.z = rotation.z;  
    return mesh;
  }

  function createCssObject(w, h, position, rotation, number) {  
    const element = document.createElement('div');
    element.style.width = (w - 100) + 'px';
    element.style.height = h + 'px';
    element.style.opacity = 1;
    element.className = styles.project;

    const title = document.createElement('h1');
    title.textContent = projects[number].name;
    element.appendChild(title);

    const stack = document.createElement('h3');
    stack.textContent = projects[number].stack;
    element.appendChild(stack);

    const desc = document.createElement('p');
    desc.textContent = projects[number].description;
    element.appendChild(desc);

    const github = document.createElement('a');
    github.title = 'Github link';
    github.textContent = 'Github';
    github.href = projects[number].github;
    element.appendChild(github);

    const lBreak = document.createElement('br');
    element.appendChild(lBreak);

    const site = document.createElement('a');
    site.title = 'site link';
    site.textContent = 'Site';
    site.href = projects[number].site;
    element.appendChild(site);

    const cssObject = new CSS3DObject(element);
    projectObject = cssObject;

    cssObject.position.x = position.x;
    cssObject.position.y = position.y;
    cssObject.position.z = position.z;

    cssObject.rotation.x = rotation.x;
    cssObject.rotation.y = rotation.y;
    cssObject.rotation.z = rotation.z;

    return cssObject;
  }

  function create3dPage(w, h, position, rotation, number) {  
    if(!plane) { 
      plane = createPlane(
        w, h,
        position,
        rotation);  
      glScene.add(plane);  
    }
    const cssObject = createCssObject(
      w, h,
      position,
      rotation,
      number);  
    cssScene.add(cssObject);
  }

  function createColoredMaterial() { 
    const material = new THREE.MeshBasicMaterial({
      color: Math.floor(Math.random() * 16777215),
      shading: THREE.FlatShading,
      side: THREE.DoubleSide
    }); 
    return material;
  }

  function create3dGeometry() {  
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
      const geometry = new THREE.TextGeometry('Projects', {
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
        color: 'black',
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = 0;
      mesh.position.y = 450;
      mesh.position.z = 0;
      mesh.scale.set(100, 100, 100);
      glScene.add(mesh);
    });

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
      createColoredMaterial()); 
    mesh2.position.x = -600;
    mesh2.position.y = 0;
    mesh2.position.z = 0;
    mesh2.userData = 'LAST';  
    glScene.add(mesh2);  

    const mesh3 = new THREE.Mesh(
      new THREE.ExtrudeBufferGeometry(triangleShape2, extrudeSettings),
      createColoredMaterial());  
    mesh3.position.x = 600;
    mesh3.position.y = 0;
    mesh3.position.z = 0;
    mesh3.userData = 'NEXT';  
    glScene.add(mesh3);
   
    const gltfLoader = new GLTFLoader();
    const url = 'models/pictureframe_1/scene.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
      root.scale.set(512, 512, 512); 
      glScene.add(root);
    });     
  }

  function onClick(event) {
    if(nextRotate || lastRotate) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
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
    cssScene.remove(projectObject);
    create3dPage(
      850, 512,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      count
    );
  }

  // UPDATE
  function update() {  
    if(nextRotate) {
      if(cssScene.quaternion._y >= 0) {
        if(cssScene.quaternion._y >= .99 && changeProject === false) {
          newProject();
          changeProject = true;
        }
        if(glScene.children[6]) glScene.children[6].rotation.y += 0.06;
        glScene.children[2].rotation.y += 0.06;
        cssScene.rotation.y += 0.06;
      } else {
        nextRotate = false;
        lastRotate = false;
        changeProject = false;
        cssScene.rotation.set(0, 0, 0);
      }
    }
    if(lastRotate) {
      if(cssScene.quaternion._y <= 0) {
        if(cssScene.quaternion._y <= -.99 && changeProject === false) {
          newProject();
          changeProject = true;
        }
        if(glScene.children[6]) glScene.children[6].rotation.y -= 0.06;
        glScene.children[2].rotation.y -= 0.06;
        cssScene.rotation.y -= 0.06;
      } else {
        lastRotate = false;
        nextRotate = false;
        changeProject = false;
        cssScene.rotation.set(0, 0, 0);
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

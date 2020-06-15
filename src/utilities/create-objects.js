import * as THREE from 'three';
import { STLLoader } from '../loaders/STLLoader';
import { GLTFLoader } from '../loaders/GLTFLoader';
import { createColoredMaterial } from './create-other';
const textureLoader = new THREE.TextureLoader();
const fontLoader = new THREE.FontLoader();
const stlLoader = new STLLoader();
const gltfLoader = new GLTFLoader();

export function createBackground({ wall, ceiling, floor, width, height, depth }) {
  const materials = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load(wall), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(wall), side: THREE.DoubleSide  }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(ceiling), side: THREE.DoubleSide  }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(floor), side: THREE.DoubleSide  }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(wall), side: THREE.DoubleSide  }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(wall), side: THREE.DoubleSide  })
  ];
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const boxMesh = new THREE.Mesh(geometry, materials);
  boxMesh.position.set(0, 0, 0);
  boxMesh.name = 'background';
  return boxMesh;
}

export function createClouds(clouds) {
  return clouds.map(cloud => {
    const cloudMaterial = new THREE.MeshToonMaterial({ map: textureLoader.load(cloud.url), alphaTest: 0.4, transparent: true, side: THREE.DoubleSide, });
    const cloudGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.scale.set(cloud.scale.x * .25, cloud.scale.y * .25, 1);
    cloudMesh.position.set(cloud.position.x, cloud.position.y, cloud.position.z);
    cloudMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
    cloudMesh.userData = 'CLOUD';
    return cloudMesh;
  });
}

export function createSun(width, height, position) {
  const sun_url = './images/common_images/sun.png';
  const sunMaterial = new THREE.MeshToonMaterial({ map: textureLoader.load(sun_url), alphaTest: 0.4, transparent: true, side: THREE.DoubleSide, });
  const sunGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  sunGeometry.center();
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.scale.set(width * .1, height * .1, 1);
  sunMesh.position.set(position.x, position.y, position.z);
  sunMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
  sunMesh.userData = 'SUN';
  return sunMesh;
}

export function createAirplane(width, height, position) {
  const plane_url = './images/common_images/airplane.png';
  const planeMaterial = new THREE.MeshToonMaterial({ map: textureLoader.load(plane_url), alphaTest: 0.4, transparent: true, side: THREE.DoubleSide, });
  const planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  planeGeometry.center();
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.scale.set(width * .05, height * .05, 1);
  planeMesh.position.set(position.x, position.y, position.z);
  planeMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  planeMesh.userData = 'PLANE';
  return planeMesh;
}

export function createTree(width, height, position) {
  const tree_url = './images/common_images/tree.png';
  const treeMaterial = new THREE.MeshToonMaterial({ map: textureLoader.load(tree_url), alphaTest: 0.4, transparent: true, side: THREE.DoubleSide, });
  const treeGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  treeGeometry.center();
  const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
  treeMesh.scale.set(width * .01, height * .01, 1);
  treeMesh.position.set(position.x, position.y, position.z);
  treeMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  treeMesh.userData = 'TREE';
  return treeMesh;
}

export function create3DText(object, scene, color, position, width, height, depth, textContent, fontName, data) {
  return new Promise((resolve) => {
    if(object) {
      fontLoader.load(`./fonts/${fontName}.typeface.json`, function(font) {
        object.geometry = new THREE.TextGeometry(`${textContent}`, {
          font: font,
          size: 1.5,
          height: 0.3,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.04,
          bevelSegments: 1
        });
        object.geometry.center();
      });
      object.material.color.set(color);
    } else {
      fontLoader.load(`./fonts/${fontName}.typeface.json`, function(font) {
        const geometry = new THREE.TextGeometry(`${textContent}`, {
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
        const material = new THREE.MeshToonMaterial({ color: color, flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(width, height, depth);
        mesh.position.set(position.x, position.y, position.z);
        mesh.userData = data ? data : '';
        scene.add(mesh);
        resolve(mesh);
      });
    }
  });
}


export function createIcon(scene, position, { model, color, width, height, depth, data }) {
  return new Promise((resolve) => { stlLoader.load(model, function(geometry) {
    const material = new THREE.MeshToonMaterial({ color: color, flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);
    geometry.center();
    mesh.scale.set(width, height, depth);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = data;
    scene.add(mesh);
    resolve(mesh);
  });
  });
}

export function createArrow(scene, color, position, rotation, data) {
  const triangleShape = new THREE.Shape()
    .moveTo(0, -100)
    .lineTo(0, 100)
    .lineTo(-120, 0);
  const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  const mesh = new THREE.Mesh(new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings), createColoredMaterial(color)); 
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.copy(rotation);
  mesh.userData = data;
  scene.add(mesh); 
  return mesh;  
}

export function createPictureFrame(scene, size, position, rotation) {
  const url = 'models/pictureframe_1/scene.gltf';
  return new Promise((resolve) => {gltfLoader.load(url, (gltf) => {
    const frame = gltf.scene;
    frame.scale.set(size.x, size.y, size.z);
    frame.position.set(position.x, position.y, position.z);
    frame.rotation.copy(rotation);
    const mesh = new THREE.MeshToonMaterial({ color: '#b5651d', flatShading: true });
    frame.children[0].children[0].children[0].children[0].children[0].material = mesh;
    frame.name = 'picture';
    scene.add(frame);
    resolve(frame);
  }); 
  });
}

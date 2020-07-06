import * as THREE from 'three';
import { STLLoader } from '../loaders/STLLoader';
import { GLTFLoader } from '../loaders/GLTFLoader';
import { createColoredMaterial } from './other';

export const manager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(manager);
const fontLoader = new THREE.FontLoader(manager);
const stlLoader = new STLLoader(manager);
const gltfLoader = new GLTFLoader(manager);

export function createBackground({ wall, ceiling, floor, width, height, depth, position }) {
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
  position ? boxMesh.position.set(position.x, position.y, position.z) : boxMesh.position.set(0, 0, 0);
  boxMesh.name = 'background';
  boxMesh.matrixAutoUpdate = false;
  return boxMesh;
}

export function createWall(width, height, position) {
  const wall_url = './images/common_images/walls/wall_no_clouds.png';
  const wallMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(wall_url), side: THREE.DoubleSide });
  const wallGeometry = new THREE.PlaneBufferGeometry(1, 1, 1);
  wallGeometry.center();
  const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
  wallMesh.scale.set(width * 1, height * 1, 1);
  wallMesh.position.set(position.x, position.y, position.z);
  wallMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
  wallMesh.userData = 'WALL';
  return wallMesh;
}

export function createClouds(clouds, yDiff = 0, zDiff = 0) {
  return clouds.map(cloud => {
    const cloudMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(cloud.url), alphaTest: 0.2, side: THREE.DoubleSide });
    const cloudGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.scale.set(cloud.scale.x * .25, cloud.scale.y * .25, 1);
    cloudMesh.position.set(cloud.position.x, cloud.position.y + yDiff, cloud.position.z + zDiff);
    cloudMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
    cloudMesh.userData = 'CLOUD';
    return cloudMesh;
  });
}

export function createSun(width, height, position, scale) {
  const sun_url = './images/common_images/sun.png';
  const sunMaterial = new THREE.MeshBasicMaterial({ color: '#ffc04c', map: textureLoader.load(sun_url), alphaTest: 0.9, side: THREE.DoubleSide });
  const sunGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  sunGeometry.center();
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.scale.set(width * scale, height * scale, 1);
  sunMesh.position.set(position.x, position.y, position.z);
  sunMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0));
  sunMesh.userData = 'SUN';
  sunMesh.matrixAutoUpdate = false;
  return sunMesh;
}

export function createAirplane(width, height, position, scale) {
  const plane_url = './images/common_images/airplane.png';
  const planeMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(plane_url), alphaTest: 0.9, side: THREE.DoubleSide });
  const planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  planeGeometry.center();
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.scale.set(width * scale, height * scale, 1);
  planeMesh.position.set(position.x, position.y, position.z);
  planeMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  planeMesh.userData = 'PLANE';
  planeMesh.matrixAutoUpdate = false;
  return planeMesh;
}

export function createTree(width, height, position, scale, flip) {
  const tree_url = './images/common_images/tree.png';
  const treeMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(tree_url), alphaTest: 0.9, side: THREE.DoubleSide });
  const treeGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  treeGeometry.center();
  const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
  treeMesh.scale.set(width * scale, height * scale, 1);
  treeMesh.position.set(position.x, position.y, position.z);
  flip ? treeMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0)) : treeMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  treeMesh.userData = 'TREE';
  treeMesh.matrixAutoUpdate = false;
  return treeMesh;
}

export function createRock(width, height, position, scale, rockNumber, flip) {
  const rocks = [
    './images/common_images/rocks/rock.png',
    './images/common_images/rocks/rock2.png',
    './images/common_images/rocks/rock3.png',
    './images/common_images/rocks/rock4.png'
  ];
  const rockMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(rocks[rockNumber]), alphaTest: 0.9, side: THREE.DoubleSide });
  const rockGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  rockGeometry.center();
  const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
  rockMesh.scale.set(width * scale, height * scale, 1);
  rockMesh.position.set(position.x, position.y, position.z);
  flip ? rockMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0)) : rockMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  rockMesh.userData = 'ROCK';
  return rockMesh;
}

// ???
export function createGrass(width, height, position, scale, type) {
  let grass_url;
  type === 'tall' ? grass_url = './images/common_images/grass/grass_tall.png' : grass_url = './images/common_images/grass/grass.png';
  const grassMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(grass_url), alphaTest: 0.9, side: THREE.DoubleSide });
  const grassGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  grassGeometry.center();
  const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
  grassMesh.scale.set(width * scale, height * scale, 1);
  grassMesh.position.set(position.x, position.y, position.z);
  grassMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  grassMesh.userData = 'GRASS';
  return grassMesh;
}

export function createTreeTop(width, height, position, scale, flip) {
  const tree_url = './images/common_images/treetop.png';
  const treeMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(tree_url), alphaTest: 0.9, side: THREE.DoubleSide });
  const treeGeometry = new THREE.PlaneBufferGeometry(20, 20, 20);
  treeGeometry.center();
  const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
  treeMesh.scale.set(width * scale, height * scale, 1);
  treeMesh.position.set(position.x, position.y, position.z);
  flip ? treeMesh.rotation.copy(new THREE.Euler(0, - 180 * THREE.MathUtils.DEG2RAD, 0)) : treeMesh.rotation.copy(new THREE.Euler(0, 0, 0));
  treeMesh.userData = 'TREETOP';
  treeMesh.matrixAutoUpdate = false;
  return treeMesh;
}

export function create3DText(color, position, width, height, depth, textContent, fontName, data) {
  return new Promise((resolve) => {
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
      resolve(mesh);
    });
  });
}

export function createIcon(position, { model, color, width, height, depth, data }, clickSphere, clickScale = 12.5, clickPos = -7.5) {
  return new Promise((resolve) => { stlLoader.load(model, function(geometry) {
    const material = new THREE.MeshBasicMaterial({ color: color, flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);
    geometry.center();
    mesh.scale.set(width, height, depth);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    data ? mesh.userData = data : mesh.userData = '';
    if(clickSphere) {
      const clickGeo = new THREE.CylinderGeometry(clickScale, clickScale, clickScale * 2.15, clickScale);
      const clickMat = new THREE.MeshBasicMaterial({ wireframe: true, alphaTest: 0.9, opacity: 0 });
      const clickSphere = new THREE.Mesh(clickGeo, clickMat);
      data ? clickSphere.userData = data : clickSphere.userData = '';
      clickSphere.position.y = clickPos;
      mesh.add(clickSphere);
    }
    resolve(mesh);
  });
  });
}

export function createArrow(color, position, rotation, data, scale, clickSphere, clickScale = 1) {
  const triangleShape = new THREE.Shape()
    .moveTo(0, -100)
    .lineTo(0, 100)
    .lineTo(-120, 0);
  const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  const mesh = new THREE.Mesh(new THREE.ExtrudeBufferGeometry(triangleShape, extrudeSettings), createColoredMaterial(color)); 
  if(scale) mesh.scale.set(scale, scale, scale);
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.copy(rotation);
  mesh.userData = data;
  if(clickSphere) {
    const clickGeo = new THREE.BoxGeometry(200 * clickScale, 250 * clickScale, 0);
    const clickMat = new THREE.MeshBasicMaterial({ wireframe: true, alphaTest: 0.9, opacity: 0 });
    const clickSphere = new THREE.Mesh(clickGeo, clickMat);
    data ? clickSphere.userData = data : clickSphere.userData = '';
    clickSphere.position.x = -65;
    mesh.add(clickSphere);
  }
  return mesh;  
}

export function createPictureFrame(size, position, rotation) {
  const url = 'models/pictureframe_1/scene.gltf';
  return new Promise((resolve) => {gltfLoader.load(url, (gltf) => {
    const frame = gltf.scene;
    frame.scale.set(size.x, size.y, size.z);
    frame.position.set(position.x, position.y, position.z);
    frame.rotation.copy(rotation);
    const mesh = new THREE.MeshToonMaterial({ color: '#b5651d', flatShading: true });
    frame.children[0].children[0].children[0].children[0].children[0].material = mesh;
    frame.name = 'picture';
    frame.userData = 'PICTURE';
    resolve(frame);
  }); 
  });
}

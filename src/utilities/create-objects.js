import * as THREE from 'three';
const textureLoader = new THREE.TextureLoader();
const fontLoader = new THREE.FontLoader();

export function createBackground(wall, ceiling, floor, width, height, depth) {
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

export function create3DText(object, scene, color, position, width, height, depth, textContent) {
  return new Promise((resolve) => {
    if(object) {
      fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
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
      fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
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
        object = mesh;
        scene.add(mesh);
        resolve(object);
      });
    }
  });
}

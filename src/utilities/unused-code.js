
// BACKGROUND CUBE
// const bgLoader = new THREE.CubeTextureLoader();
// const texture = bgLoader.load([
//   `http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`,
//   `http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`,
//   `http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[1].slice(1)}`,
//   `http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[1].slice(1)}`,
//   `http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`,
//   `http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`,
// ]);
// glScene.background = texture;

// CAMERA CONTROL
// controls.minDistance = 700;
// controls.maxDistance = 2000;
// controls.enableKeys = false;
// controls.enableZoom = false;

// MORE BACKGROUND CODE
// const textureLoader = new THREE.TextureLoader();
// const materials = [
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(`http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`), side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(`http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`), side: THREE.DoubleSide  }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(`http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[1].slice(1)}`), side: THREE.DoubleSide  }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(`http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[1].slice(1)}`), side: THREE.DoubleSide  }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(`http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`), side: THREE.DoubleSide  }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(`http://www.thecolorapi.com/id?format=svg&named=false&hex=${firstScheme[3].slice(1)}`), side: THREE.DoubleSide  })
// ];
// const geometry = new THREE.BoxGeometry(10000, 5000, 10000);
// const boxMesh = new THREE.Mesh(geometry, materials);
// boxMesh.position.x = 0;
// boxMesh.position.y = 0;
// boxMesh.position.z = 0;
// glScene.add(boxMesh);

// OLD ROTATE
// if(nextRotate) {
//   if(cssScene.children[0].quaternion._y >= 0) {
//     if(cssScene.children[0].quaternion._y >= .99 && changeProject === false) {
//       newProject();
//       changeProject = true;
//     }
//     if(frameObject) frameObject.rotation.y += 0.06;
//     planeObject.rotation.y += 0.06;
//     cssScene.children[0].rotation.y += 0.06;
//   } else {
//     nextRotate = false;
//     lastRotate = false;
//     changeProject = false;
//     cssScene.children[0].rotation.set(0, 0, 0);
//   }
// }

// if(lastRotate) {
//   if(cssScene.children[0].quaternion._y <= 0) {
//     if(cssScene.children[0].quaternion._y <= -.99 && changeProject === false) {
//       newProject();
//       changeProject = true;
//     }
//     if(frameObject) frameObject.rotation.y -= 0.06;
//     planeObject.rotation.y -= 0.06;
//     cssScene.children[0].rotation.y -= 0.06;
//   } else {
//     lastRotate = false;
//     nextRotate = false;
//     changeProject = false;
//     cssScene.children[0].rotation.set(0, 0, 0);
//   }

// OLD LOGO
// if(logoObject) { 
//   stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
//     logoObject.material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
//     logoObject.geometry = geometry;
//   });
// } else {
//   stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
//     const material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111, shininess: 200 });
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.position.set(defaultPositions.logoObject.x, defaultPositions.logoObject.y, defaultPositions.logoObject.z);
//     mesh.scale.set(20, 20, 20);
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//     mesh.name = 'logo';
//     logoObject = mesh;
//     glScene.add(mesh);
//   });
// }

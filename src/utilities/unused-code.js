
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



// OLD IMAGE ROTATOR
// const textureLoader = new THREE.TextureLoader();
// const materials = [
//   new THREE.MeshBasicMaterial({ color: projects[number].logoColor, side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ color: projects[number].logoColor, side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(projects[number].image1), side: THREE.DoubleSide  }),
//   new THREE.MeshBasicMaterial({ map: textureLoader.load(projects[number].image2), side: THREE.DoubleSide  }),
//   new THREE.MeshBasicMaterial({ color: projects[number].secondaryColor, side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ color: projects[number].secondaryColor, side: THREE.DoubleSide })
// ];
// if(imageObject) {
//   imageObject.material = materials;
// } else {
//   const geometry = new THREE.BoxGeometry(1920 * .6, 964 * .6, 964 * .6);
//   const boxMesh = new THREE.Mesh(geometry, materials);
//   boxMesh.rotation.copy(new THREE.Euler(- 270 * THREE.MathUtils.DEG2RAD, 0, 0));
//   boxMesh.position.x = defPos.imageObject.x;
//   boxMesh.position.y = defPos.imageObject.y;
//   boxMesh.position.z = defPos.imageObject.z;
//   boxMesh.userData = 'IMAGEBOX';
//   const wireGeo = new THREE.EdgesGeometry(boxMesh.geometry);
//   const wireMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
//   const wireframe = new THREE.LineSegments(wireGeo, wireMat);
//   wireframe.renderOrder = 2;
//   boxMesh.add(wireframe);
//   imageObject = boxMesh;
//   picRotX = imageObject.quaternion._x;
//   glScene.add(boxMesh);
// }

// if(selectedObject.object.userData === 'IMAGEBOX' && !picRotate) {
//   picRotate = true; 
//   picRotX = picRotX * -1;
// }

// if(picRotate && (imageObject.quaternion._x < picRotX && picRotX > 0)) imageObject.rotation.x -= .03;
// else if(picRotate && (imageObject.quaternion._x > picRotX && picRotX < 0)) imageObject.rotation.x += .03;
// else { 
//   picRotate = false;
//   imageObject.quaternion._x = picRotX;
// }



// HOVER
// cssRenderer.domElement.addEventListener('mousemove', onHover, true);

// function onHover(event) {
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   mouse.x = (event.clientX / setWidth) * 2 - 1;
//   mouse.y = - (event.clientY / setHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(glScene.children, true); //array
//   if(intersects.length > 0) {
//     selectedObject = intersects[0];
//     if(selectedObject.object.userData === 'GITHUB') gitHubObject.material.color.set('#FFFFFF');
//     if(selectedObject.object.userData === 'SITE') siteObject.material.color.set('#FFFFFF');
//   }
//   else {
//     gitHubObject.material.color.set('black');
//     siteObject.material.color.set('#000000');
//   }
// }

// SINGLE LOGO
//LOGO
// if(logoObject) { 
//   stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
//     logoObject.material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111 });
//     logoObject.geometry = geometry;
//   });
// } else {
//   stlLoader.load(`./models/project_logo_models/${projects[number].logoModel}`, function(geometry) {
//     const material = new THREE.MeshPhongMaterial({ color: `${projects[number].logoColor}`, specular: 0x111111 });
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.geometry.center();
//     mesh.position.set(defPos.logoObject.x, defPos.logoObject.y, defPos.logoObject.z);
//     mesh.scale.set(20, 20, 20);
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//     mesh.name = 'logo';
//     logoObject = mesh;
//     glScene.add(mesh);
//   });
// }


// LOGO GRID
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

// const logoGrid = [10, 10];
// let gridInit = false;

// glScene.children.forEach(child => {
//   if(child.name === 'logo') {
//     child.rotation.x += .02;
//     child.rotation.y += .02;
//     child.position.x += 10;
//     child.position.y += 10;
//     child.position.x > 6000 || child.position.x < -6000 ? child.visible = false : child.visible = true;
//     child.position.y > 6000 || child.position.y < -6000 ? child.visible = false : child.visible = true;
//     if(child.position.x > 7500) child.position.x = child.position.x - 15000;
//     if(child.position.y > 7500) child.position.y = child.position.y - 15000;
//   }
// });

// GRASS
// const grassHillTexture = new THREE.TextureLoader().load('./images/common_images/grass_and_hills.png');
// const grassHillMaterial = new THREE.MeshPhongMaterial({ map: grassHillTexture, alphaTest: 0.5, side: THREE.DoubleSide });
// var grassHillGeometry = new THREE.PlaneBufferGeometry(10, 10, 10);
// var grassHill = new THREE.Mesh(grassHillGeometry, grassHillMaterial);
// grassHill.position.x = 0;
// grassHill.position.y = -2000;
// grassHill.position.z = -3500;
// grassHill.scale.set(1662 * .6, 140 * .6, 1);
// glScene.add(grassHill);

// GIT AND SITE MATERIAL
// const material = new THREE.MeshPhongMaterial({ color: '#DEDEDE', specular: 0x111111 });

// RANDOM COLOR
// useEffect(() => {
//   //analogic, complement, analogic-complement
//   fetchScheme(projects[projectCount].logoColor.slice(1), 'analogic')
//     .then(scheme => setFirstScheme(scheme));
// }, []);

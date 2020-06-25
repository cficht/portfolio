import * as THREE from 'three';

export function createColoredMaterial(fromScheme) { 
  const material = new THREE.MeshBasicMaterial({
    color: fromScheme,
    flatShading: THREE.FlatShading,
    side: THREE.DoubleSide
  }); 
  return material;
}

export function projectChange(nextLast, data, cssObject, glScene, changeProject, newProject) {
  cssObject.position.x += (100 * nextLast);
  if((cssObject.position.x * nextLast) >= 7000) cssObject.position.x = cssObject.position.x - (14000 * nextLast);
  glScene.children.map(child => {
    if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'background' || child.userData === 'CLOUD' || child.userData === 'ROCK' || child.userData === 'GRASS' || child.userData === 'PROJECTS') return;
    if(child.userData === 'NEXT' || child.userData === 'LAST' || child.userData === 'GITHUB' || child.userData === 'SITE') {
      if(!changeProject) child.position.y -= 100;
      if(changeProject && child.position.y < -2100) child.position.y += 100;
      return;
    }
    child.position.x += (100 * nextLast); 
    if((child.position.x * nextLast) > 5000) child.visible = false;
    if((child.position.x * nextLast) > -5000 && (child.position.x * nextLast) < 5000) child.visible = true;
    if((child.position.x * nextLast) >= 7000) { 
      child.position.x = child.position.x - (14000 * nextLast);
      if(changeProject === false && child.userData === data) {
        newProject('Project');
        return changeProject = true;
      }
    }
  });
  return changeProject;
}

export function randomLogo(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function moveView(viewObject, targetObject) {
  let objectType;
  if(viewObject.type === 'PerspectiveCamera') objectType = viewObject.position;
  else objectType = viewObject.target;
  if(objectType.z > targetObject.position.z) objectType.z -= 25;
  if(objectType.y > targetObject.position.y) objectType.y -= 15;
  if(objectType.y < targetObject.position.y) objectType.y += 15;
  if(objectType.x > targetObject.position.x) objectType.x -= 25;
  if(objectType.x < targetObject.position.x) objectType.x += 25;
}

export function mobileDetect(desktopDepth, mobileDepth) {
  if(navigator.userAgent.match(/Android/i) 
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)) return mobileDepth;
  else return desktopDepth;
}

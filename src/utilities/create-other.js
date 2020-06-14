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
    if(child.type === 'DirectionalLight' || child.type === 'AmbientLight' || child.name === 'background' || child.userData === 'CLOUD') return;
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

import * as THREE from 'three';

export function createColoredMaterial(fromScheme) { 
  const material = new THREE.MeshBasicMaterial({
    color: fromScheme,
    shading: THREE.FlatShading,
    side: THREE.DoubleSide
  }); 
  return material;
}

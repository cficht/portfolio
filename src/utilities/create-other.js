import * as THREE from 'three';

export function createColoredMaterial(fromScheme) { 
  const material = new THREE.MeshBasicMaterial({
    color: fromScheme,
    flatShading: THREE.FlatShading,
    side: THREE.DoubleSide
  }); 
  return material;
}

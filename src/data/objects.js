import * as THREE from 'three';

export const clouds = [
  {
    url: './images/common_images/cloud1.png',
    position: new THREE.Vector3(3000, 750, -2500),
    scale: new THREE.Vector3(326, 152, 1)
  },
  {
    url: './images/common_images/cloud2.png',
    position: new THREE.Vector3(250, 250, -4250),
    scale: new THREE.Vector3(168, 80, 1)
  },
  {
    url: './images/common_images/cloud3.png',
    position: new THREE.Vector3(-3750, 1250, -3000),
    scale: new THREE.Vector3(403, 166, 1)
  },
  {
    url: './images/common_images/cloud4.png',
    position: new THREE.Vector3(5000, -200, -3250),
    scale: new THREE.Vector3(163, 47, 1)
  },
  {
    url: './images/common_images/cloud5.png',
    position: new THREE.Vector3(1500, -400, -4750),
    scale: new THREE.Vector3(47, 21, 1)
  },
  {
    url: './images/common_images/cloud6.png',
    position: new THREE.Vector3(-2000, -200, -4000),
    scale: new THREE.Vector3(121, 52, 1)
  },
  {
    url: './images/common_images/cloud7.png',
    position: new THREE.Vector3(-5000, 100, -4750),
    scale: new THREE.Vector3(55, 22, 1)
  }
];

export const field = {
  floor: './images/common_images/floor.png',
  ceiling: './images/common_images/ceiling.png',
  wall: './images/common_images/wall_no_clouds.png'
};

import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from '../renderers/CSS3DRenderer';

export function createGlRenderer(width, height, style) {
  const glRenderer = new THREE.WebGLRenderer({ alpha:true });  
  glRenderer.setClearColor();
  glRenderer.setPixelRatio(window.devicePixelRatio);
  glRenderer.setSize(width, height);  
  glRenderer.domElement.style.position = 'absolute';
  glRenderer.domElement.style.zIndex = 1;
  glRenderer.domElement.style.top = 0; 
  glRenderer.domElement.className = style; 
  return glRenderer;
}

export function createCssRenderer(width, height, style) {  
  const cssRenderer = new CSS3DRenderer();  
  cssRenderer.setSize(width, height);  
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.zIndex = 0;
  cssRenderer.domElement.style.top = 0;  
  cssRenderer.domElement.className = style;
  return cssRenderer;
}

export function createPlane(w, h, position, rotation) {  
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.0,
    side: THREE.DoubleSide
  });  
  const geometry = new THREE.PlaneGeometry(w, h);  
  const mesh = new THREE.Mesh(geometry, material);  
  mesh.userData = 'SLIDE';
  mesh.position.x = position.x;
  mesh.position.y = position.y;
  mesh.position.z = 0;  
  mesh.rotation.x = rotation.x;
  mesh.rotation.y = rotation.y;
  mesh.rotation.z = rotation.z;  
  return mesh;
}

export function createProjectCssObject(w, h, position, rotation, number, projects, style, slideCount) {  
  const element = document.createElement('div');
  element.style.width = w + 'px';
  element.style.height = h + 'px';
  element.style.opacity = 1;
  element.className = style;

  if(slideCount === 0) {
    const stack = document.createElement('h3');
    stack.textContent = projects[number].stack;
    element.appendChild(stack);
  
    const desc = document.createElement('p');
    desc.textContent = projects[number].description;
    element.appendChild(desc);
  }
  if(slideCount === 1) {
    const img1 = document.createElement('img');
    img1.src = projects[number].image1;
    element.appendChild(img1);
  }
  if(slideCount === 2) {
    const img2 = document.createElement('img');
    img2.src = projects[number].image2;
    element.appendChild(img2);
  }

  const cssObject = new CSS3DObject(element);

  cssObject.position.x = position.x;
  cssObject.position.y = position.y;
  cssObject.position.z = position.z;

  cssObject.rotation.x = rotation.x;
  cssObject.rotation.y = rotation.y;
  cssObject.rotation.z = rotation.z;

  return cssObject;
}

export function createColoredMaterial(fromScheme) { 
  const material = new THREE.MeshBasicMaterial({
    color: fromScheme,
    shading: THREE.FlatShading,
    side: THREE.DoubleSide
  }); 
  return material;
}

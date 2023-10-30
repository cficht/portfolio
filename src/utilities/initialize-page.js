import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from '../renderers/CSS3DRenderer';

export function createGlRenderer(width, height, style) {
  const glRenderer = new THREE.WebGLRenderer({ alpha:true, powerPreference: 'high-performance' });
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
  cssRenderer.domElement.style.backgroundColor = 'black';
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.zIndex = 0;
  cssRenderer.domElement.style.top = 0;  
  cssRenderer.domElement.className = style;
  return cssRenderer;
}

export function createPlane(width, height, position, rotation) {  
  const material = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.0, side: THREE.DoubleSide });  
  const geometry = new THREE.PlaneGeometry(width, height);  
  const mesh = new THREE.Mesh(geometry, material);  
  mesh.userData = 'SLIDE';
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  return mesh;
}

export function createProjectCssObject(width, height, position, rotation, number, projects, style, slideCount) {  
  const element = document.createElement('div');
  element.style.width = width + 'px';
  element.style.height = height + 'px';
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

  cssObject.position.set(position.x, position.y, position.z);
  cssObject.rotation.set(rotation.x, rotation.y, rotation.z);

  return cssObject;
}

export function updateProjectCssObject(width, height, number, projects, style, slideCount) {  
  const element = document.createElement('div');
  element.style.width = width + 'px';
  element.style.height = height + 'px';
  element.style.opacity = 1;
  element.style.position = 'absolute';
  element.style.pointerEvents = 'auto';
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
  return element;
}

export function createAboutCSSObject(width, height, position, rotation, content, style) {  
  const element = document.createElement('div');
  element.style.width = width + 'px';
  element.style.height = height + 'px';
  element.style.opacity = 1;
  element.className = style;
  
  const paragraph = document.createElement('p');
  paragraph.textContent = content;
  element.appendChild(paragraph);
  
  const cssObject = new CSS3DObject(element);

  cssObject.position.set(position.x, position.y, position.z);
  cssObject.rotation.set(rotation.x, rotation.y, rotation.z);

  return cssObject;
}

export function createBlankCSSObject(width, height, position, rotation, style) {  
  const element = document.createElement('div');
  element.style.width = width + 'px';
  element.style.height = height + 'px';
  element.style.opacity = 1;
  element.className = style;
  
  const cssObject = new CSS3DObject(element);

  cssObject.position.set(position.x, position.y, position.z);
  cssObject.rotation.set(rotation.x, rotation.y, rotation.z);

  return cssObject;
}

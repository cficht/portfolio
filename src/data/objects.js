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
  wall: './images/common_images/wall_no_clouds.png',
  width: 10000,
  height: 5000,
  depth: 10000
};

export const projectField = {
  floor: './images/common_images/floor.png',
  ceiling: './images/common_images/ceiling_projects.png',
  wall: './images/common_images/wall_projects.png',
  width: 10000,
  height: 5000,
  depth: 10000
};

export const github = {
  model: './models/common_models/github_icon.stl',
  color: '#000000',
  width: '12',
  height: '12',
  depth: '15',
  data: 'GITHUB'
};

export const site = {
  model: './models/common_models/internet_icon.stl',
  color: '#000000',
  width: '12',
  height: '12',
  depth: '15',
  data: 'SITE'
};

export const project = {
  model: './models/common_models/projects_icon.stl',
  color: '#000000',
  width: '15',
  height: '15',
  depth: '15',
  data: 'PROJECTS'
};

export const tech = {
  model: './models/common_models/tech_icon.stl',
  color: '#000000',
  width: '15',
  height: '15',
  depth: '15',
  data: 'TECH'
};

export const contact = {
  model: './models/common_models/contact_icon.stl',
  color: '#000000',
  width: '15',
  height: '15',
  depth: '15',
  data: 'CONTACT'
};

export const about = {
  model: './models/common_models/about_icon.stl',
  color: '#000000',
  width: '15',
  height: '15',
  depth: '15',
  data: 'ABOUT'
};


export const projectLogos = [
  {
    model: './models/project_logo_models/secretmenu_logo.stl',
    color: '#FD7553',
    width: '15',
    height: '15',
    depth: '15',
    data: '/projects'
  },
  {
    model: './models/project_logo_models/nintendoapi_logo.stl',
    color: '#ED1C24',
    width: '15',
    height: '15',
    depth: '15',
    data: '/projects'
  },
  {
    model: './models/project_logo_models/freshtrack_logo.stl',
    color: '#205757',
    width: '15',
    height: '15',
    depth: '15',
    data: '/projects'
  },
  {
    model: './models/project_logo_models/mosaic_logo.stl',
    color: '#C144F3',
    width: '15',
    height: '15',
    depth: '15',
    data: '/projects'
  },
  {
    model: './models/project_logo_models/chrystalsynth_logo.stl',
    color: '#E80415',
    width: '15',
    height: '15',
    depth: '15',
    data: '/projects'
  },
  {
    model: './models/project_logo_models/unimic_logo.stl',
    color: '#FFFF4C',
    width: '15',
    height: '15',
    depth: '15',
    data: '/projects'
  }
];

export const techLogos = [
  {
    model: './models/tech_logo_models/cheerio_logo.stl',
    color: '#BC9A65',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Cheerio',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/csharp_logo.stl',
    color: '#641F77',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'C#',
    type: 'Languages'
  },
  {
    model: './models/tech_logo_models/css_logo.stl',
    color: '#254ADF',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'CSS',
    type: 'Languages'
  },
  {
    model: './models/tech_logo_models/express_logo.stl',
    color: '#868686',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Express',
    type: 'Environments & Frameworks'
  },
  {
    model: './models/tech_logo_models/html5_logo.stl',
    color: '#DF4B24',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'HTML5',
    type: 'Languages'
  },
  {
    model: './models/tech_logo_models/javascript_logo.stl',
    color: '#EAD64D',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'JavaScript',
    type: 'Languages'
  },
  {
    model: './models/tech_logo_models/max7_logo.stl',
    color: '#53565D',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Max/MSP',
    type: 'Languages'
  },
  {
    model: './models/tech_logo_models/mongodb_logo.stl',
    color: '#429643',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'MongoDB',
    type: 'Databases'
  },
  {
    model: './models/tech_logo_models/node_logo.stl',
    color: '#8CC03C',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Node',
    type: 'Environments & Frameworks'
  },
  {
    model: './models/tech_logo_models/postgresql_logo.stl',
    color: '#31638C',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'PostgreSQL',
    type: 'Databases'
  },
  {
    model: './models/tech_logo_models/react_logo.stl',
    color: '#5FD5F5',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'React',
    type: 'Environments & Frameworks'
  },
  {
    model: './models/tech_logo_models/redux_logo.stl',
    color: '#7D41C8',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Redux',
    type: 'Environments & Frameworks'
  },
  {
    model: './models/tech_logo_models/unity_logo.stl',
    color: '#000000',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Unity',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/heroku_logo.stl',
    color: '#8B6FBE',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Heroku',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/jest_logo.stl',
    color: '#C63D15',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Jest',
    type: 'Testing Suites'
  },
  {
    model: './models/tech_logo_models/materialui_logo.stl',
    color: '#F9F9F9',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Material-UI',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/netlify_logo.stl',
    color: '#32AEB5',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Netlify',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/postman_logo.stl',
    color: '#EB5823',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Postman',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/protools_logo.stl',
    color: '#7927ED',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Pro Tools',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/qunit_logo.stl',
    color: '#9E2F97',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Q-Unit',
    type: 'Testing Suites'
  },
  {
    model: './models/tech_logo_models/threejs_logo.stl',
    color: '#3FB280',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Three.js',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/travis_logo.stl',
    color: '#C6334A',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'Travis',
    type: 'Tools'
  },
  {
    model: './models/tech_logo_models/vscode_logo.stl',
    color: '#22A3EC',
    width: '15',
    height: '15',
    depth: '15',
    data: '/tech',
    name: 'VS Code',
    type: 'Tools'
  }
];

export const contactIcons = [
  {
    model: './models/common_models/email_icon.stl',
    color: '#000000',
    width: '15',
    height: '15',
    depth: '15',
    data: '/contact'
  },
  {
    model: './models/common_models/github_icon.stl',
    color: '#000000',
    width: '15',
    height: '15',
    depth: '15',
    data: '/contact'
  },
  {
    model: './models/common_models/linkedin_logo.stl',
    color: '#000000',
    width: '15',
    height: '15',
    depth: '15',
    data: '/contact'
  }
];

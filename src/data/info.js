export const projects = [
  {
    color: 'chocolate',
    name: 'Family Calendar',
    stack: 'React, Redux, Next.js, Amplify, Cognito, GraphQL, DynamoDB',
    description:
      'Application to help families manage their day-to-day lives. I used the Next.js and Amplify frameworks to build a calendar that a user can customize with specific events for each member of their family. GraphQL, DynamoDB, and Redux were used to manage user data and authentication was implemented using Cognito.',
    github: 'https://github.com/cficht/family-calendar',
    site: 'https://tinyurl.com/family-calendar',
    logoModel: 'secretmenu_logo.stl',
    logoColor: '#30A1B8',
    secondaryColor: '#77D7DB',
    image1: 'images/project_images/familycalendar_1.png',
    image2: 'images/project_images/familycalendar_2.png',
  },
  {
    color: 'chocolate',
    name: 'Secret Menu',
    stack: 'JavaScript, React, Redux, Node.js, Express.js, MongoDB',
    description:
      'Full-stack food-ordering application for businesses and customers that gives restaurant owners the ability to create polls for determining future offerings. I was responsible for front-end logic, incorporating third-party libraries, and building a state management system with Redux.',
    github: 'https://github.com/Secret-Menu',
    site: 'https://secretmenu.netlify.app',
    logoModel: 'secretmenu_logo.stl',
    logoColor: '#FD7553',
    secondaryColor: '#9BDAFD',
    image1: 'images/project_images/secretmenu_1.png',
    image2: 'images/project_images/secretmenu_2.png',
  },
  {
    color: 'chocolate',
    name: 'The Nintendo API',
    stack: 'JavaScript, Node.js, Express.js, MongoDB, Cheerio',
    description:
      'API that provides character and game information for Nintendo franchises. I utilized Cheerio to extract information from various online resources and used it as seed data on my own server. I then utilized MongoDB\'s Aggregation Pipeline to create endpoints that can be used to retrieve specific information.',
    github: 'https://github.com/cficht/nintendo-api',
    site: 'https://the-nintendo-api.herokuapp.com',
    logoModel: 'nintendoapi_logo.stl',
    logoColor: '#ED1C24',
    secondaryColor: '#09469E',
    image1: 'images/project_images/nintendoapi_1.png',
    image2: 'images/project_images/nintendoapi_2.png',
  },
  {
    color: 'chocolate',
    name: 'fresh-track',
    stack: 'JavaScript, React, Node.js, Express.js, MongoDB',
    description:
      'File repository that provides users the ability to share and listen to music stored on various hosting services in one place. I implemented Oauth 2.0, created back end models and routes, and used endpoints to display user data in React components.',
    github: 'https://github.com/fresh-track',
    site: 'https://fresh-track.netlify.com',
    logoModel: 'freshtrack_logo.stl',
    logoColor: '#205757',
    secondaryColor: '#31215F',
    image1: 'images/project_images/freshtrack_1.png',
    image2: 'images/project_images/freshtrack_2.png',
  },
  {
    color: 'chocolate',
    name: 'Mosaic',
    stack: 'JavaScript, React, Node.js, Express.js, PostgreSQL',
    description:
      'Full-stack application that allows users to create mosaic illustrations using randomized color schemes generated by The Color API. I created the back-end SQL database, designed a method to save and load user illustrations, and implemented sound using the Web Audio API.',
    github: 'https://github.com/mosaic-api',
    site: 'https://the-mosaic.herokuapp.com',
    logoModel: 'mosaic_logo.stl',
    logoColor: '#C144F3',
    secondaryColor: '#F44C52',
    image1: 'images/project_images/mosaic_1.png',
    image2: 'images/project_images/mosaic_2.png',
  },
  {
    color: 'chocolate',
    name: 'chrystalSynth',
    stack: 'JavaScript, HTML, CSS',
    description:
      'Browser-based musical instrument that can be controlled using a computer keyboard or a MIDI controller. Made with the Web Audio API. I programmed the synthesizer\'s functionality and implemented recording and audio playback with localStorage.',
    github: 'https://github.com/chrysalSynth',
    site: 'https://chrysalsynth.github.io/chrysalSynth',
    logoModel: 'chrystalsynth_logo.stl',
    logoColor: '#737373',
    secondaryColor: '#E80415',
    image1: 'images/project_images/chrystalsynth_1.png',
    image2: 'images/project_images/chrystalsynth_2.png',
  },
  {
    color: 'chocolate',
    name: 'UniMic',
    stack: 'C#, Max/MSP, Unity',
    description:
      'A prototype for integrating object-based audio in Unity. The goal of this research was to introduce an alternative method to reproduce spatial audio with loudspeakers. Through the use of virtual microphone arrays, I was able to develop a scalable system for loudspeaker reproduction and by using distance-based amplitude panning, I was able to utilize a variety of speaker configurations and forego any requirements for listener position.',
    github: 'none',
    site: 'none',
    logoModel: 'unimic_logo.stl',
    logoColor: '#FFFF4C',
    secondaryColor: '#342AFF',
    image1: 'images/project_images/unimic_1.png',
    image2: 'images/project_images/unimic_2.png',
  },
];

export const about = {
  bio:
    'Chris is a software developer who thrives in collaborative work environments and enjoys challenging experiences that provide opportunities for growth. He enjoys applying creative and practical problem-solving techniques learned in the music industry to diverse teams.',
  other: 'More info soon...',
};

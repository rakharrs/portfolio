export interface ProjectMedia {
  src: string;
  caption: string;
  type?: 'image' | 'video';
  poster?: string;
}

export interface Project {
  id: string;
  category: 'academic' | 'professional';
  title: string;
  role: string;
  description: string;
  stack: string[];
  media: ProjectMedia[];
  link?: string;
  github?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  type: 'work' | 'education';
}

export const PROJECTS: Project[] = [
  {
    id: 'chess',
    category: 'academic',
    title: 'Chess',
    role: 'Personal project',
    description:
      'A multiplayer chess game rendered with LWJGL and OpenGL, with a secondary Java Swing build. Real-time local multiplayer runs over raw Java Sockets, handling move validation, turn state and board sync between two clients.',
    stack: ['Java', 'LWJGL', 'OpenGL', 'Swing', 'Sockets'],
    media: [
      { src: '/images/chess-screen.png', caption: 'Java Swing interface' },
      { src: '/images/chess-multiplayer.png', caption: 'Board & piece rendering' },
      { src: '/images/chess-multiplayer-screen.png', caption: 'Chess multiplayer screen' },
    ],
    github: 'https://github.com/rakharrs/simple-chess',
  },
  {
    id: 'hotel',
    category: 'professional',
    title: 'Hotel & Restaurant Management Platform',
    role: 'Full Stack Developer — Aro Immobilier . SA',
    description:
      'A web application for a hotel-restaurant covering bookings, tenant tracking and asset oversight. Its standout piece is a table reservation module built with D3.js: an interactive floor map where staff place tables, check availability and confirm reservations visually instead of through a plain form.',
    stack: ['Java', 'Spring Boot', 'React', 'D3.js', 'PostgreSQL', 'Docker'],
    media: [
      {
        src: '/videos/hotel-reservation-demo.mp4',
        poster: '/images/resa-system.png',
        type: 'video',
        caption: 'Restaurant floor map & table reservation (D3.js)',
      },
      { src: '/images/resa-system.png', caption: 'Restaurant reservation system' },
      { src: '/images/disposition-table.png', caption: 'Restaurant table disposition' },
    ],
    link: '#',
  },
  {
    id: 'merana',
    category: 'academic',
    title: 'Merana Framework',
    role: 'Personal project',
    description:
      'A lightweight custom-built Java web framework designed for speed. Ships with a proprietary ORM for database access, built-in RESTful API handling, and a ModelView engine that renders pages directly from HTTP requests without external dependencies.',
    stack: ['Java', 'Web Framework', 'ORM', 'MVC', 'REST'],
    media: [
      // { src: '/images/merana-1.jpg', caption: 'Custom ORM query builder' },
      // { src: '/images/merana-2.jpg', caption: 'REST endpoint routing' },
      // { src: '/images/merana-3.jpg', caption: 'ModelView page rendering engine' },
    ],
    github: 'https://github.com/rakharrs/merana',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'Full Stack Developer (Internship - service provider)',
    company: 'Aro Immobilier . SA',
    period: '2024 - 2025',
    description: 'Making a web application for an hotel-restaurant. Developed a real estate management system (ERP) for property operations. Implemented features for lease contract management, tenant tracking, and asset oversight.',
    skills: ['Java', 'Spring-boot', 'PostgreSQL', 'React', 'RESTful APIs', 'Docker', 'git'],
    type: 'work'
  },
    {
    id: '2',
    role: "English Advanced 1 Certificate",
    company: 'English Teaching Program',
    period: '2026',
    description: 'English language proficiency certificate.',
    skills: ['English writing', 'reading', 'listening', 'speaking'],
    type: 'education'
  },
  {
    id: '3',
    role: "Diplôme d'Études en Langue Française - DELF B2",
    company: 'Alliance Française Antananarivo',
    period: '2025',
    description: 'French language proficiency diploma.',
    skills: ['French writing', 'reading', 'listening', 'speaking'],
    type: 'education'
  },
  {
    id: '4',
    role: 'License in Computer Science',
    company: 'IT-University',
    period: '2025',
    description: 'Graduated with honors, focusing on software engineering, data structures, and algorithms. Completed a thesis on a hotel & restaurant management system with floor map visualization to manage bookings and services.',
    skills: ['Object oriented programming', 'Web development', 'Database management', 'Data structure', 'Algorithms', 'Optimisation', 'Machine learning'],
    type: 'education'
  },
  {
    id: '5',
    role: 'Assistant digital factory',
    company: 'Orange Madagascar',
    period: '2024',
    description: 'Developed microservices using Quarkus framework in collaboration with cross-functional teams. Creation of a web application to manage the api. Implemented a program that automates the database update by fetching data from an excel file and updating the sql database accordingly.',
    skills: ['Java', 'Quarkus', 'MySQL', 'React', 'RESTful APIs', 'ELK', 'git'],
    type: 'work'
  },
  {
    id: '6',
    role: 'Baccalauréat scientifique',
    company: 'ESCA Antanimena',
    period: '2021',
    description: 'Madagascar - Baccalauréat Série C',
    skills: [],
    type: 'education'
  }
];

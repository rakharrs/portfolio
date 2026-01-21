export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github: string;
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
    id: '1',
    title: 'Chess',
    description: 'A multiplayer chess game. It features rendering powered by LWJGL and OpenGL and also a version made with Java Swing, and real-time local multiplayer capabilities using Java Sockets.',
    tags: ['Java', 'LWJGL', 'OpenGL', 'Swing', 'Sockets'],
    image: '/images/photo-chess.jpg',
    link: '#',
    github: '#',
  },
  {
    id: '2',
    title: 'Merana Framework',
    description: 'A lightweight custom-built web framework designed for speed. Features a proprietary ORM for database management, built-in RESTful API handling, and a ModelView engine for direct HTTP page rendering.',
    tags: ['Java', 'Web Framework', 'ORM', 'MVC', 'REST'],
    image: '/',
    link: '#',
    github: '#',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'Full Stack Developer (Internship - service provider)',
    company: 'Aro Immobilier . SA',
    period: '2024 - 2025',
    description: 'Making a web application for an hotel-restaurant. Developed a comprehensive real estate management system (ERP) to streamline property operations. Implemented features for lease contract management, tenant tracking, and asset oversight using a Spring-boot framework and React.',
    skills: ['Java', 'Spring-boot', 'PostgreSQL', 'React', 'RESTful APIs', 'Docker', 'git'],
    type: 'work'
  },
  {
    id: '2',
    role: 'Assistant digital factory',
    company: 'Orange Madagascar',
    period: '2024',
    description: 'Developed microservices using Quarkus framework in collaboration with cross-functional teams. Creation of a web application to manage the api. Implemented a program that automates the database update by fetching data from an excel file and updating the sql database accordingly.',
    skills: ['Java', 'Quarkus', 'MySQL', 'React', 'RESTful APIs', 'ELK', 'git'],
    type: 'work'
  },
  {
    id: '3',
    role: 'License in Computer Science',
    company: 'IT-University',
    period: '2022 - 2025',
    description: 'Graduated with honors, focusing on software engineering, data structures, and algorithms. Completed a thesis on a hotel & restaurant management system with floor map visualization to manage bookings and services.',
    skills: ['Object oriented programming', 'Web development', 'Database management', 'Data structure', 'Algorithms', 'Optimisation', 'Machine learning'],
    type: 'education'
  },
  {
    id: '4',
    role: 'Baccalauréat scientifique',
    company: 'ESCA Antanimena',
    period: '2021',
    description: 'Madagascar - Baccalauréat Série C',
    skills: [],
    type: 'education'
  }
];
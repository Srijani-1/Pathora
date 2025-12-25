import { LearningPath, UserProgress, Skill, Recommendation } from '../types/learning';

export const learningPaths: LearningPath[] = [
  {
    id: 'frontend-beginner',
    title: 'Frontend Development Path',
    description: 'Master modern frontend development with React, TypeScript, and industry best practices.',
    careerGoal: 'frontend',
    level: 'beginner',
    totalSkills: 12,
    estimatedWeeks: 16,
    skills: [
      {
        id: 'html-css-basics',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development with semantic HTML and modern CSS.',
        status: 'completed',
        estimatedTime: '2 weeks',
        prerequisites: [],
        category: 'Foundation',
        difficulty: 'beginner',
        whyItMatters: 'HTML and CSS form the foundation of all web applications. Understanding these technologies is essential for creating accessible, responsive, and visually appealing interfaces.',
        whatYouLearn: [
          'Semantic HTML5 elements and document structure',
          'CSS Flexbox and Grid layouts',
          'Responsive design principles and media queries',
          'CSS animations and transitions',
          'Web accessibility best practices'
        ],
        resources: [
          { id: '1', title: 'MDN HTML Guide', type: 'article', url: '#', duration: '3 hours' },
          { id: '2', title: 'CSS Flexbox Tutorial', type: 'video', url: '#', duration: '45 min' },
          { id: '3', title: 'Build a Responsive Layout', type: 'practice', url: '#', duration: '2 hours' },
        ]
      },
      {
        id: 'javascript-basics',
        title: 'JavaScript Essentials',
        description: 'Master JavaScript fundamentals including ES6+ features, DOM manipulation, and async programming.',
        status: 'completed',
        estimatedTime: '3 weeks',
        prerequisites: ['html-css-basics'],
        category: 'Foundation',
        difficulty: 'beginner',
        whyItMatters: 'JavaScript is the programming language of the web. It enables interactive, dynamic experiences and is essential for modern frontend development.',
        whatYouLearn: [
          'Variables, data types, and operators',
          'Functions, scope, and closures',
          'Array and object manipulation',
          'ES6+ features (arrow functions, destructuring, spread)',
          'Asynchronous programming with Promises and async/await',
          'DOM manipulation and event handling'
        ],
        resources: [
          { id: '4', title: 'JavaScript.info Tutorial', type: 'tutorial', url: '#', duration: '8 hours' },
          { id: '5', title: 'Async JavaScript Deep Dive', type: 'video', url: '#', duration: '1.5 hours' },
          { id: '6', title: 'Build Interactive UI Components', type: 'practice', url: '#', duration: '4 hours' },
        ]
      },
      {
        id: 'react-fundamentals',
        title: 'React Fundamentals',
        description: 'Build modern web applications with React, hooks, and component-based architecture.',
        status: 'in-progress',
        estimatedTime: '4 weeks',
        prerequisites: ['javascript-basics'],
        category: 'Framework',
        difficulty: 'intermediate',
        whyItMatters: 'React is the most popular frontend library, used by companies like Meta, Netflix, and Airbnb. Learning React opens doors to countless job opportunities.',
        whatYouLearn: [
          'Components and JSX syntax',
          'Props and state management',
          'React Hooks (useState, useEffect, useContext)',
          'Conditional rendering and lists',
          'Form handling and validation',
          'Component lifecycle and side effects'
        ],
        resources: [
          { id: '7', title: 'Official React Documentation', type: 'article', url: '#', duration: '6 hours' },
          { id: '8', title: 'React Hooks Complete Guide', type: 'video', url: '#', duration: '2 hours' },
          { id: '9', title: 'Build a Todo App', type: 'practice', url: '#', duration: '5 hours' },
        ]
      },
      {
        id: 'typescript-intro',
        title: 'TypeScript for React',
        description: 'Add type safety to your React applications with TypeScript.',
        status: 'upcoming',
        estimatedTime: '2 weeks',
        prerequisites: ['react-fundamentals'],
        category: 'Language',
        difficulty: 'intermediate',
        whyItMatters: 'TypeScript catches bugs before runtime, improves code quality, and provides excellent IDE support. Most modern React projects use TypeScript.',
        whatYouLearn: [
          'Basic types and type inference',
          'Interfaces and type aliases',
          'Typing React components and props',
          'Generic types and utility types',
          'Type guards and narrowing'
        ],
        resources: [
          { id: '10', title: 'TypeScript Handbook', type: 'article', url: '#', duration: '4 hours' },
          { id: '11', title: 'React TypeScript Patterns', type: 'tutorial', url: '#', duration: '3 hours' },
        ]
      },
      {
        id: 'state-management',
        title: 'State Management (Context & Zustand)',
        description: 'Learn effective state management patterns for complex React applications.',
        status: 'upcoming',
        estimatedTime: '2 weeks',
        prerequisites: ['react-fundamentals'],
        category: 'Advanced',
        difficulty: 'intermediate',
        whyItMatters: 'As applications grow, managing state becomes crucial. Learn when and how to use different state management solutions.',
        whatYouLearn: [
          'React Context API patterns',
          'Zustand for simple global state',
          'State management best practices',
          'Performance optimization techniques'
        ],
        resources: [
          { id: '12', title: 'State Management Guide', type: 'article', url: '#', duration: '3 hours' },
          { id: '13', title: 'Zustand Tutorial', type: 'video', url: '#', duration: '1 hour' },
        ]
      },
      {
        id: 'styling-tailwind',
        title: 'Modern Styling with Tailwind CSS',
        description: 'Build beautiful, responsive UIs rapidly with utility-first CSS.',
        status: 'upcoming',
        estimatedTime: '1 week',
        prerequisites: ['html-css-basics'],
        category: 'Styling',
        difficulty: 'beginner',
        whyItMatters: 'Tailwind CSS has become the go-to styling solution for modern web applications, enabling rapid development without sacrificing design quality.',
        whatYouLearn: [
          'Utility-first CSS principles',
          'Responsive design with Tailwind',
          'Custom theme configuration',
          'Component patterns and composition'
        ],
        resources: [
          { id: '14', title: 'Tailwind Documentation', type: 'article', url: '#', duration: '2 hours' },
          { id: '15', title: 'Building UI Components', type: 'practice', url: '#', duration: '3 hours' },
        ]
      }
    ]
  }
];

export const initialUserProgress: UserProgress = {
  currentPath: 'frontend-beginner',
  completedSkills: ['html-css-basics', 'javascript-basics'],
  inProgressSkills: ['react-fundamentals'],
  weeklyStreak: 5,
  totalHoursSpent: 42,
  weeklyGoalHours: 10,
  joinedDate: '2024-12-01',
  lastActivityDate: '2024-12-24',
  milestones: [
    {
      id: 'm1',
      title: 'First Skill Completed',
      description: 'Completed your first skill in the learning path',
      achievedDate: '2024-12-05',
      icon: 'Trophy'
    },
    {
      id: 'm2',
      title: '7-Day Streak',
      description: 'Maintained learning for 7 consecutive days',
      achievedDate: '2024-12-15',
      icon: 'Flame'
    },
    {
      id: 'm3',
      title: '40 Hours',
      description: 'Spent 40 hours learning',
      achievedDate: '2024-12-22',
      icon: 'Clock'
    },
    {
      id: 'm4',
      title: 'Path Halfway',
      description: 'Complete 50% of your learning path',
      icon: 'Target'
    }
  ]
};

export const recommendations: Recommendation[] = [
  {
    skillId: 'typescript-intro',
    reason: 'Recommended because it builds on React Fundamentals. Most learners take this after React.',
    priority: 'high'
  },
  {
    skillId: 'styling-tailwind',
    reason: 'Complements your React skills and is highly valued by employers.',
    priority: 'medium'
  }
];

export const careerGoals = [
  { id: 'frontend', label: 'Frontend Development', icon: 'Monitor' },
  { id: 'backend', label: 'Backend Development', icon: 'Server' },
  { id: 'fullstack', label: 'Full Stack Development', icon: 'Layers' },
  { id: 'data', label: 'Data Science', icon: 'Database' },
  { id: 'ai', label: 'AI & Machine Learning', icon: 'Brain' },
  { id: 'cloud', label: 'Cloud Engineering', icon: 'Cloud' },
  { id: 'mobile', label: 'Mobile Development', icon: 'Smartphone' },
  { id: 'devops', label: 'DevOps Engineering', icon: 'GitBranch' },
];

export const levelOptions = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', description: 'Extensive experience' },
];

export const timeCommitmentOptions = [
  { id: '5', label: '5 hours/week', description: 'Light pace' },
  { id: '10', label: '10 hours/week', description: 'Steady progress' },
  { id: '20', label: '20 hours/week', description: 'Fast track' },
  { id: '30', label: '30+ hours/week', description: 'Intensive' },
];

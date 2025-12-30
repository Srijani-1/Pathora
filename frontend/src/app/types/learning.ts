export type SkillStatus = 'completed' | 'in-progress' | 'upcoming' | 'locked';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type CareerGoal = 'frontend' | 'backend' | 'fullstack' | 'data' | 'ai' | 'cloud' | 'mobile' | 'devops';

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'practice' | 'tutorial';
  url: string;
  duration?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  status: SkillStatus;
  estimatedTime: string;
  prerequisites: string[];
  resources: Resource[];
  category: string;
  difficulty: DifficultyLevel;
  whyItMatters: string;
  whatYouLearn: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  careerGoal: CareerGoal;
  level: DifficultyLevel;
  totalSkills: number;
  estimatedWeeks: number;
  skills: Skill[];
}

export interface UserProgress {
  currentPath: string;
  completedSkills: string[];
  inProgressSkills: string[];
  weeklyStreak: number;
  totalHoursSpent: number;
  weeklyGoalHours: number;
  joinedDate: string;
  lastActivityDate: string;
  milestones: Milestone[];
  weeklyActivity: { day: string; hours: number }[];
  trajectory: { month: string; skills: number }[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedDate?: string;
  icon: string;
}

export interface Recommendation {
  skillId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

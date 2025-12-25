import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { Onboarding, OnboardingData } from './components/onboarding';
import { AuthView } from './components/auth-view';
import { DashboardLayout } from './components/dashboard-layout';
import { DashboardView } from './components/dashboard-view';
import { LearningPathView } from './components/learning-path-view';
import { SkillsView } from './components/skills-view';
import { SkillDetailView } from './components/skill-detail-view';
import { ProgressView } from './components/progress-view';
import { RecommendationsView } from './components/recommendations-view';
import { ResourcesView } from './components/resources-view';
import { ProfileView } from './components/profile-view';
import { ProjectsView } from './components/projects-view';
import { learningPaths, initialUserProgress, recommendations } from './data/mockData';
import { UserProgress, Skill } from './types/learning';
import { toast } from 'sonner';

type View = 'dashboard' | 'learning-path' | 'skills' | 'progress' | 'resources' | 'profile' | 'projects';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [skills, setSkills] = useState<Skill[]>(learningPaths[0].skills);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check authentication
    const loggedInUser = localStorage.getItem('logged_in_user');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setIsAuthenticated(true);
      setUserEmail(userData.email);
      setUserName(userData.name);
    }

    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('onboarding_complete');
    if (onboardingComplete === 'true') {
      setHasCompletedOnboarding(true);
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleLogin = (email: string, name: string) => {
    const userData = { email, name };
    localStorage.setItem('logged_in_user', JSON.stringify(userData));
    localStorage.setItem('user_joined_date', new Date().toISOString());
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('logged_in_user');
    localStorage.removeItem('onboarding_complete');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setHasCompletedOnboarding(false);
    setCurrentView('dashboard');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = (name: string) => {
    setUserName(name);
    const userData = { email: userEmail, name };
    localStorage.setItem('logged_in_user', JSON.stringify(userData));
    
    // Update in users array too
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.email === userEmail ? { ...u, name } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    console.log('Onboarding data:', data);
    localStorage.setItem('onboarding_complete', 'true');
    setHasCompletedOnboarding(true);
    toast.success('Welcome to your learning journey! 🎉');
  };

  const handleNavigate = (view: string, skillId?: string) => {
    if (skillId) {
      setSelectedSkillId(skillId);
      setCurrentView('skills');
    } else {
      setCurrentView(view as View);
      setSelectedSkillId(null);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleUpdateSkillStatus = (skillId: string, status: 'in-progress' | 'completed') => {
    setSkills(prevSkills => 
      prevSkills.map(skill => 
        skill.id === skillId ? { ...skill, status } : skill
      )
    );

    setUserProgress(prev => {
      const updated = { ...prev };
      
      if (status === 'in-progress' && !prev.inProgressSkills.includes(skillId)) {
        updated.inProgressSkills = [...prev.inProgressSkills, skillId];
      }
      
      if (status === 'completed') {
        updated.completedSkills = [...prev.completedSkills, skillId];
        updated.inProgressSkills = prev.inProgressSkills.filter(id => id !== skillId);
      }
      
      return updated;
    });

    if (status === 'completed') {
      toast.success('Skill completed! 🎉', {
        description: 'Great job! Keep up the momentum.'
      });
    } else if (status === 'in-progress') {
      toast.success('Skill started! 🚀', {
        description: 'You\'re on your way to mastering this skill.'
      });
    }
  };

  const completionPercentage = Math.round(
    (userProgress.completedSkills.length / skills.length) * 100
  );

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const selectedSkill = selectedSkillId ? skills.find(s => s.id === selectedSkillId) : null;

  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      <DashboardLayout
        currentView={selectedSkill ? 'skills' : currentView}
        onNavigate={handleNavigate}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        progress={completionPercentage}
        currentGoal="Frontend Development"
        userName={userName}
      >
        {selectedSkill ? (
          <SkillDetailView
            skill={selectedSkill}
            onBack={() => setSelectedSkillId(null)}
            onUpdateStatus={handleUpdateSkillStatus}
          />
        ) : currentView === 'dashboard' ? (
          <DashboardView
            userProgress={userProgress}
            currentSkills={skills}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'learning-path' ? (
          <LearningPathView
            skills={skills}
            onSkillClick={(skillId) => handleNavigate('skills', skillId)}
          />
        ) : currentView === 'skills' ? (
          <SkillsView
            skills={skills}
            onSkillClick={(skillId) => handleNavigate('skills', skillId)}
          />
        ) : currentView === 'progress' ? (
          <ProgressView
            userProgress={userProgress}
            skills={skills}
          />
        ) : currentView === 'resources' ? (
          <ResourcesView />
        ) : currentView === 'profile' ? (
          <ProfileView
            userEmail={userEmail}
            userName={userName}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : currentView === 'projects' ? (
          <ProjectsView />
        ) : (
          <RecommendationsView
            skills={skills}
            recommendations={recommendations}
            onSkillClick={(skillId) => handleNavigate('skills', skillId)}
            userProgress={userProgress}
          />
        )}
      </DashboardLayout>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
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
import { ResourcesView } from './components/resources-view';
import { ProfileView } from './components/profile-view';
import { ProjectsView } from './components/projects-view';
import { learningPaths, initialUserProgress } from './data/mockData';
import { UserProgress, Skill } from './types/learning';
import { toast } from 'sonner';

type View =
  | 'dashboard'
  | 'learning-path'
  | 'skills'
  | 'progress'
  | 'resources'
  | 'profile'
  | 'projects';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [skills, setSkills] = useState<Skill[]>(learningPaths[0].skills);

  // Load logged-in user & onboarding on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('logged_in_user');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setIsAuthenticated(true);
      setUserEmail(userData.email);
      setUserName(userData.name);
    }

    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);

    if (localStorage.getItem('onboarding_complete') === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  // LOGIN handler
  const handleLogin = (email: string, name: string) => {
    localStorage.setItem('logged_in_user', JSON.stringify({ email, name }));
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name);

    // Optional: mark onboarding complete if first login
    if (!hasCompletedOnboarding) {
      localStorage.setItem('onboarding_complete', 'true');
      setHasCompletedOnboarding(true);
    }

    setCurrentView('dashboard');
    toast.success(`Welcome, ${name}! 🎉`);
  };

  // LOGOUT handler
  const handleLogout = () => {
    localStorage.removeItem('logged_in_user');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setCurrentView('dashboard');
    toast.success('Logged out successfully');
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

  const handleOnboardingComplete = (data: OnboardingData) => {
    localStorage.setItem('onboarding_complete', 'true');
    setHasCompletedOnboarding(true);
    toast.success('Welcome to your learning journey! 🎉');
  };

  const completionPercentage = Math.round(
    (userProgress.completedSkills.length / skills.length) * 100
  );

  // UPDATE profile handler
  const handleUpdateProfile = (newName: string) => {
    setUserName(newName);

    // Update avatar in state
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);
  };

  if (!isAuthenticated) return <AuthView onLogin={handleLogin} />;
  if (!hasCompletedOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  const selectedSkill = selectedSkillId
    ? skills.find(s => s.id === selectedSkillId)
    : null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DashboardLayout
        currentView={selectedSkill ? 'skills' : currentView}
        onNavigate={handleNavigate}
        progress={completionPercentage}
        currentGoal="Frontend Development"
        userName={userName}
        avatarUrl={avatarUrl}
        onLogout={handleLogout}
      >
        {selectedSkill ? (
          <SkillDetailView
            skill={selectedSkill}
            onBack={() => setSelectedSkillId(null)}
            onUpdateStatus={() => {}}
          />
        ) : currentView === 'dashboard' ? (
          <DashboardView
            userProgress={userProgress}
            currentSkills={skills}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'learning-path' ? (
          <LearningPathView skills={skills} onSkillClick={id => handleNavigate('skills', id)} />
        ) : currentView === 'skills' ? (
          <SkillsView skills={skills} onSkillClick={id => handleNavigate('skills', id)} />
        ) : currentView === 'progress' ? (
          <ProgressView userProgress={userProgress} skills={skills} />
        ) : currentView === 'resources' ? (
          <ResourcesView />
        ) : currentView === 'profile' ? (
          <ProfileView
            userEmail={userEmail}
            userName={userName}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : (
          <ProjectsView />
        )}
      </DashboardLayout>

      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}

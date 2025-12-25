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
// import { learningPaths, initialUserProgress, recommendations } from './data/mockData';
import { UserProgress, Skill } from './types/learning';
import { toast } from 'sonner';
import { apiFetch } from './lib/api';
import { BookOpen } from 'lucide-react';

type View = 'dashboard' | 'learning-path' | 'skills' | 'progress' | 'resources' | 'profile' | 'projects';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [currentPathId, setCurrentPathId] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const fetchInitialData = async (forceLatest = false) => {
    try {
      const user = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
      if (!user.id) return;

      const [progressData, pathsData] = await Promise.all([
        apiFetch(`/progress/overview/${user.id}`),
        apiFetch(`/learning-paths/?user_id=${user.id}`)
      ]);

      setUserProgress(progressData);

      if (pathsData && pathsData.length > 0) {
        setLearningPaths(pathsData);

        // Select the path. Priority: forceLatest -> currentPathId state -> localStorage -> latest path
        const savedPathId = localStorage.getItem('selected_path_id');
        const initialPathId = forceLatest
          ? pathsData[pathsData.length - 1].id
          : (currentPathId || (savedPathId ? parseInt(savedPathId) : pathsData[pathsData.length - 1].id));

        const path = pathsData.find((p: any) => p.id === initialPathId) || pathsData[pathsData.length - 1];
        setCurrentPathId(path.id);
        localStorage.setItem('selected_path_id', path.id.toString());

        const pathSkills: Skill[] = (path.modules || []).flatMap((module: any) =>
          (module.lessons || []).map((lesson: any) => ({
            id: lesson.id.toString(),
            title: lesson.title,
            description: lesson.content || '',
            category: module.title,
            difficulty: lesson.difficulty || 'beginner',
            status: lesson.status || 'upcoming',
            estimatedTime: lesson.estimated_time || '1 week',
            prerequisites: lesson.prerequisites_list || [],
            resources: lesson.ai_resources ? JSON.parse(lesson.ai_resources).map((r: any, idx: number) => ({
              id: `ai-res-${lesson.id}-${idx}`,
              title: r.title,
              type: r.type,
              url: r.url,
              duration: r.duration
            })) : [],
            whyItMatters: lesson.why_it_matters || 'This skill is essential for your career path.',
            whatYouLearn: lesson.what_you_learn ? JSON.parse(lesson.what_you_learn) : ['Core concepts', 'Practical application', 'Industry standards']
          }))
        );
        setSkills(pathSkills);
      } else {
        setLearningPaths([]);
        setSkills([]);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      toast.error('Connect to backend failed.');
    } finally {
      setUserProgress(prev => prev || {
        currentPath: '',
        completedSkills: [],
        inProgressSkills: [],
        totalHoursSpent: 0,
        weeklyStreak: 0,
        weeklyGoalHours: 10,
        joinedDate: new Date().toISOString(),
        lastActivityDate: new Date().toISOString(),
        milestones: [],
        weeklyActivity: [],
        trajectory: []
      });
    }
  };

  useEffect(() => {
    // Safety timeout: Ensure loading screen clears after 5s even if API hangs
    const timeout = setTimeout(() => {
      // Don't set demo data on timeout anymore
    }, 5000);

    // Check authentication - Disabled to force login on reload
    /*
    const loggedInUser = localStorage.getItem('logged_in_user');
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        if (!userData.id) {
          // Stale data from old frontend, clear it
          handleLogout();
          return;
        }
        setIsAuthenticated(true);
        setUserEmail(userData.email);
        setUserName(userData.full_name || userData.name);
        fetchInitialData();
      } catch (e) {
        handleLogout();
      }
    }
    */

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
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name);
    fetchInitialData();
  };

  const handleLogout = () => {
    localStorage.removeItem('logged_in_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('onboarding_complete');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setHasCompletedOnboarding(false);
    setCurrentView('dashboard');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = async (name: string) => {
    try {
      const response = await fetch('http://localhost:8000/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ full_name: name }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setUserName(data.full_name);

      const userData = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
      userData.full_name = data.full_name;
      localStorage.setItem('logged_in_user', JSON.stringify(userData));

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    localStorage.setItem('onboarding_complete', 'true');
    setHasCompletedOnboarding(true);
    fetchInitialData(); // Load the AI generated path immediately
    toast.success('Welcome to your personalized learning journey! 🎉');
  };

  const handleNavigate = (view: string, skillId?: string) => {
    if (skillId) {
      setSelectedSkillId(skillId);
      // Don't change currentView if we're just opening a skill detail
      // This way "Back" stays in the same context (Dashboard/Learning Path)
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

  const handleUpdateSkillStatus = async (skillId: string, status: 'in-progress' | 'completed') => {
    try {
      const user = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
      if (!user.id) return;

      if (status === 'completed') {
        await fetch(`http://localhost:8000/progress/complete/${skillId}?user_id=${user.id}&time_spent=1.0`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      }

      setSkills(prevSkills =>
        prevSkills.map(skill =>
          skill.id === skillId ? { ...skill, status } : skill
        )
      );

      setUserProgress(prev => {
        if (!prev) return null;
        const updated = { ...prev };

        if (status === 'in-progress' && !prev.inProgressSkills.includes(skillId)) {
          updated.inProgressSkills = [...prev.inProgressSkills, skillId];
        }

        if (status === 'completed') {
          updated.completedSkills = Array.from(new Set([...prev.completedSkills, skillId]));
          updated.inProgressSkills = prev.inProgressSkills.filter(id => id !== skillId);
        }

        return updated;
      });

      // Refresh progress data from server to get accurate charts/hours
      const userAgain = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
      if (userAgain.id) {
        const progressData = await apiFetch(`/progress/overview/${userAgain.id}`);
        setUserProgress(progressData);
      }

      if (status === 'completed') {
        toast.success('Skill completed! 🎉', {
          description: 'Great job! Keep up the momentum.'
        });
      } else if (status === 'in-progress') {
        toast.success('Skill started! 🚀', {
          description: 'You\'re on your way to mastering this skill.'
        });
      }
    } catch (error: any) {
      toast.error('Failed to update progress');
    }
  };

  const completionPercentage = userProgress && skills.length > 0 ? Math.round(
    (userProgress.completedSkills.length / skills.length) * 100
  ) : 0;

  if (isAuthenticated && hasCompletedOnboarding && !userProgress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4338ca]"></div>
      </div>
    );
  }

  const selectedSkill = selectedSkillId ? skills.find(s => s.id === selectedSkillId) : null;
  const currentPath = learningPaths.find(p => p.id === currentPathId);

  // Function to switch paths
  const handleSwitchPath = (pathId: number) => {
    setCurrentPathId(pathId);
    localStorage.setItem('selected_path_id', pathId.toString());
    const path = learningPaths.find(p => p.id === pathId);
    if (path) {
      const pathSkills: Skill[] = (path.modules || []).flatMap((module: any) =>
        (module.lessons || []).map((lesson: any) => ({
          id: lesson.id.toString(),
          title: lesson.title,
          description: lesson.content || '',
          category: module.title,
          difficulty: lesson.difficulty || 'beginner',
          status: lesson.status || 'upcoming',
          estimatedTime: lesson.estimated_time || '1 week',
          prerequisites: lesson.prerequisites_list || [],
          resources: lesson.ai_resources ? JSON.parse(lesson.ai_resources).map((r: any, idx: number) => ({
            id: `ai-res-${lesson.id}-${idx}`,
            title: r.title,
            type: r.type,
            url: r.url,
            duration: r.duration
          })) : [],
          whyItMatters: lesson.why_it_matters || 'This skill is essential for your career path.',
          whatYouLearn: lesson.what_you_learn ? JSON.parse(lesson.what_you_learn) : ['Core concepts', 'Practical application', 'Industry standards']
        }))
      );
      setSkills(pathSkills);
      toast.success(`Switched to: ${path.title}`);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      {!isAuthenticated ? (
        <AuthView onLogin={handleLogin} />
      ) : !hasCompletedOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <DashboardLayout
          currentView={selectedSkill ? 'skills' : currentView}
          onNavigate={handleNavigate}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          progress={completionPercentage}
          currentGoal={currentPath?.title || "Choose a Goal"}
          userName={userName}
        >
          {selectedSkill ? (
            <SkillDetailView
              skill={selectedSkill}
              onBack={() => setSelectedSkillId(null)}
              onUpdateStatus={handleUpdateSkillStatus}
              onRefresh={fetchInitialData}
            />
          ) : currentView === 'dashboard' ? (
            <DashboardView
              userProgress={userProgress!}
              currentSkills={skills}
              onNavigate={handleNavigate}
            />
          ) : currentView === 'learning-path' ? (
            <LearningPathView
              skills={skills}
              allPaths={learningPaths}
              currentPathId={currentPathId}
              onSkillClick={(skillId) => handleNavigate('skills', skillId)}
              onRefresh={() => fetchInitialData(true)}
              onSwitchPath={handleSwitchPath}
            />
          ) : currentView === 'skills' ? (
            <SkillsView
              skills={skills}
              onSkillClick={(skillId) => handleNavigate('skills', skillId)}
            />
          ) : currentView === 'progress' ? (
            <ProgressView
              userProgress={userProgress!}
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No recommendations yet</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">
                Complete more skills to get personalized recommendations for your journey.
              </p>
            </div>
          )}
        </DashboardLayout>
      )}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
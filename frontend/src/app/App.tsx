import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { Onboarding, OnboardingData } from "./components/onboarding";
import { AuthView } from "./components/auth-view";
import { DashboardLayout } from "./components/dashboard-layout";
import { DashboardView } from "./components/dashboard-view";
import { LearningPathView } from "./components/learning-path-view";
import { SkillsView } from "./components/skills-view";
import { SkillDetailView } from "./components/skill-detail-view";
import { ProgressView } from "./components/progress-view";
import { ResourcesView } from "./components/resources-view";
import { ProfileView } from "./components/profile-view";
import { ProjectsView } from "./components/projects-view";
import { apiFetch } from "./lib/api";
import { BookOpen } from "lucide-react";
import WelcomePage from "./components/pages/WelcomePage";
import { UserProgress, Skill } from "./types/learning";
import { toast } from "sonner";
import { ProjectEditorView } from "./components/pages/ProjectWorkspace";

type View =
  | "dashboard"
  | "learning-path"
  | "skills"
  | "progress"
  | "resources"
  | "profile"
  | "projects"
  | "project-editor";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [currentPathId, setCurrentPathId] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Fetch data after login
  const fetchInitialData = async (forceLatest = false) => {
    try {
      const user = JSON.parse(localStorage.getItem("logged_in_user") || "{}");
      if (!user.id) return;

      const [progressData, pathsData] = await Promise.all([
        apiFetch(`/progress/overview/${user.id}`),
        apiFetch(`/learning-paths/?user_id=${user.id}`),
      ]);

      setUserProgress(progressData);

      if (pathsData && pathsData.length > 0) {
        setLearningPaths(pathsData);

        const savedPathId = localStorage.getItem("selected_path_id");
        const initialPathId = forceLatest
          ? pathsData[pathsData.length - 1].id
          : currentPathId ||
          (savedPathId ? parseInt(savedPathId) : pathsData[pathsData.length - 1].id);

        const path =
          pathsData.find((p: any) => p.id === initialPathId) ||
          pathsData[pathsData.length - 1];
        setCurrentPathId(path.id);
        localStorage.setItem("selected_path_id", path.id.toString());

        const pathSkills: Skill[] = (path.modules || []).flatMap((module: any) =>
          (module.lessons || []).map((lesson: any) => ({
            id: lesson.id.toString(),
            title: lesson.title,
            description: lesson.content || "",
            category: module.title,
            difficulty: lesson.difficulty || "beginner",
            status: lesson.status || "upcoming",
            estimatedTime: lesson.estimated_time || "1 week",
            prerequisites: lesson.prerequisites_list || [],
            resources: lesson.ai_resources
              ? JSON.parse(lesson.ai_resources).map((r: any, idx: number) => ({
                id: `ai-res-${lesson.id}-${idx}`,
                title: r.title,
                type: r.type,
                url: r.url,
                duration: r.duration,
              }))
              : [],
            whyItMatters: lesson.why_it_matters || "This skill is essential for your career path.",
            whatYouLearn: lesson.what_you_learn
              ? JSON.parse(lesson.what_you_learn)
              : ["Core concepts", "Practical application", "Industry standards"],
          }))
        );
        setSkills(pathSkills);
      } else {
        setLearningPaths([]);
        setSkills([]);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("Connect to backend failed.");
    }
  };

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const handleWelcomeFinish = () => setShowWelcome(false);

  // LOGIN callback - correctly sets states and fetches user data
  const handleLogin = async (email: string, name: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name);

    // Wait for user progress & paths to load
    await fetchInitialData();

    const onboardingComplete = localStorage.getItem("onboarding_complete");
    if (onboardingComplete === "true") {
      setHasCompletedOnboarding(true);
      setCurrentView("dashboard"); // Redirect to dashboard after login
    } else {
      setHasCompletedOnboarding(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("access_token");
    //localStorage.removeItem("onboarding_complete");
    setIsAuthenticated(false);
    setUserEmail("");
    setUserName("");
    setHasCompletedOnboarding(false);
    setCurrentView("dashboard");
    toast.success("Logged out successfully");
  };

  const completionPercentage =
    userProgress && skills.length > 0
      ? Math.round((userProgress.completedSkills.length / skills.length) * 100)
      : 0;

  const selectedSkill = selectedSkillId ? skills.find((s) => s.id === selectedSkillId) : null;
  const currentPath = learningPaths.find((p) => p.id === currentPathId);

  const handleNavigate = (view: string, skillId?: string) => {
    if (skillId) {
      setSelectedSkillId(skillId);
    } else {
      setCurrentView(view as View);
      setSelectedSkillId(null);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      {showWelcome ? (
        <WelcomePage onFinish={handleWelcomeFinish} />
      ) : !isAuthenticated ? (
        <AuthView onLogin={handleLogin} />
      ) : !hasCompletedOnboarding ? (
        <Onboarding onComplete={(data: OnboardingData) => {
          localStorage.setItem("onboarding_complete", "true");
          setHasCompletedOnboarding(true);
          fetchInitialData();
          toast.success("Onboarding complete! 🎉");
        }} />
      ) : (
        <DashboardLayout
          currentView={selectedSkill ? "skills" : currentView}
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
              onUpdateStatus={async (skillId, status) => {
                await fetchInitialData(); // refresh progress
              }}
              onRefresh={() => fetchInitialData()}
            />
          ) : currentView === "dashboard" ? (
            <DashboardView userProgress={userProgress!} currentSkills={skills} onNavigate={handleNavigate} />
          ) : currentView === "learning-path" ? (
            <LearningPathView skills={skills} allPaths={learningPaths} currentPathId={currentPathId} onSkillClick={(skillId) => handleNavigate("skills", skillId)} onRefresh={() => fetchInitialData(true)} onSwitchPath={(pathId) => { setCurrentPathId(pathId); localStorage.setItem("selected_path_id", pathId.toString()); }} />
          ) : currentView === "skills" ? (
            <SkillsView skills={skills} onSkillClick={(skillId) => handleNavigate("skills", skillId)} />
          ) : currentView === "progress" ? (
            <ProgressView userProgress={userProgress!} skills={skills} />
          ) : currentView === "resources" ? (
            <ResourcesView />
          ) : currentView === "profile" ? (
            <ProfileView userEmail={userEmail} userName={userName} onLogout={handleLogout} onUpdateProfile={async (name) => { const userData = JSON.parse(localStorage.getItem("logged_in_user") || "{}"); userData.full_name = name; localStorage.setItem("logged_in_user", JSON.stringify(userData)); setUserName(name); toast.success("Profile updated"); }} />
            // ... inside App.tsx where you render ProjectEditorView
          ) : currentView === "projects" ? (
            <ProjectsView
              onOpenProject={(projectId: number) => {
                setSelectedProjectId(projectId);
                setCurrentView("project-editor");
              }}
            />
          ) : currentView === "project-editor" && selectedProjectId ? (
            <ProjectEditorView
              projectId={selectedProjectId}
              onSaveSuccess={() => setCurrentView("projects")} // 1. Pass this callback
            />
          ) : (
            // ...
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

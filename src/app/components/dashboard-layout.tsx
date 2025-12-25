import { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  TrendingUp,
  Library,
  Moon,
  Sun,
  Menu,
  MessageCircle,
  User,
  FolderKanban,
  LogOut
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  progress: number;
  currentGoal: string;
  userName: string;
  avatarUrl: string | null;
  onLogout: () => void;
}

export function DashboardLayout({
  children,
  currentView,
  onNavigate,
  progress,
  currentGoal,
  userName,
  avatarUrl,
  onLogout
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-path', label: 'Learning Path', icon: Map },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBAR */}
      <aside
        className={`bg-card border-r transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        } overflow-hidden`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center">
              L
            </div>
            {sidebarOpen && <span className="font-semibold">LearnPath</span>}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </Button>
            <div>
              <p className="text-xs text-muted-foreground">Current Goal</p>
              <p className="font-medium">{currentGoal}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <span>{progress}%</span>
              <Progress value={progress} className="w-32" />
            </div>

            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>

            {/* PROFILE DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={userName} />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden md:inline">{userName}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* FLOATING LOGOUT */}
      <Button
        onClick={onLogout}
        className="fixed bottom-6 left-6 rounded-full px-4 py-3
                   bg-indigo-600 hover:bg-indigo-700 text-white z-40 flex gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
}

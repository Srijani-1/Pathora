import { ReactNode } from 'react';
import {
  LayoutDashboard, Map, BookOpen, TrendingUp,
  Library, Moon, Sun, Menu, MessageCircle, X, Sparkles, User, FolderKanban, Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  progress: number;
  currentGoal: string;
  userName: string;
}

export function DashboardLayout({
  children,
  currentView,
  onNavigate,
  theme,
  onThemeToggle,
  progress,
  currentGoal,
  userName
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-path', label: 'Learning Path', icon: Map },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resources', label: 'Resources', icon: Library },
  ];

  const handleSendMessage = () => {
    if (!assistantMessage.trim()) return;

    setChatMessages(prev => [...prev, { text: assistantMessage, isUser: true }]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Based on your progress, I'd recommend focusing on React hooks next.",
        "I suggest spending 30 minutes daily on practice exercises to build consistency.",
        "Let me help you with that. Have you checked out the resources section?",
        "That's a good approach! Remember to apply what you learn in projects.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
    }, 1000);

    setAssistantMessage('');
  };

  const handleQuickAction = (question: string) => {
    setChatMessages(prev => [...prev, { text: question, isUser: true }]);

    setTimeout(() => {
      let response = '';
      if (question.includes('revise')) {
        response = "Based on your progress, I recommend revisiting JavaScript fundamentals and practicing with coding challenges.";
      } else if (question.includes('weekly plan')) {
        response = "Here's a suggested plan: Mon-Wed: React components (2hrs/day), Thu-Fri: State management (2hrs/day), Weekend: Build a mini project!";
      } else {
        response = "React hooks are functions that let you use state and lifecycle features in functional components. Start with useState and useEffect!";
      }
      setChatMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`bg-card border-r border-border transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        } overflow-hidden`}>
        <div className={`p-6 border-b border-border ${!sidebarOpen && 'hidden md:block md:p-3'}`}>
          <h2 className={`flex items-center gap-2 ${!sidebarOpen && 'md:justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#4338ca] to-[#7c3aed] rounded-lg flex items-center justify-center text-white flex-shrink-0">
              L
            </div>
            {sidebarOpen && <span>LearnPath</span>}
          </h2>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === item.id
                  ? 'bg-[#4338ca] text-white shadow-md'
                  : 'text-foreground hover:bg-accent'
                  } ${!sidebarOpen && 'md:justify-center'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">Current Goal</p>
              <p className="font-medium truncate">{currentGoal}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="font-medium">{progress}%</p>
              </div>
              <div className="w-32">
                <Progress value={progress} />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className="flex-shrink-0"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full flex-shrink-0"
                >
                  <Avatar>
                    <AvatarFallback>{userName[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{userName}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Manage account
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('profile')}
            >
              <Avatar>
                <AvatarFallback>{userName[0]}</AvatarFallback>
              </Avatar>
            </Button>



          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* AI Assistant (Collapsible) */}
      {assistantOpen && (
        <aside className="w-full md:w-80 border-l border-border bg-card flex flex-col max-h-screen md:max-h-none fixed md:relative inset-0 md:inset-auto z-50 md:z-auto">
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <h3 className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#4338ca]" />
              Learning Assistant
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAssistantOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3 mb-4">
              <p className="text-sm text-muted-foreground">Quick actions:</p>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => handleQuickAction('What should I revise?')}
              >
                What should I revise?
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => handleQuickAction('Suggest a weekly plan')}
              >
                Suggest a weekly plan
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => handleQuickAction('Explain React hooks')}
              >
                Explain React hooks
              </Button>
            </div>

            {chatMessages.length > 0 && (
              <div className="space-y-3 mt-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${msg.isUser
                      ? 'bg-[#4338ca] text-white ml-8'
                      : 'bg-muted mr-8'
                      }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            )}

            {chatMessages.length === 0 && (
              <div className="mt-6 p-3 bg-muted rounded-lg text-sm">
                <p className="text-muted-foreground">
                  I'm here to help you stay on track and answer questions about your learning journey. Ask me anything!
                </p>
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={assistantMessage}
                onChange={(e) => setAssistantMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#4338ca] hover:bg-[#4338ca]/90 flex-shrink-0"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Assistant Toggle */}
      {!assistantOpen && (
        <Button
          onClick={() => setAssistantOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg bg-[#4338ca] hover:bg-[#4338ca]/90 z-40"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
      )}
    </div>
  );
}
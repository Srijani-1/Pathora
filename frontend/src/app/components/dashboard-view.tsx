import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  TrendingUp, Clock, Flame, Target,
  CheckCircle2, Circle, ArrowRight, Trophy
} from 'lucide-react';
import { Button } from './ui/button';
import { UserProgress, Skill } from '../types/learning';

interface DashboardViewProps {
  userProgress: UserProgress;
  currentSkills: Skill[];
  onNavigate: (view: string, skillId?: string) => void;
}

export function DashboardView({ userProgress, currentSkills, onNavigate }: DashboardViewProps) {
  if (!userProgress) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const inProgressSkill = currentSkills.find(s => s.id === userProgress.inProgressSkills[0]);
  const upcomingSkills = currentSkills.filter(s => s.status === 'upcoming').slice(0, 3);
  const completionPercentage = Math.round(
    (userProgress.completedSkills.length / currentSkills.length) * 100
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1>Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1">
          You're making great progress on your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
                <span className="text-2xl font-semibold">{completionPercentage}%</span>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {userProgress.completedSkills.length} of {currentSkills.length} skills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weekly Streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-2xl font-semibold">{userProgress.weeklyStreak}</span>
              <span className="text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Keep it going! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hours This Week</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const weeklyHours = userProgress.weeklyActivity.reduce((acc, curr) => acc + curr.hours, 0);
              const percent = Math.min((weeklyHours / userProgress.weeklyGoalHours) * 100, 100);
              return (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#14b8a6]" />
                    <span className="text-2xl font-semibold">{weeklyHours.toFixed(1)}</span>
                    <span className="text-muted-foreground">/ {userProgress.weeklyGoalHours}h</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {weeklyHours >= userProgress.weeklyGoalHours ? "Goal reached! 🌟" : `${(userProgress.weeklyGoalHours - weeklyHours).toFixed(1)}h left to reach your goal`}
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Learning Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#7c3aed]" />
              <span className="text-2xl font-semibold">{userProgress.totalHoursSpent}</span>
              <span className="text-muted-foreground">hours</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Great dedication! 💪
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Skill */}
      {inProgressSkill && (
        <Card className="border-[#4338ca]/20 shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </div>
              <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
                In Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3>{inProgressSkill.title}</h3>
                <p className="text-muted-foreground mt-1">
                  {inProgressSkill.description.includes('#') || inProgressSkill.description.length > 200
                    ? inProgressSkill.description.replace(/#[^\n]*\n/g, '').split('\n\n')[0].slice(0, 150) + '...'
                    : inProgressSkill.description}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {inProgressSkill.estimatedTime}
                </span>
                <Badge variant="outline">{inProgressSkill.category}</Badge>
              </div>
              <Progress value={0} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">0% complete</span>
                <Button
                  onClick={() => onNavigate('skills', inProgressSkill.id)}
                  className="bg-[#4338ca] hover:bg-[#4338ca]/90"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Up Next</CardTitle>
            <CardDescription>Recommended skills in your path</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => onNavigate('skills', skill.id)}
                className="w-full p-3 rounded-lg border border-border hover:border-[#4338ca]/50 hover:bg-accent transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{skill.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {skill.estimatedTime} • {skill.category}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => onNavigate('learning-path')}
            >
              View Full Learning Path
            </Button>
          </CardContent>
        </Card>

        {/* Recent Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>Your achievements and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProgress.milestones.map((milestone) => {
              const Icon = milestone.icon === 'Trophy' ? Trophy :
                milestone.icon === 'Flame' ? Flame :
                  milestone.icon === 'Clock' ? Clock : Target;
              return (
                <div
                  key={milestone.id}
                  className={`p-3 rounded-lg border ${milestone.achievedDate
                    ? 'bg-[#10b981]/5 border-[#10b981]/20'
                    : 'border-border bg-muted/50'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${milestone.achievedDate
                      ? 'bg-[#10b981]/10'
                      : 'bg-muted'
                      }`}>
                      <Icon className={`w-5 h-5 ${milestone.achievedDate
                        ? 'text-[#10b981]'
                        : 'text-muted-foreground'
                        }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{milestone.title}</p>
                        {milestone.achievedDate && (
                          <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                      {milestone.achievedDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Achieved {new Date(milestone.achievedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, Clock, Target, Award, Calendar, Flame } from 'lucide-react';
import { UserProgress, Skill } from '../types/learning';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProgressViewProps {
  userProgress: UserProgress;
  skills: Skill[];
}

export function ProgressView({ userProgress, skills }: ProgressViewProps) {
  const completionPercentage = Math.round(
    (userProgress.completedSkills.length / skills.length) * 100
  );

  // Weekly progress data
  const weeklyData = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ];

  // Skills by status
  const statusData = [
    {
      name: 'Completed',
      value: skills.filter(s => s.status === 'completed').length,
      color: '#10b981'
    },
    {
      name: 'In Progress',
      value: skills.filter(s => s.status === 'in-progress').length,
      color: '#f59e0b'
    },
    {
      name: 'Upcoming',
      value: skills.filter(s => s.status === 'upcoming').length,
      color: '#14b8a6'
    },
  ];

  // Monthly progress trend
  const monthlyData = [
    { month: 'Start', skills: 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1>Your Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
              <span className="text-2xl font-semibold">{completionPercentage}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {userProgress.completedSkills.length} of {skills.length} skills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Learning Streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-2xl font-semibold">{userProgress.weeklyStreak}</span>
              <span className="text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active days this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Hours</CardDescription>
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
                    Weekly Goal Progress
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#7c3aed]" />
              <span className="text-2xl font-semibold">
                {userProgress.milestones.filter(m => m.achievedDate).length}
              </span>
              <span className="text-muted-foreground">/ {userProgress.milestones.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Achievements unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Activity</CardTitle>
            <CardDescription>
              Hours spent learning each day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userProgress.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: 0 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="hours" fill="#4338ca" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Weekly Goal: {userProgress.weeklyGoalHours}h</span>
              <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20">
                {userProgress.weeklyActivity.reduce((a, b) => a + b.hours, 0) >= userProgress.weeklyGoalHours ? "Goal Met" : "In Progress"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
            <CardDescription>
              Overview of your skill completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Learning Trajectory</CardTitle>
            <CardDescription>
              Cumulative skills completed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userProgress.trajectory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  label={{ value: 'Skills', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="skills"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ fill: '#14b8a6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>
            Your learning activity overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#10b981]/10">
                  <Target className="w-5 h-5 text-[#10b981]" />
                </div>
                <div>
                  <p className="font-medium">Skills Completed</p>
                  <p className="text-sm text-muted-foreground">Total mastered</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{userProgress.completedSkills.length}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#14b8a6]/10">
                  <Calendar className="w-5 h-5 text-[#14b8a6]" />
                </div>
                <div>
                  <p className="font-medium">Active Days</p>
                  <p className="text-sm text-muted-foreground">Days of study this week</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{userProgress.weeklyStreak}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                  <Clock className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <div>
                  <p className="font-medium">Total Time Spent</p>
                  <p className="text-sm text-muted-foreground">All-time hours</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{userProgress.totalHoursSpent}h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

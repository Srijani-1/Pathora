import { useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  CheckCircle2, Circle, Lock, Clock,
  ArrowRight, PlayCircle, Sparkles, Loader2, BrainCircuit,
  Map as MapIcon, BookOpen
} from 'lucide-react';
import { Skill } from '../types/learning';

interface LearningPathViewProps {
  skills: Skill[];
  allPaths: any[];
  currentPathId: number | null;
  onSkillClick: (skillId: string) => void;
  onRefresh: () => void;
  onSwitchPath: (pathId: number) => void;
}

export function LearningPathView({
  skills,
  allPaths,
  currentPathId,
  onSkillClick,
  onRefresh,
  onSwitchPath
}: LearningPathViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [weeks, setWeeks] = useState('4');
  const [hoursPerWeek, setHoursPerWeek] = useState('10');

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter a topic you want to learn');
      return;
    }

    setIsGenerating(true);
    try {
      const user = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
      await apiFetch('/ai/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic,
          difficulty,
          weeks: parseInt(weeks),
          hours_per_week: parseInt(hoursPerWeek),
          user_id: user.id
        })
      });
      toast.success('Your custom learning path is ready! 🚀');
      onRefresh(); // Trigger App.tsx to reload the new skills
      setTopic('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate path');
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = skills.filter(s => s.status === 'completed').length;
  const totalCount = skills.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStatusColor = (status: Skill['status']) => {
    switch (status) {
      case 'completed': return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      case 'in-progress': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
      case 'upcoming': return 'text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: Skill['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-6 h-6 text-[#10b981]" />;
      case 'in-progress': return <PlayCircle className="w-6 h-6 text-[#f59e0b]" />;
      case 'upcoming': return <Circle className="w-6 h-6 text-[#14b8a6]" />;
      default: return <Lock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1>AI Learning Agent</h1>
          <p className="text-muted-foreground mt-1">
            Build your custom educational path with Google Gemini
          </p>
        </div>
        <BrainCircuit className="w-10 h-10 text-[#4338ca] opacity-50" />
      </div>

      {/* Generation Form */}
      <Card className="border-dashed border-2 border-[#4338ca]/30 bg-[#4338ca]/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4338ca]" />
            What do you want to master today?
          </CardTitle>
          <CardDescription>
            Our AI agent will design a professional curriculum tailored to your goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Topic or Career Goal</Label>
              <Input
                placeholder="e.g. Fullstack Web Dev, Data Science, Python for Bio"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Path Duration (Weeks)</Label>
              <Input
                type="number"
                min="1"
                max="52"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Study Time (Hours/Week)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full bg-[#4338ca] hover:bg-[#4338ca]/90 h-11"
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Designing your curriculum...
              </>
            ) : (
              <>
                Generate Personalized Learning Path
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* All Paths Selection */}
      {allPaths.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-[#4338ca]" />
              My Learning Journeys
            </h2>
            <Badge variant="outline" className="text-[#4338ca] border-[#4338ca]/30">
              {allPaths.length} Plans Available
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPaths.map((path) => (
              <Card
                key={path.id}
                className={`transition-all border-2 cursor-pointer hover:shadow-md ${path.id === currentPathId
                  ? 'border-[#4338ca] bg-[#4338ca]/5 shadow-sm'
                  : 'border-border'
                  }`}
                onClick={() => onSwitchPath(path.id)}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold truncate">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-1 text-xs">{path.description}</CardDescription>
                  </div>
                  {path.id === currentPathId && (
                    <Badge className="bg-[#4338ca] text-white text-[10px] h-5">ACTIVE</Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Badge variant="outline" className="capitalize text-[10px] h-5">{path.difficulty}</Badge>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {path.modules?.length || 0} Modules
                      </span>
                    </div>
                    {path.id !== currentPathId && (
                      <span className="text-[#4338ca] font-medium hover:underline text-[10px]">
                        Switch Goal
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <>
          <div className="pt-4 pb-2 border-b">
            <h2 className="text-3xl font-bold">Your Current Path</h2>
          </div>
          {/* Progress Overview */}
          <Card className="border-[#4338ca]/20 shadow-md">
            <CardHeader>
              <CardTitle>Path Progress</CardTitle>
              <CardDescription>
                Track your journey through the complete learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold">{progressPercentage}% Complete</p>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} of {totalCount} skills mastered
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20">
                      {completedCount} Completed
                    </Badge>
                    <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
                      {skills.filter(s => s.status === 'in-progress').length} In Progress
                    </Badge>
                    <Badge className="bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20">
                      {skills.filter(s => s.status === 'upcoming').length} Upcoming
                    </Badge>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="mb-4 text-2xl font-bold">{category}</h2>
                <div className="space-y-4">
                  {categorySkills.map((skill, index) => (
                    <div key={skill.id} className="flex gap-3 md:gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center ${skill.status === 'completed'
                          ? 'border-[#10b981] bg-[#10b981]/10'
                          : skill.status === 'in-progress'
                            ? 'border-[#f59e0b] bg-[#f59e0b]/10'
                            : skill.status === 'upcoming'
                              ? 'border-[#14b8a6] bg-[#14b8a6]/10'
                              : 'border-border bg-muted'
                          }`}>
                          {getStatusIcon(skill.status)}
                        </div>
                        {index < categorySkills.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-12 mt-2 ${skill.status === 'completed'
                            ? 'bg-[#10b981]'
                            : 'bg-border'
                            }`} />
                        )}
                      </div>

                      {/* Skill Card */}
                      <Card className={`flex-1 mb-4 border-2 transition-all hover:shadow-md cursor-pointer ${skill.status === 'completed'
                        ? 'border-[#10b981]/20'
                        : skill.status === 'in-progress'
                          ? 'border-[#f59e0b]/20'
                          : skill.status === 'upcoming'
                            ? 'border-[#14b8a6]/20'
                            : 'border-border'
                        }`}
                        onClick={() => onSkillClick(skill.id)}
                      >
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                {skill.title}
                                {skill.status === 'completed' && (
                                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#10b981] flex-shrink-0" />
                                )}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {skill.description.includes('#') || skill.description.length > 200
                                  ? skill.description.replace(/#[^\n]*\n/g, '').split('\n\n')[0].slice(0, 150) + '...'
                                  : skill.description}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(skill.status)}>
                              {skill.status === 'in-progress' ? 'In Progress' :
                                skill.status === 'completed' ? 'Completed' :
                                  skill.status === 'upcoming' ? 'Upcoming' : 'Locked'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 md:gap-4 text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {skill.estimatedTime}
                              </span>
                              <Badge variant="outline">{skill.difficulty}</Badge>
                            </div>
                            <Button
                              variant={skill.status === 'in-progress' ? 'default' : 'outline'}
                              size="sm"
                              className={skill.status === 'in-progress' ? 'bg-[#4338ca] hover:bg-[#4338ca]/90' : ''}
                            >
                              {skill.status === 'completed' ? 'Review' :
                                skill.status === 'in-progress' ? 'Continue' :
                                  skill.status === 'upcoming' ? 'Preview' : 'View'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                          {skill.prerequisites.length > 0 && (
                            <div className="mt-3 text-xs md:text-sm text-muted-foreground">
                              Prerequisites: {skill.prerequisites.join(', ')}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {skills.length === 0 && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <p>No learning path yet. Use the agent above to get started!</p>
        </div>
      )}
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle2, Circle, Lock, Clock, 
  ArrowRight, PlayCircle 
} from 'lucide-react';
import { Skill } from '../types/learning';

interface LearningPathViewProps {
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
}

export function LearningPathView({ skills, onSkillClick }: LearningPathViewProps) {
  const completedCount = skills.filter(s => s.status === 'completed').length;
  const totalCount = skills.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getStatusColor = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      case 'in-progress':
        return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
      case 'upcoming':
        return 'text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-[#10b981]" />;
      case 'in-progress':
        return <PlayCircle className="w-6 h-6 text-[#f59e0b]" />;
      case 'upcoming':
        return <Circle className="w-6 h-6 text-[#14b8a6]" />;
      default:
        return <Lock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1>Your Learning Path</h1>
        <p className="text-muted-foreground mt-1">
          Frontend Development - Beginner Track
        </p>
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
            <h2 className="mb-4">{category}</h2>
            <div className="space-y-4">
              {categorySkills.map((skill, index) => (
                <div key={skill.id} className="flex gap-3 md:gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center ${
                      skill.status === 'completed' 
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
                      <div className={`w-0.5 flex-1 min-h-12 mt-2 ${
                        skill.status === 'completed' 
                          ? 'bg-[#10b981]' 
                          : 'bg-border'
                      }`} />
                    )}
                  </div>

                  {/* Skill Card */}
                  <Card className={`flex-1 mb-4 border-2 transition-all hover:shadow-md cursor-pointer ${
                    skill.status === 'completed' 
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
                            {skill.description}
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
    </div>
  );
}
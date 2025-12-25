import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Sparkles, TrendingUp, Clock, ArrowRight,
  Lightbulb, Users, Target
} from 'lucide-react';
import { Skill, Recommendation, UserProgress } from '../types/learning';

interface RecommendationsViewProps {
  skills: Skill[];
  recommendations: Recommendation[];
  onSkillClick: (skillId: string) => void;
  userProgress: UserProgress;
}

export function RecommendationsView({ 
  skills, 
  recommendations, 
  onSkillClick,
  userProgress
}: RecommendationsViewProps) {
  const getRecommendedSkill = (skillId: string) => {
    return skills.find(s => s.id === skillId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'medium':
        return 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1>Recommended Next</h1>
        <p className="text-muted-foreground mt-1">
          Personalized suggestions based on your progress and learning style
        </p>
      </div>

      {/* Top Recommendations */}
      <Card className="border-[#4338ca]/20 shadow-md bg-gradient-to-br from-[#4338ca]/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4338ca]" />
            <CardTitle>Top Picks for You</CardTitle>
          </div>
          <CardDescription>
            Skills that build on what you've already learned
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => {
            const skill = getRecommendedSkill(rec.skillId);
            if (!skill) return null;

            return (
              <Card key={rec.skillId} className="border-2 hover:border-[#4338ca]/50 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{skill.title}</CardTitle>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <CardDescription>{skill.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {skill.estimatedTime}
                        </span>
                        <Badge variant="outline">{skill.category}</Badge>
                        <Badge variant="outline">{skill.difficulty}</Badge>
                      </div>
                      <Button 
                        onClick={() => onSkillClick(skill.id)}
                        className="bg-[#4338ca] hover:bg-[#4338ca]/90"
                      >
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Why These Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#10b981]/10">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
              </div>
              <CardTitle className="text-base">Builds on Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              These skills naturally follow from what you've already mastered, creating a logical progression.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#14b8a6]/10">
                <Users className="w-5 h-5 text-[#14b8a6]" />
              </div>
              <CardTitle className="text-base">Popular Path</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Most learners in your path choose these skills next, with high success rates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#7c3aed]/10">
                <Target className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <CardTitle className="text-base">Career Aligned</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recommended based on your career goal and current market demands.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Paths */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Alternative Paths</CardTitle>
          <CardDescription>
            Branch out and explore related skills that complement your learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skills.filter(s => s.status === 'upcoming').slice(0, 3).map((skill) => (
              <button
                key={skill.id}
                onClick={() => onSkillClick(skill.id)}
                className="w-full p-4 rounded-lg border border-border hover:border-[#14b8a6]/50 hover:bg-accent transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{skill.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {skill.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {skill.estimatedTime}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-4 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card className="bg-gradient-to-br from-[#14b8a6]/5 to-transparent border-[#14b8a6]/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#14b8a6]" />
            <CardTitle>Personalized Learning Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-card rounded-lg border border-border">
            <p className="font-medium mb-1">🎯 Focus on Fundamentals</p>
            <p className="text-sm text-muted-foreground">
              You're doing great with the basics! Make sure to practice regularly to solidify your understanding.
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border">
            <p className="font-medium mb-1">⏰ Consistency is Key</p>
            <p className="text-sm text-muted-foreground">
              Your {userProgress.weeklyStreak}-day streak is impressive! Try to maintain this momentum.
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border">
            <p className="font-medium mb-1">🚀 Ready for Advanced Topics</p>
            <p className="text-sm text-muted-foreground">
              Based on your progress, you're ready to tackle more advanced concepts. Consider starting TypeScript or State Management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
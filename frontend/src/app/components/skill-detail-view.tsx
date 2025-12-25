import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Clock, CheckCircle2, ArrowLeft, BookOpen, 
  Video, FileText, Code, ExternalLink 
} from 'lucide-react';
import { Skill } from '../types/learning';

interface SkillDetailViewProps {
  skill: Skill;
  onBack: () => void;
  onUpdateStatus: (skillId: string, status: 'in-progress' | 'completed') => void;
}

export function SkillDetailView({ skill, onBack, onUpdateStatus }: SkillDetailViewProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'practice':
        return <Code className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
      case 'in-progress':
        return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'upcoming':
        return 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning Path
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1>{skill.title}</h1>
            <p className="text-muted-foreground mt-1">
              {skill.description}
            </p>
          </div>
          <Badge className={getStatusColor(skill.status)}>
            {skill.status === 'in-progress' ? 'In Progress' : 
             skill.status === 'completed' ? 'Completed' :
             skill.status === 'upcoming' ? 'Upcoming' : 'Locked'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4">
          <span className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
            <Clock className="w-4 h-4" />
            {skill.estimatedTime}
          </span>
          <Badge variant="outline">{skill.category}</Badge>
          <Badge variant="outline">{skill.difficulty}</Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {skill.status === 'upcoming' && (
          <Button 
            onClick={() => onUpdateStatus(skill.id, 'in-progress')}
            className="bg-[#4338ca] hover:bg-[#4338ca]/90"
          >
            Start Learning
          </Button>
        )}
        {skill.status === 'in-progress' && (
          <>
            <Button 
              onClick={() => onUpdateStatus(skill.id, 'completed')}
              className="bg-[#10b981] hover:bg-[#10b981]/90"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
            <Button variant="outline">Continue Learning</Button>
          </>
        )}
        {skill.status === 'completed' && (
          <Button variant="outline">
            Review This Skill
          </Button>
        )}
      </div>

      {/* Why It Matters */}
      <Card>
        <CardHeader>
          <CardTitle>Why This Skill Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {skill.whyItMatters}
          </p>
        </CardContent>
      </Card>

      {/* What You'll Learn */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {skill.whatYouLearn.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {skill.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>
              Skills you should complete before starting this one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skill.prerequisites.map((prereq) => (
                <Badge key={prereq} variant="outline" className="px-3 py-1">
                  {prereq}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Curated Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Curated Learning Resources</CardTitle>
          <CardDescription>
            Hand-picked materials to help you master this skill
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skill.resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-[#4338ca]/50 hover:bg-accent transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-muted">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{resource.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                      {resource.duration && (
                        <span className="text-sm text-muted-foreground">
                          {resource.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Tasks */}
      <Card className="border-[#14b8a6]/20 bg-[#14b8a6]/5">
        <CardHeader>
          <CardTitle>Practice Makes Perfect</CardTitle>
          <CardDescription>
            Hands-on exercises to reinforce your learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-medium mb-2">Build a practical project</p>
              <p className="text-sm text-muted-foreground">
                Apply what you've learned by building a real-world project from scratch.
              </p>
              <Button variant="outline" className="mt-3" size="sm">
                Start Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
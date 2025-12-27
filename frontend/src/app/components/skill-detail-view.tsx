import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Clock, CheckCircle2, ArrowLeft, BookOpen,
  Video, FileText, Code, ExternalLink, Loader2
} from 'lucide-react';
import { Skill } from '../types/learning';

interface SkillDetailViewProps {
  skill: Skill;
  onBack: () => void;
  onUpdateStatus: (skillId: string, status: 'in-progress' | 'completed') => void;
  onRefresh?: () => void;
  onNavigate: (view: string) => void;
}

export function SkillDetailView({ skill, onBack, onUpdateStatus, onRefresh, onNavigate }: SkillDetailViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(skill.description);
  const [whyItMatters, setWhyItMatters] = useState(skill.whyItMatters);
  const [whatYouLearn, setWhatYouLearn] = useState(skill.whatYouLearn);
  const [resources, setResources] = useState(skill.resources);

  useEffect(() => {
    // Sync with prop when skill ID changes
    setAiContent(skill.description);
    setWhyItMatters(skill.whyItMatters);
    setWhatYouLearn(skill.whatYouLearn);
    setResources(skill.resources);

    const description = skill.description?.trim() || '';
    // A robust check for placeholders or incomplete content
    const isPlaceholder = !description ||
      description.length < 200 ||
      !description.includes('#') ||
      description.toLowerCase().includes('specific learning objectives');

    if (isPlaceholder && !isGenerating) {
      console.log('Detected placeholder content, triggering auto-generation...');
      generateDeepDive();
    }
  }, [skill.id]);

  const generateDeepDive = async () => {
    setIsGenerating(true);
    try {
      const data = await apiFetch(`/ai/generate-lesson-content`, {
        method: 'POST',
        body: JSON.stringify({ lesson_id: parseInt(skill.id) })
      });
      setAiContent(data.content);
      if (data.why_it_matters) setWhyItMatters(data.why_it_matters);
      if (data.what_you_learn) setWhatYouLearn(data.what_you_learn);
      if (data.resources) {
        setResources(data.resources.map((r: any, idx: number) => ({
          id: `ai-res-${skill.id}-${idx}`,
          title: r.title,
          type: r.type,
          url: r.url,
          duration: r.duration
        })));
      }
      if (onRefresh) onRefresh();
      toast.success('Agent generated complete skill package! 🚀');
    } catch (error: any) {
      toast.error('Failed to generate study notes');
    } finally {
      setIsGenerating(false);
    }
  };

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
            {!aiContent && <p className="text-muted-foreground mt-1">{skill.description}</p>}
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
          <Button
            onClick={() => onUpdateStatus(skill.id, 'completed')}
            className="bg-[#10b981] hover:bg-[#10b981]/90"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        )}
        {skill.status === 'completed' && (
          <Button
            onClick={() => onUpdateStatus(skill.id, 'in-progress')}
            variant="outline"
            className="border-[#4338ca] text-[#4338ca] hover:bg-[#4338ca]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Revisit Lesson
          </Button>
        )}
      </div>

      {/* AI Deep Dive Notes */}
      {(aiContent || isGenerating) && (
        <Card className="border-[#4338ca]/30 bg-[#4338ca]/5 shadow-inner">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4338ca]" />
              Agent's Deep Dive Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="space-y-4 py-8 flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-[#4338ca] animate-spin" />
                <p className="text-muted-foreground animate-pulse">Our agent is analyzing the topic and writing comprehensive notes...</p>
              </div>
            ) : (
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-2xl font-bold mb-4 text-slate-950 dark:text-purple-300" {...props} />,
                    h2: (props) => <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-purple-200" {...props} />,
                    h3: (props) => <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-purple-100" {...props} />,
                    p: (props) => <p className="mb-4 text-slate-900 dark:text-slate-300 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside mb-4 text-slate-900 dark:text-slate-300" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside mb-4 text-slate-900 dark:text-slate-300" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => <strong className="text-black dark:text-white font-bold" {...props} />,
                    code: ({ className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !match ? (
                        <code className="px-1.5 py-0.5 rounded text-sm text-slate-900 dark:text-purple-200 font-mono bg-slate-200/50 dark:bg-purple-900/30" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      );
                    },
                    pre: (props) => (
                      <pre className="bg-white/60 dark:bg-black/90 p-4 rounded-lg mb-4 overflow-x-auto border border-slate-200 dark:border-slate-700/50 text-black dark:text-white" {...props} />
                    ),
                  }}
                >
                  {aiContent || ''}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Why It Matters */}
      <Card>
        <CardHeader>
          <CardTitle>Why This Skill Matters</CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="w-4 h-4 text-[#4338ca] animate-spin" />
              <p className="text-muted-foreground animate-pulse text-sm">Agent is researching the industry impact...</p>
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {whyItMatters}
            </p>
          )}
        </CardContent>
      </Card>

      {/* What You'll Learn */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Learn</CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-5 h-5 rounded-full bg-muted" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2 italic">Identifying key learning objectives...</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {whatYouLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}
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
            {isGenerating ? (
              <div className="space-y-3 py-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border animate-pulse">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted w-8 h-8" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center animate-pulse">Agent is curating professional resources for you...</p>
              </div>
            ) : (
              <>
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-[#4338ca]/50 hover:bg-accent transition-all cursor-pointer"
                    onClick={() => window.open(resource.url, '_blank')}
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
                {resources.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No specific resources found yet.</p>
                )}
              </>
            )}
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
              <Button onClick={() => onNavigate('projects')} variant="outline" className="mt-3" size="sm">
                Start Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

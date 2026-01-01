import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import {
  Monitor, Server, Layers, Database, Brain, Cloud,
  Smartphone, GitBranch, ArrowRight, ArrowLeft, Sparkles, Loader2
} from 'lucide-react';
import { careerGoals, levelOptions, timeCommitmentOptions } from '../data/mockData';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  careerGoal: string;
  level: string;
  weeklyHours: string;
}

const iconMap: Record<string, any> = {
  Monitor, Server, Layers, Database, Brain, Cloud, Smartphone, GitBranch
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    careerGoal: '',
    level: '',
    weeklyHours: ''
  });

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setIsGenerating(true);
      try {
        const user = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
        if (!user.id) throw new Error('User not found');

        // 1. Update Profile Background
        await apiFetch('/users/profile/update', {
          method: 'PUT',
          body: JSON.stringify({
            career_goal: data.careerGoal,
            experience_level: data.level,
            weekly_hours: data.weeklyHours
          })
        });

        // 2. Mark onboarding as complete and trigger AI path generation
        const goalLabel = careerGoals.find(g => g.id === data.careerGoal)?.label || data.careerGoal;
        await apiFetch(`/users/${user.id}/complete-onboarding`, {
          method: 'PATCH'
        });

        toast.success(`Agent successfully designed your ${goalLabel} path! 🚀`);
        onComplete(data);
      } catch (error: any) {
        console.error('Onboarding Error:', error);
        toast.error(error.message || 'Failed to initialize your learning journey');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 0) return data.careerGoal !== '';
    if (step === 1) return data.level !== '';
    if (step === 2) return data.weeklyHours !== '';
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4338ca] via-[#7c3aed] to-[#4338ca] flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-[#4338ca]" />
            <CardTitle>Welcome to Your Learning Journey</CardTitle>
          </div>
          <CardDescription>
            Let's personalize your learning path in just a few steps
          </CardDescription>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">
            {isGenerating ? 'AI Agent is crafting your path...' : `Step ${step + 1} of ${totalSteps}`}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Career Goal */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2">What's your career goal?</h3>
                <p className="text-muted-foreground mb-6">
                  Choose the path that aligns with your aspirations
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {careerGoals.map((goal) => {
                  const Icon = iconMap[goal.icon];
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setData({ ...data, careerGoal: goal.id })}
                      className={`p-4 rounded-lg border-2 transition-all hover:border-[#4338ca] hover:shadow-md ${data.careerGoal === goal.id
                        ? 'border-[#4338ca] bg-[#4338ca]/5 shadow-md'
                        : 'border-border'
                        }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${data.careerGoal === goal.id ? 'text-[#4338ca]' : 'text-muted-foreground'
                        }`} />
                      <p className="text-sm text-center">{goal.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Experience Level */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2">What's your current level?</h3>
                <p className="text-muted-foreground mb-6">
                  Help us tailor the path to your experience
                </p>
              </div>
              <div className="space-y-3">
                {levelOptions.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setData({ ...data, level: level.id })}
                    className={`w-full p-4 rounded-lg border-2 transition-all hover:border-[#4338ca] hover:shadow-md text-left ${data.level === level.id
                      ? 'border-[#4338ca] bg-[#4338ca]/5 shadow-md'
                      : 'border-border'
                      }`}
                  >
                    <p className="font-medium">{level.label}</p>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time Commitment */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2">How much time can you commit?</h3>
                <p className="text-muted-foreground mb-6">
                  We'll adjust your learning pace accordingly
                </p>
              </div>
              <div className="space-y-3">
                {timeCommitmentOptions.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setData({ ...data, weeklyHours: time.id })}
                    className={`w-full p-4 rounded-lg border-2 transition-all hover:border-[#4338ca] hover:shadow-md text-left ${data.weeklyHours === time.id
                      ? 'border-[#4338ca] bg-[#4338ca]/5 shadow-md'
                      : 'border-border'
                      }`}
                  >
                    <p className="font-medium">{time.label}</p>
                    <p className="text-sm text-muted-foreground">{time.description}</p>
                  </button>
                ))}
              </div>

              {data.weeklyHours && (
                <div className="mt-6 p-6 bg-[#4338ca]/5 border border-[#4338ca]/20 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className="w-20 h-20" />
                  </div>
                  <h4 className="flex items-center gap-2 text-[#4338ca] mb-3 font-semibold">
                    <Sparkles className="w-5 h-5" />
                    Custom Path Request
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-foreground">
                      Goal: {careerGoals.find(g => g.id === data.careerGoal)?.label}
                    </p>
                    <p className="text-muted-foreground">
                      Level: <span className="capitalize">{data.level}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Commitment: {timeCommitmentOptions.find(t => t.id === data.weeklyHours)?.label}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#4338ca]/10">
                    <p className="text-xs text-muted-foreground italic">
                      "Our AI Agent will now analyze your profile and design a pedagogical curriculum from foundation to frameworks specifically for you."
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isGenerating}
              className="bg-[#4338ca] hover:bg-[#4338ca]/90 min-w-[120px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Building...
                </>
              ) : step === totalSteps - 1 ? (
                'Start Learning Path'
              ) : (
                'Next'
              )}
              {!isGenerating && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

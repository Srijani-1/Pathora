import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { 
  Monitor, Server, Layers, Database, Brain, Cloud, 
  Smartphone, GitBranch, ArrowRight, ArrowLeft, Sparkles 
} from 'lucide-react';
import { careerGoals, levelOptions, timeCommitmentOptions } from '../data/mockData';

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

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
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
            Step {step + 1} of {totalSteps}
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
                      className={`p-4 rounded-lg border-2 transition-all hover:border-[#4338ca] hover:shadow-md ${
                        data.careerGoal === goal.id
                          ? 'border-[#4338ca] bg-[#4338ca]/5 shadow-md'
                          : 'border-border'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        data.careerGoal === goal.id ? 'text-[#4338ca]' : 'text-muted-foreground'
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
                    className={`w-full p-4 rounded-lg border-2 transition-all hover:border-[#4338ca] hover:shadow-md text-left ${
                      data.level === level.id
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
                    className={`w-full p-4 rounded-lg border-2 transition-all hover:border-[#4338ca] hover:shadow-md text-left ${
                      data.weeklyHours === time.id
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
                <div className="mt-6 p-4 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-lg">
                  <h4 className="flex items-center gap-2 text-[#14b8a6] mb-2">
                    <Sparkles className="w-4 h-4" />
                    Preview: Your Learning Path
                  </h4>
                  <p className="text-sm mb-2">Frontend Development Path - Beginner</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 12 skills to master</li>
                    <li>• Estimated completion: 16 weeks</li>
                    <li>• Starting with HTML & CSS Fundamentals</li>
                  </ul>
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
              disabled={!canProceed()}
              className="bg-[#4338ca] hover:bg-[#4338ca]/90"
            >
              {step === totalSteps - 1 ? 'Start Learning Path' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

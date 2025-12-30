import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';
import { BrainCircuit, Loader2, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
}

interface QuizData {
    title: string;
    questions: QuizQuestion[];
}

export function QuizView() {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [questionCount, setQuestionCount] = useState('5');
    const [isGenerating, setIsGenerating] = useState(false);

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async () => {
        if (!topic) {
            toast.error('Please enter a topic');
            return;
        }

        setIsGenerating(true);
        setQuizData(null);
        setShowResults(false);
        setScore(0);
        setCurrentQuestionIndex(0);

        try {
            const data = await apiFetch('/ai/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    difficulty,
                    question_count: parseInt(questionCount)
                })
            });
            setQuizData(data);
            toast.success('Quiz generated! Good luck!');
        } catch (error) {
            toast.error('Failed to generate quiz');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleSubmitAnswer = () => {
        if (selectedOption === null || !quizData) return;

        setIsAnswered(true);
        const correctInfo = quizData.questions[currentQuestionIndex].correct_index;
        if (selectedOption === correctInfo) {
            setScore(s => s + 1);
            // toast.success('Correct!', { duration: 1000 });
        } else {
            // toast.error('Incorrect', { duration: 1000 });
        }
    };

    const handleNextQuestion = () => {
        if (!quizData) return;

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const handleRestart = () => {
        setQuizData(null);
        setTopic('');
        setShowResults(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        setIsAnswered(false);
        setSelectedOption(null);
    };

    // 1. Setup/Config View
    if (!quizData) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Skill Assessment</h1>
                    <p className="text-muted-foreground mt-1">
                        Test your knowledge with AI-generated quizzes tailored to any topic.
                    </p>
                </div>

                <Card className="border-dashed border-2 border-[#4338ca]/30 bg-[#4338ca]/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-[#4338ca]" />
                            Generate New Quiz
                        </CardTitle>
                        <CardDescription>
                            Define your parameters and let our agent create a challenge for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Topic</Label>
                            <Input
                                placeholder="e.g., React Hooks, Python Data Structures, World History"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={difficulty} onValueChange={setDifficulty}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Questions</Label>
                                <Select value={questionCount} onValueChange={setQuestionCount}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3 Questions</SelectItem>
                                        <SelectItem value="5">5 Questions</SelectItem>
                                        <SelectItem value="10">10 Questions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-[#4338ca] hover:bg-[#4338ca]/90 mt-2"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Challenge...
                                </>
                            ) : (
                                'Start Quiz'
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2. Results View
    if (showResults) {
        const percentage = Math.round((score / quizData.questions.length) * 100);
        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
                <Card className="border-[#4338ca]/20 shadow-lg">
                    <CardHeader>
                        <div className="w-20 h-20 bg-[#4338ca]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-[#4338ca]" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
                        <CardDescription>Here's how you performed on {quizData.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-6xl font-bold text-[#4338ca]">
                            {percentage}%
                        </div>
                        <p className="text-lg text-muted-foreground">
                            You answered {score} out of {quizData.questions.length} questions correctly.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Button onClick={() => {
                                setQuizData(null); // Keep topic, let them retry settings
                                setShowResults(false);
                                setScore(0);
                                setCurrentQuestionIndex(0);
                            }} variant="outline">
                                Configure New Quiz
                            </Button>
                            <Button onClick={handleRestart} className="bg-[#4338ca]">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Take Another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 3. Taking Quiz View
    const currentQ = quizData.questions[currentQuestionIndex];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{quizData.title}</h2>
                <Badge variant="outline">
                    Question {currentQuestionIndex + 1} of {quizData.questions.length}
                </Badge>
            </div>

            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                    className="bg-[#4338ca] h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex) / quizData.questions.length) * 100}%` }}
                />
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl leading-relaxed">
                        {currentQ.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {currentQ.options.map((option, idx) => {
                        let itemClass = "p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent ";

                        if (isAnswered) {
                            if (idx === currentQ.correct_index) {
                                // Correct answer
                                itemClass += "border-[#10b981] bg-[#10b981]/10 text-[#10b981]";
                            } else if (idx === selectedOption) {
                                // Wrong selection
                                itemClass += "border-red-500 bg-red-500/10 text-red-500";
                            } else {
                                itemClass += "border-border opacity-50";
                            }
                        } else {
                            if (idx === selectedOption) {
                                itemClass += "border-[#4338ca] bg-[#4338ca]/5";
                            } else {
                                itemClass += "border-muted-foreground/20";
                            }
                        }

                        return (
                            <div
                                key={idx}
                                className={itemClass}
                                onClick={() => handleOptionSelect(idx)}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {isAnswered && idx === currentQ.correct_index && <CheckCircle2 className="w-5 h-5" />}
                                    {isAnswered && idx === selectedOption && idx !== currentQ.correct_index && <XCircle className="w-5 h-5" />}
                                </div>
                            </div>
                        );
                    })}

                    {isAnswered && (
                        <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                            <span className="font-semibold block mb-1">Explanation:</span>
                            {currentQ.explanation}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                    {!isAnswered ? (
                        <Button
                            onClick={handleSubmitAnswer}
                            disabled={selectedOption === null}
                            className="bg-[#4338ca] hover:bg-[#4338ca]/90"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button onClick={handleNextQuestion}>
                            {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Show Results'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

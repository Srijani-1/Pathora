"use client";
import { Button } from "../ui/button";

interface WelcomePageProps {
  onFinish: () => void;
}

export default function WelcomePage({ onFinish }: WelcomePageProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-950 overflow-hidden">
      {/* Soft color partitions */}
      <div className="absolute inset-0">
        <div className="absolute -bottom-64 w-[220%] h-[300px] bg-gradient-to-r from-indigo-800 via-blue-800 to-purple-800 rounded-full opacity-60 blur-lg animate-wave-slow"></div>
        <div className="absolute -top-64 w-[250%] h-[300px] bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 rounded-full opacity-50 blur-xl animate-wave-medium"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          Welcome to LearnPath
        </h1>
        <p className="text-white/80 text-lg md:text-xl mb-8 drop-shadow-md">
          Your personalized learning journey starts here. Track skills, projects, and progress seamlessly.
        </p>
        <Button
          className="bg-indigo-600 hover:bg-indigo-500/90 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:scale-105"
          onClick={onFinish}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

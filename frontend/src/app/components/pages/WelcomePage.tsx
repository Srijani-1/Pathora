"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { LampContainer } from "../ui/lamp";
import { Target, Flame, Clock, Trophy, CheckCircle2, Route, BarChart3 } from "lucide-react";

interface WelcomePageProps {
  onFinish: () => void;
}

export default function WelcomePage({ onFinish }: WelcomePageProps) {
  return (
    <div className="relative bg-slate-950 text-white overflow-hidden">
      {/* ================= WELCOME HERO ================= */}
      <section className="min-h-screen flex flex-col justify-center items-center relative">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.4, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center relative z-10 max-w-5xl px-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Welcome to Pathora
            </h1>

            <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-white/70">
              A platform built to bring clarity, structure, and confidence to your learning journey.
            </p>

            <p className="mt-12 text-base md:text-lg text-cyan-300/80 font-medium">
              Structured paths • Real progress • No more guessing what to learn next
            </p>

          </motion.div>
        </LampContainer>
      </section>

      {/* ================= VALUE HERO ================= */}
      <section className="py-20 md:py-32 flex items-center justify-center px-6 -mt-16 md:-mt-24">
        <motion.div
          className="max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Learn with clarity.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
              Grow with direction.
            </span>
          </h2>

          <p className="mt-8 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Pathora helps you identify the right skills, follow structured learning paths,
            and track your progress — without confusion.
          </p>

          <Button
            className="mt-12 bg-blue-600 hover:bg-blue-500 px-12 py-6 text-lg rounded-full shadow-2xl shadow-blue-600/30"
            onClick={onFinish}
          >
            Start Your Learning Journey
          </Button>
        </motion.div>
      </section>

      {/* ================= PROGRESS PREVIEW ================= */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold">
              See Your Growth, Every Day
            </h3>
            <p className="mt-4 text-xl text-white/70 max-w-2xl mx-auto">
              Beautiful dashboard with streaks, milestones, progress tracking, and achievements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-blue-500/40 transition-all"
            >
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold">Overall Progress</h4>
              <p className="mt-3 text-white/60">Visualize your journey across all skills</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-orange-500/40 transition-all"
            >
              <Flame className="w-10 h-10 text-orange-400 mb-4" />
              <h4 className="text-xl font-semibold">Daily Streaks</h4>
              <p className="mt-3 text-white/60">Stay motivated with consistent learning</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-green-500/40 transition-all"
            >
              <Clock className="w-10 h-10 text-green-400 mb-4" />
              <h4 className="text-xl font-semibold">Time Invested</h4>
              <p className="mt-3 text-white/60">Track hours and weekly goals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-purple-500/40 transition-all"
            >
              <Trophy className="w-10 h-10 text-purple-400 mb-4" />
              <h4 className="text-xl font-semibold">Milestones & Rewards</h4>
              <p className="mt-3 text-white/60">Celebrate every achievement</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= HOW PATHORA WORKS - EQUAL SQUARE CARDS (FIXED SIZE) ================= */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-16">
            How Pathora Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: <Target className="w-16 h-16" />,
                title: "Define Your Goal",
                desc: "Pick a career path or skill area — from backend development to design, AI, and more.",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: <Route className="w-16 h-16" />,
                title: "Follow a Clear Path",
                desc: "Get a step-by-step roadmap with curated skills, resources, and weekly structure.",
                color: "from-purple-500 to-pink-400",
              },
              {
                icon: <BarChart3 className="w-16 h-16" />,
                title: "Track & Celebrate Progress",
                desc: "See streaks, milestones, time invested, and unlock achievements as you grow.",
                color: "from-green-500 to-emerald-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="mx-auto"
              >
                <div className="
                  aspect-square max-w-xs w-full rounded-3xl p-6 md:p-8
                  bg-gradient-to-br from-white/5 to-white/10
                  border border-white/10 backdrop-blur-sm
                  hover:border-white/30 hover:scale-[1.04]
                  transition-all duration-500
                  flex flex-col justify-between items-center text-center
                ">
                  <div className="flex flex-col items-center flex-grow">
                    <div className={`inline-block p-5 rounded-3xl bg-gradient-to-br ${item.color} mb-6 text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h4>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed px-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-sm text-white/50">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Structured • Motivating • Clear
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

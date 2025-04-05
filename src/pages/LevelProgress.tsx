
import Layout from "../components/Layout";
import LevelProgress from "../components/LevelProgress";
import { Sparkles, Brain, HeartPulse, Medal } from "lucide-react";

const LevelProgressPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Cognitive Progress
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your mental wellness journey, earn achievements, and unlock new levels
            by engaging with Rimuru's features.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-4 rounded-xl border border-blue-800/30 backdrop-blur-sm">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-blue-400">Mental Fitness</h3>
              <p className="text-sm text-gray-400">Build cognitive strength through regular brain exercises and challenges</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 p-4 rounded-xl border border-purple-800/30 backdrop-blur-sm">
              <HeartPulse className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-purple-400">Emotional Wellbeing</h3>
              <p className="text-sm text-gray-400">Develop emotional resilience with guided relaxation and mindfulness</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-4 rounded-xl border border-emerald-800/30 backdrop-blur-sm">
              <Medal className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-emerald-400">Achievement System</h3>
              <p className="text-sm text-gray-400">Unlock rewards and track progress on your wellness journey</p>
            </div>
          </div>
        </div>

        <LevelProgress />
      </div>
    </Layout>
  );
};

export default LevelProgressPage;

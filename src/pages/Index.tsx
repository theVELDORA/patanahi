
import { Link } from "react-router-dom";
import { MessageCircle, GamepadIcon, Music, Mic, Brain, Award, Heart, BookOpen, Sparkles, Flower2, PlayCircle, CheckCircle, RefreshCw, PieChart } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedLevel = localStorage.getItem("cognitiveLevel");
    const savedXp = localStorage.getItem("cognitiveXp");
    
    if (savedLevel) {
      setLevel(parseInt(savedLevel));
    }
    
    if (savedXp) {
      setXp(parseInt(savedXp));
    }
    
    const xpForNextLevel = (parseInt(savedLevel || "0") + 1) * 100;
    const progressPercent = Math.min(100, Math.round((parseInt(savedXp || "0") / xpForNextLevel) * 100));
    setProgress(progressPercent);
  }, []);

  return (
    <Layout>
      <AnimatedBackground />
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-10 relative z-10">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-display text-center bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Welcome to Cognitive Behavioural Therapy
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your AI companion for mental wellness. Experience personalized support through chat,                                                                      
            engaging games, and peaceful relaxation exercises.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-gray-300 text-sm">Personalized AI Experience</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Cognitive Enhancement</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-gray-300 text-sm">Emotional Support</span>
            </div>
          </div>

          <div className="max-w-md mx-auto mt-8 bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-lg shadow-primary/20">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-gray-300 font-medium">Cognitive Level {level}</span>
              </div>
              <Link to="/level-progress" className="text-primary hover:underline text-sm flex items-center gap-1">
                <Award className="h-4 w-4" />
                View Progress
              </Link>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{xp} XP</span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 w-full max-w-6xl mt-4">
          <Link
            to="/chat"
            className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm p-8 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <MessageCircle size={32} className="text-primary animate-float" />
              </div>
              <h2 className="text-2xl font-display text-gray-200">Chat</h2>
              <p className="text-gray-400 text-center">
                Have therapeutic conversations
              </p>
            </div>
          </Link>
          
          <Link
            to="/games"
            className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm p-8 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <GamepadIcon size={32} className="text-primary animate-float" />
              </div>
              <h2 className="text-2xl font-display text-gray-200">Games</h2>
              <p className="text-gray-400 text-center">
                Enhance cognitive abilities
              </p>
            </div>
          </Link>
          
          <Link
            to="/meditation"
            className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm p-8 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-teal-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="rounded-full bg-teal-500/10 p-4 group-hover:bg-teal-500/20 transition-colors">
                <Flower2 size={32} className="text-teal-400 animate-float" />
              </div>
              <h2 className="text-2xl font-display text-gray-200">Meditate</h2>
              <p className="text-gray-400 text-center">
                Find calm and mental clarity
              </p>
            </div>
          </Link>
          
          <Link
            to="/relax"
            className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm p-8 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Music size={32} className="text-primary animate-float" />
              </div>
              <h2 className="text-2xl font-display text-gray-200">Relax</h2>
              <p className="text-gray-400 text-center">
                Unwind with soothing sounds
              </p>
            </div>
          </Link>
          
          <Link
            to="/talk"
            className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm p-8 border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Mic size={32} className="text-primary animate-float" />
              </div>
              <h2 className="text-2xl font-display text-gray-200">Talk</h2>
              <p className="text-gray-400 text-center">
                Voice conversations with AI
              </p>
            </div>
          </Link>
        </div>
        
        <div className="w-full max-w-6xl bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-display bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
              About Rimuru
            </h2>
            <p className="text-gray-400">Your companion on the journey to mental wellness</p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500">
                  <PlayCircle size={16} />
                  Watch Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Experience Rimuru in Action</DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full bg-black/50 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Rimuru Demo Video"
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                <Brain size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-display text-gray-300 mb-2">Cognitive Enhancement</h3>
              <p className="text-gray-400">
                Train your brain with scientifically designed games and exercises that improve memory, focus, and problem-solving skills.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-purple-500/10 p-4 mb-4">
                <Heart size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-display text-gray-300 mb-2">Emotional Support</h3>
              <p className="text-gray-400">
                Find comfort in meaningful conversations designed to provide empathetic responses and encourage positive thinking patterns.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-teal-500/10 p-4 mb-4">
                <BookOpen size={28} className="text-teal-400" />
              </div>
              <h3 className="text-xl font-display text-gray-300 mb-2">Progress Tracking</h3>
              <p className="text-gray-400">
                Monitor your mental wellness journey with detailed analytics and unlock achievements as you reach new cognitive levels.
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-6xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Modern Cognitive Behavioral Therapy
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Reimagining traditional CBT with AI-powered techniques for personalized mental wellness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-display text-gray-200 flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Evidence-Based Approach
              </h3>
              <p className="text-gray-400 mb-4">
                Our digital CBT methods are built on clinically validated techniques, adapted for the digital age to help identify and reframe negative thought patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  Real-time thought analysis
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  Personalized cognitive exercises
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  Adaptive learning system
                </li>
              </ul>
            </div>
            
            <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-display text-gray-200 flex items-center gap-2 mb-3">
                <RefreshCw className="h-5 w-5 text-blue-400" />
                Continuous Improvement Cycle
              </h3>
              <p className="text-gray-400 mb-4">
                Rather than traditional fixed sessions, our modern approach enables continuous practice and feedback through daily interactions.
              </p>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-32 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Brain className="h-12 w-12 text-blue-400" />
                    </div>
                  </div>
                  <PieChart className="h-48 w-48 text-purple-500/30 absolute inset-0 animate-[spin_20s_linear_infinite]" />
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 p-6 rounded-xl border border-gray-800 md:col-span-2">
              <h3 className="text-xl font-display text-gray-200 mb-3 text-center">The Modern CBT Journey</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="bg-blue-500/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-blue-300">1</span>
                  </div>
                  <h4 className="font-medium text-gray-200 mb-2">Awareness</h4>
                  <p className="text-sm text-gray-400">Mindful recognition of thought patterns through AI-guided exercises</p>
                </div>
                
                <div className="bg-purple-900/20 p-4 rounded-lg text-center">
                  <div className="bg-purple-500/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-purple-300">2</span>
                  </div>
                  <h4 className="font-medium text-gray-200 mb-2">Challenge</h4>
                  <p className="text-sm text-gray-400">Interactive games and conversations that challenge cognitive distortions</p>
                </div>
                
                <div className="bg-teal-900/20 p-4 rounded-lg text-center">
                  <div className="bg-teal-500/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-teal-300">3</span>
                  </div>
                  <h4 className="font-medium text-gray-200 mb-2">Growth</h4>
                  <p className="text-sm text-gray-400">Measurable improvement through personalized adaptive learning</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/chat">
                  <Button className="gap-2">
                    Start Your Journey <Brain className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

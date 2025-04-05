
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Award, Star, Zap, BookOpen, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  requiredLevel: number;
  unlocked: boolean;
}

const LevelProgress = () => {
  // In a real app, this would be stored in a database or localStorage
  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem("cognitiveLevel");
    return savedLevel ? parseInt(savedLevel) : 0;
  });

  const [xp, setXp] = useState(() => {
    const savedXp = localStorage.getItem("cognitiveXp");
    return savedXp ? parseInt(savedXp) : 0;
  });

  // Calculate how much XP is needed for the next level
  const xpForNextLevel = (level + 1) * 100;
  const progress = Math.min(100, Math.round((xp / xpForNextLevel) * 100));

  useEffect(() => {
    localStorage.setItem("cognitiveLevel", level.toString());
    localStorage.setItem("cognitiveXp", xp.toString());
  }, [level, xp]);

  // Achievement data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "sharp-mind",
      name: "Sharp Mind",
      description: "Begin your cognitive journey",
      icon: <Brain className="w-5 h-5 text-blue-400" />,
      requiredLevel: 1,
      unlocked: level >= 1
    },
    {
      id: "quick-thinker",
      name: "Quick Thinker",
      description: "Demonstrate fast cognitive processing",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      requiredLevel: 10,
      unlocked: level >= 10
    },
    {
      id: "deep-focus",
      name: "Deep Focus",
      description: "Achieve sustained concentration",
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      requiredLevel: 25,
      unlocked: level >= 25
    },
    {
      id: "mental-clarity",
      name: "Mental Clarity",
      description: "Reach a state of cognitive clarity",
      icon: <Star className="w-5 h-5 text-amber-400" />,
      requiredLevel: 50,
      unlocked: level >= 50
    },
    {
      id: "mind-master",
      name: "Mind Master",
      description: "Master your cognitive abilities",
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      requiredLevel: 75,
      unlocked: level >= 75
    },
    {
      id: "cognitive-excellence",
      name: "Cognitive Excellence",
      description: "Achieve full cognitive potential",
      icon: <HeartPulse className="w-5 h-5 text-red-400" />,
      requiredLevel: 100,
      unlocked: level >= 100
    }
  ]);

  // Demo function to add XP (just for demonstration)
  const addXp = (amount: number) => {
    const newXp = xp + amount;
    const xpNeeded = xpForNextLevel;
    
    if (newXp >= xpNeeded) {
      // Level up
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(newXp - xpNeeded);
      
      // Check if any achievements are unlocked
      setAchievements(prevAchievements => 
        prevAchievements.map(achievement => {
          if (!achievement.unlocked && newLevel >= achievement.requiredLevel) {
            // Show a notification that achievement is unlocked
            return { ...achievement, unlocked: true };
          }
          return achievement;
        })
      );
    } else {
      setXp(newXp);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-lg shadow-primary/20 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Cognitive Level: {level}</h2>
            <p className="text-gray-400">Progress to next level: {xp}/{xpForNextLevel} XP</p>
          </div>
          <div className="bg-gray-800/50 rounded-full p-3 relative group">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
            <span className="absolute -top-2 -right-2 bg-primary text-xs font-bold text-white rounded-full w-6 h-6 flex items-center justify-center">
              {level}
            </span>
            <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20"></div>
          </div>
        </div>
        
        <div className="mb-4 relative">
          <Progress value={progress} className="h-3 bg-gray-700/50" />
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-lg shadow-primary/20">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`${
                achievement.unlocked 
                  ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-lg shadow-primary/10" 
                  : "bg-gray-900/50 border-gray-800/50 opacity-70"
              } rounded-lg p-4 border transition-all duration-300 hover:transform hover:scale-105`}
            >
              <div className="flex items-start space-x-4">
                <div className={`rounded-full p-3 ${achievement.unlocked ? "bg-gray-800" : "bg-gray-900"}`}>
                  {achievement.icon}
                  {achievement.unlocked && <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-primary"></div>}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-200">{achievement.name}</h3>
                    {achievement.unlocked ? (
                      <Badge className="bg-primary/20 text-primary border-primary/20">Unlocked</Badge>
                    ) : (
                      <Badge className="bg-gray-800 text-gray-400 border-gray-700">Level {achievement.requiredLevel}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Just for demo - buttons to test gaining XP */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-lg shadow-primary/20">
        <h3 className="text-xl font-medium mb-4 text-gray-200">Increase Your Cognitive Level</h3>
        <p className="text-gray-400 mb-4">Use Rimuru's features to increase your cognitive level:</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addXp(25)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60"
          >
            <Brain className="w-4 h-4" /> Play Mind Games
          </button>
          <button
            onClick={() => addXp(15)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60"
          >
            <BookOpen className="w-4 h-4" /> Chat with Rimuru
          </button>
          <button
            onClick={() => addXp(10)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-green-900/40 hover:shadow-green-900/60"
          >
            <HeartPulse className="w-4 h-4" /> Meditation Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;

import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Puzzle, Gamepad, Zap, Timer, Target, Flower2, History, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GameComponent from "../components/GameComponent";
import { useState } from "react";

const Games = () => {
  const navigate = useNavigate();
  const [showCbtInfo, setShowCbtInfo] = useState(false);

  const games = [
    {
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards",
      icon: <Brain className="w-6 h-6" />,
      xpReward: 25,
      gameType: "memory" as const,
      cognitiveMessage: "Memory games strengthen your short-term memory and improve pattern recognition skills. Regular practice can increase attention to detail and visual recognition abilities."
    },
    {
      title: "Speed Puzzle",
      description: "Solve puzzles against the clock",
      icon: <Puzzle className="w-6 h-6" />,
      xpReward: 20,
      gameType: "puzzle" as const,
      cognitiveMessage: "Puzzles enhance problem-solving capabilities and spatial awareness. They help your brain form new neural pathways and improve mental flexibility."
    },
    {
      title: "Pattern Quest",
      description: "Find and complete pattern sequences",
      icon: <Gamepad className="w-6 h-6" />,
      xpReward: 15,
      gameType: "pattern" as const,
      cognitiveMessage: "Recognizing patterns improves your logical thinking and helps your brain identify relationships between concepts. This skill transfers to many real-world scenarios."
    },
    {
      title: "Quick Math",
      description: "Solve math problems with lightning speed",
      icon: <Zap className="w-6 h-6" />,
      xpReward: 30,
      gameType: "math" as const,
      cognitiveMessage: "Mental math exercises improve numerical fluency and processing speed. The practice stimulates areas of your brain associated with quantitative reasoning."
    },
    {
      title: "Reaction Time",
      description: "Test your reflexes and response time",
      icon: <Timer className="w-6 h-6" />,
      xpReward: 18,
      gameType: "reaction" as const,
      cognitiveMessage: "Improving reaction time benefits decision-making speed and hand-eye coordination. This skill is valuable in many daily activities and emergency situations."
    },
    {
      title: "Focus Finder",
      description: "Improve concentration through target exercises",
      icon: <Target className="w-6 h-6" />,
      xpReward: 22,
      gameType: "focus" as const,
      cognitiveMessage: "Concentration exercises enhance your ability to ignore distractions and maintain attention on important tasks. This skill is fundamental to productivity and learning."
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              5-Minute Mind Games
            </h1>
            <p className="text-gray-400 mt-2">
              Quick brain training games to keep your mind sharp and increase your cognitive level
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              onClick={() => navigate('/game-history')}
              variant="outline"
              className="flex items-center gap-2 border-gray-700 hover:border-gray-600"
            >
              <History className="h-4 w-4" />
              Game History
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-primary/30"
              onClick={() => setShowCbtInfo(!showCbtInfo)}
            >
              <Info className="h-4 w-4 text-primary" />
              About Games in CBT
            </Button>
          </div>
        </div>

        {showCbtInfo && (
          <Card className="mb-8 bg-[#0F172A] backdrop-blur-sm border border-gray-800/40 rounded-xl">
            <CardHeader className="space-y-6 text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-[#2AADA1]" />
                <span className="text-white font-display text-3xl">Cognitive Games in Modern CBT</span>
              </CardTitle>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                The cognitive games featured here are designed based on modern Cognitive Behavioral Therapy principles. Unlike traditional approaches, game-based CBT practices emphasize active engagement and measurable cognitive improvement.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1F8B88] rounded-xl p-6 text-center">
                  <h3 className="font-display text-[#9FFFF5] text-2xl mb-4">
                    Meta-Cognitive Training
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    Games help develop the ability to observe thought patterns objectively, creating space between cognitive triggers and responses.
                  </p>
                </div>
                <div className="bg-[#7E22CE] rounded-xl p-6 text-center">
                  <h3 className="font-display text-[#E9D5FF] text-2xl mb-4">
                    Neuroplasticity
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    Regular gameplay physically reshapes neural pathways, increasing cognitive flexibility and mental adaptability.
                  </p>
                </div>
                <div className="bg-[#3730A3] rounded-xl p-6 text-center">
                  <h3 className="font-display text-[#C7D2FE] text-2xl mb-4">
                    Emotion Regulation
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    Gaming exercises strengthen the mind's ability to modulate emotional responses, improving self-regulation.
                  </p>
                </div>
              </div>

              <div className="bg-[#1F8B88] rounded-xl p-6 text-center">
                <h4 className="text-[#9FFFF5] font-display text-2xl mb-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9FFFF5]"></span>
                  The CBT-Gaming Connection
                </h4>
                <p className="text-gray-200 leading-relaxed max-w-3xl mx-auto">
                  While traditional CBT focuses on changing thought content, game-enhanced CBT focuses on changing one's relationship with thoughts. This combination creates a powerful approach that addresses both cognitive patterns and the awareness context in which they occur.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meditation banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-900/30 to-teal-900/30 rounded-lg border border-teal-800/30 p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/20 rounded-full">
                <Flower2 className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-200">Meditation Exercises</h3>
                <p className="text-gray-400">Boost your mental clarity and earn cognitive XP</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500"
              onClick={() => navigate("/meditation")}
            >
              Start Meditation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <GameComponent
              key={index}
              title={game.title}
              description={game.description}
              icon={game.icon}
              xpReward={game.xpReward}
              gameType={game.gameType}
              cognitiveMessage={game.cognitiveMessage}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Games;

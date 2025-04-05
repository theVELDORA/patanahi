
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import GameInstructions from "./GameInstructions";
import { Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameComponentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  gameType: "memory" | "puzzle" | "pattern" | "math" | "reaction" | "focus";
  cognitiveMessage: string;
}

const GameComponent = ({ title, description, icon, xpReward, gameType, cognitiveMessage }: GameComponentProps) => {
  const navigate = useNavigate();
  const [showCognitiveInfo, setShowCognitiveInfo] = useState(false);

  const handlePlayNow = () => {
    navigate(`/game/${gameType}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-black/30 backdrop-blur-sm border border-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-xl text-gray-200">{title}</CardTitle>
        </div>
        <CardDescription className="text-gray-400">{description}</CardDescription>
        
        {/* Add game instructions */}
        <GameInstructions gameType={gameType} />
        
        {/* Cognitive benefits */}
        <div className="mt-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 px-2 py-1 h-auto text-xs text-primary/80 hover:text-primary hover:bg-primary/10"
                  onClick={() => setShowCognitiveInfo(!showCognitiveInfo)}
                >
                  <Brain className="h-3 w-3" />
                  Cognitive Benefits
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-sm">{cognitiveMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {showCognitiveInfo && (
            <div className="mt-2 p-3 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-primary/20 rounded-md shadow-inner">
              <p className="text-sm text-gray-300">{cognitiveMessage}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Cognitive XP:</span>
            <span className="text-primary font-medium">+{xpReward} XP</span>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all font-medium"
            onClick={handlePlayNow}
          >
            Play Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameComponent;

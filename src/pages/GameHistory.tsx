import { useState } from "react";
import Layout from "../components/Layout";
import { getGameHistory } from "../utils/gameHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Calendar, Clock, Filter, Puzzle, Gamepad, Zap, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const GameHistory = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const gameHistory = getGameHistory();
  
  const filteredHistory = filter 
    ? gameHistory.filter(record => record.gameType === filter)
    : gameHistory;
  
  // Get unique game types for filter
  const gameTypes = [...new Set(gameHistory.map(record => record.gameType))];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getGameIcon = (gameType: string) => {
    switch(gameType) {
      case "memory": return <Brain className="h-5 w-5 text-blue-400" />;
      case "puzzle": return <Puzzle className="h-5 w-5 text-purple-400" />;
      case "pattern": return <Gamepad className="h-5 w-5 text-pink-400" />;
      case "math": return <Zap className="h-5 w-5 text-yellow-400" />;
      case "reaction": return <Timer className="h-5 w-5 text-teal-400" />;
      case "focus": return <Target className="h-5 w-5 text-indigo-400" />;
      default: return <Brain className="h-5 w-5 text-blue-400" />;
    }
  };
  
  const getGameColor = (gameType: string) => {
    switch(gameType) {
      case "memory": return "from-blue-400 to-blue-600";
      case "puzzle": return "from-purple-400 to-purple-600";
      case "pattern": return "from-pink-400 to-pink-600";
      case "math": return "from-yellow-400 to-yellow-600";
      case "reaction": return "from-teal-400 to-teal-600";
      case "focus": return "from-indigo-400 to-indigo-600";
      default: return "from-blue-400 to-blue-600";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in">
            Your Game History
          </h1>
          <p className="text-gray-300 mt-2">
            Track your progress and view detailed statistics of your previous games
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
            <Clock className="text-blue-400 h-5 w-5" />
            <span className="text-sm text-gray-200">
              {gameHistory.length} {gameHistory.length === 1 ? 'game' : 'games'} played
            </span>
          </div>
          
          <div className="flex gap-3">
            <Select onValueChange={(value) => setFilter(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px] bg-gray-800/50 backdrop-blur-sm border-gray-700 text-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-400" />
                  <SelectValue placeholder="Filter games" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-gray-200 hover:bg-gray-800">All Games</SelectItem>
                {gameTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-gray-200 hover:bg-gray-800">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredHistory.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-10 text-center">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10">
                <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-200 mb-2">No game records yet</h3>
                <p className="text-gray-300 mb-4">
                  Play some games to start tracking your progress!
                </p>
                <Button 
                  onClick={() => window.location.href = '/games'}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white"
                >
                  Play Games
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((record, index) => (
              <Card 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden hover:border-gray-600 transition-all"
              >
                <div className={`h-1 w-full bg-gradient-to-r ${getGameColor(record.gameType)}`} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-black/40">
                        {getGameIcon(record.gameType)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-200">{record.gameTitle}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          <span>{formatDate(record.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {record.score} pts
                      </div>
                      <div className="text-xs text-gray-300">
                        Level {record.level}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GameHistory;

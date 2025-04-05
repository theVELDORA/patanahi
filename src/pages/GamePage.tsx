import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Puzzle, Gamepad, Zap, Timer, Target, ArrowLeft, Trophy, BookOpen, Circle, Square, Triangle, Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { saveGameRecord } from "../utils/gameHistory";
import { Recommendation, getRecommendations, getIconComponent } from "../utils/gameRecommendations";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GamePage = () => {
  const { gameType } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameElements, setGameElements] = useState<number[]>([]);
  const [userSelections, setUserSelections] = useState<number[]>([]);
  const [gameLevel, setGameLevel] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentProblem, setCurrentProblem] = useState<{ num1: number; num2: number; operator: string; answer: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: '' });
  const [reactionTarget, setReactionTarget] = useState<{ 
    index: number; 
    timestamp: number;
  } | null>(null);
  const [reactionStats, setReactionStats] = useState<{ times: number[]; average: number }>({ times: [], average: 0 });
  const [reactionStreak, setReactionStreak] = useState(0);
  const [reactionBestTime, setReactionBestTime] = useState<number | null>(null);
  const [patternSequence, setPatternSequence] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [patternType, setPatternType] = useState<'arithmetic' | 'geometric' | 'fibonacci' | 'alternating'>('arithmetic');
  const [patternFeedback, setPatternFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: '' });

  const shapes = [
    { icon: Circle, color: 'text-red-500' },
    { icon: Square, color: 'text-blue-500' },
    { icon: Triangle, color: 'text-green-500' },
    { icon: Star, color: 'text-yellow-500' },
    { icon: Heart, color: 'text-pink-500' }
  ];

  const colors = [
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Green', class: 'bg-green-500' },
    { name: 'Yellow', class: 'bg-yellow-500' },
    { name: 'Purple', class: 'bg-purple-500' }
  ];

  const gameConfig = {
    memory: {
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards",
      icon: <Brain className="w-6 h-6" />,
      xpReward: 25,
      cognitiveMessage: "Memory games strengthen your short-term memory and improve pattern recognition skills. Regular practice can increase attention to detail and visual recognition abilities."
    },
    puzzle: {
      title: "Speed Puzzle",
      description: "Solve puzzles against the clock",
      icon: <Puzzle className="w-6 h-6" />,
      xpReward: 20,
      cognitiveMessage: "Puzzles enhance problem-solving capabilities and spatial awareness. They help your brain form new neural pathways and improve mental flexibility."
    },
    pattern: {
      title: "Pattern Quest",
      description: "Find and complete pattern sequences",
      icon: <Gamepad className="w-6 h-6" />,
      xpReward: 15,
      cognitiveMessage: "Recognizing patterns improves your logical thinking and helps your brain identify relationships between concepts. This skill transfers to many real-world scenarios."
    },
    math: {
      title: "Quick Math",
      description: "Solve math problems with lightning speed",
      icon: <Zap className="w-6 h-6" />,
      xpReward: 30,
      cognitiveMessage: "Mental math exercises improve numerical fluency and processing speed. The practice stimulates areas of your brain associated with quantitative reasoning."
    },
    reaction: {
      title: "Reaction Time",
      description: "Test your reflexes and response time",
      icon: <Timer className="w-6 h-6" />,
      xpReward: 18,
      cognitiveMessage: "Improving reaction time benefits decision-making speed and hand-eye coordination. This skill is valuable in many daily activities and emergency situations."
    },
    focus: {
      title: "Focus Finder",
      description: "Improve concentration through target exercises",
      icon: <Target className="w-6 h-6" />,
      xpReward: 22,
      cognitiveMessage: "Concentration exercises enhance your ability to ignore distractions and maintain attention on important tasks. This skill is fundamental to productivity and learning."
    }
  };

  const currentGame = gameConfig[gameType as keyof typeof gameConfig];

  if (!currentGame) {
    useEffect(() => {
      navigate("/games");
      toast.error("Game not found");
    }, []);
    return null;
  }

  const updateCognitiveLevel = (xpAmount: number): void => {
    const savedLevel = localStorage.getItem("cognitiveLevel");
    const savedXp = localStorage.getItem("cognitiveXp");
    
    const currentLevel = savedLevel ? parseInt(savedLevel) : 0;
    const currentXp = savedXp ? parseInt(savedXp) : 0;
    
    const xpForNextLevel = (currentLevel + 1) * 100;
    
    let newXp = currentXp + xpAmount;
    let newLevel = currentLevel;
    
    if (newXp >= xpForNextLevel) {
      newLevel += 1;
      newXp -= xpForNextLevel;
      toast.success(`Level Up! You are now Level ${newLevel}!`, {
        description: "Keep playing games to improve your cognitive abilities.",
        duration: 4000,
      });
    } else {
      toast.success(`Gained ${xpAmount} XP!`, {
        description: `${xpForNextLevel - newXp} XP needed for next level.`,
        duration: 2000,
      });
    }
    
    localStorage.setItem("cognitiveLevel", newLevel.toString());
    localStorage.setItem("cognitiveXp", newXp.toString());
  };

  useEffect(() => {
    let timer: number;
    if (isPlaying && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setShowResults(false);
    setGameLevel(1);
    generateGame();
  };

  const endGame = () => {
    setIsPlaying(false);
    setShowResults(true);
    
    const earnedXp = Math.floor(score * (gameLevel * 0.5) + currentGame.xpReward);
    updateCognitiveLevel(earnedXp);
    
    saveGameRecord(
      gameType as string, 
      currentGame.title, 
      score, 
      gameLevel
    );
    
    const gameRecommendations = getRecommendations(
      gameType as string,
      score,
      gameLevel
    );
    setRecommendations(gameRecommendations);
    
    toast(`Game Over! Your score: ${score}`, {
      description: currentGame.cognitiveMessage,
      duration: 4000,
    });
  };

  const generateMathProblem = () => {
    const operators = ['+', '-', '×', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, answer;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * (10 * gameLevel)) + 1;
        num2 = Math.floor(Math.random() * (10 * gameLevel)) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * (10 * gameLevel)) + 10;
        num2 = Math.floor(Math.random() * (10 * gameLevel)) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * (5 * gameLevel)) + 1;
        num2 = Math.floor(Math.random() * (5 * gameLevel)) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * (5 * gameLevel)) + 1;
        answer = Math.floor(Math.random() * (5 * gameLevel)) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 0;
        num2 = 0;
        answer = 0;
    }

    setCurrentProblem({ num1, num2, operator, answer });
    setUserAnswer('');
    setFeedback({ type: null, message: '' });
  };

  const handleMathAnswer = (answer: string) => {
    if (!currentProblem) return;

    const userAnswerNum = parseFloat(answer);
    const isCorrect = Math.abs(userAnswerNum - currentProblem.answer) < 0.01;

    if (isCorrect) {
      setScore(s => s + (10 * gameLevel));
      setFeedback({ type: 'correct', message: 'Correct! +' + (10 * gameLevel) + ' points' });
      toast.success('Correct!');
      
      setTimeout(() => {
        if (Math.random() > 0.7) {
          setGameLevel(l => l + 1);
        }
        generateMathProblem();
      }, 1000);
    } else {
      setScore(s => Math.max(0, s - 2));
      setFeedback({ type: 'wrong', message: 'Try again!' });
      toast.error('Incorrect!');
    }
  };

  const generateReactionTarget = () => {
    if (!isPlaying) return;
    
    // Random delay between 1-3 seconds
    const delay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      if (!isPlaying) return;
      
      const randomIndex = Math.floor(Math.random() * 9);
      setReactionTarget({ 
        index: randomIndex, 
        timestamp: Date.now()
      });
      
      // Auto-hide target after 1 second if not clicked
      setTimeout(() => {
        if (reactionTarget?.index === randomIndex) {
          setReactionTarget(null);
          setReactionStreak(0);
          toast.error('Too slow!');
        }
      }, 1000);
    }, delay);
  };

  const handleReactionClick = (index: number) => {
    if (!reactionTarget || reactionTarget.index !== index) {
      setReactionStreak(0);
      setScore(s => Math.max(0, s - 5));
      toast.error('Wrong square!');
      return;
    }

    const reactionTime = Date.now() - reactionTarget.timestamp;
    const newTimes = [...reactionStats.times, reactionTime];
    const average = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
    
    setReactionStats({ times: newTimes, average });
    setReactionTarget(null);
    setReactionStreak(s => s + 1);
    
    // Calculate points based on reaction time and streak
    const timeBonus = Math.max(0, 1000 - reactionTime) / 10;
    const streakBonus = reactionStreak * 2;
    const points = Math.floor(10 + timeBonus + streakBonus);
    
    setScore(s => s + points);
    
    if (!reactionBestTime || reactionTime < reactionBestTime) {
      setReactionBestTime(reactionTime);
    }
    
    toast.success(`Reaction time: ${reactionTime}ms (+${points} points)`);
    
    // Generate new target
    generateReactionTarget();
  };

  const generatePattern = () => {
    let sequence: number[] = [];
    const length = gameLevel + 3;
    const start = Math.floor(Math.random() * 10) + 1;

    switch (patternType) {
      case 'arithmetic':
        const difference = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length }, (_, i) => start + (i * difference));
        break;
      case 'geometric':
        const ratio = Math.floor(Math.random() * 3) + 2;
        sequence = Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
        break;
      case 'fibonacci':
        sequence = [start, start];
        for (let i = 2; i < length; i++) {
          sequence.push(sequence[i-1] + sequence[i-2]);
        }
        break;
      case 'alternating':
        const altDifference = Math.floor(Math.random() * 3) + 1;
        sequence = Array.from({ length }, (_, i) => 
          i % 2 === 0 ? start + (i * altDifference) : start - (i * altDifference)
        );
        break;
    }

    setPatternSequence(sequence);
    setUserPattern([]);
    setPatternFeedback({ type: null, message: '' });
  };

  const handlePatternClick = (number: number) => {
    if (userPattern.length >= patternSequence.length) return;

    const newPattern = [...userPattern, number];
    setUserPattern(newPattern);

    if (newPattern.length === patternSequence.length) {
      const isCorrect = newPattern.every((num, i) => num === patternSequence[i]);
      
      if (isCorrect) {
        setScore(s => s + (10 * gameLevel));
        setPatternFeedback({ type: 'correct', message: 'Correct! +' + (10 * gameLevel) + ' points' });
        toast.success('Pattern matched!');
        
        setTimeout(() => {
          if (Math.random() > 0.7) {
            setGameLevel(l => l + 1);
            // Rotate pattern types
            const types: ('arithmetic' | 'geometric' | 'fibonacci' | 'alternating')[] = 
              ['arithmetic', 'geometric', 'fibonacci', 'alternating'];
            const currentIndex = types.indexOf(patternType);
            setPatternType(types[(currentIndex + 1) % types.length]);
          }
          generatePattern();
        }, 1000);
      } else {
        setScore(s => Math.max(0, s - 2));
        setPatternFeedback({ type: 'wrong', message: 'Try again!' });
        toast.error('Pattern mismatch!');
        setUserPattern([]);
      }
    }
  };

  const generateGame = () => {
    if (gameType === 'math') {
      generateMathProblem();
    } else if (gameType === 'reaction') {
      setReactionTarget(null);
      setReactionStats({ times: [], average: 0 });
      setReactionStreak(0);
      generateReactionTarget();
    } else if (gameType === 'pattern') {
      generatePattern();
    } else {
      let newElements: number[] = [];
      
      switch (gameType) {
        case "memory":
          const pairs = gameLevel + 2;
          const numbers = Array.from({ length: pairs }, (_, i) => i + 1);
          newElements = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
          break;
        
        case "puzzle":
          newElements = Array.from({ length: gameLevel + 3 }, () => 
            Math.floor(Math.random() * 9) + 1
          );
          break;
          
        case "focus":
          newElements = Array.from({ length: gameLevel + 2 }, () => 
            Math.floor(Math.random() * 9)
          );
          break;
      }
      
      setGameElements(newElements);
      setUserSelections([]);
    }
  };

  const handleElementClick = (index: number) => {
    if (!isPlaying) return;
    
    const newSelections = [...userSelections, index];
    setUserSelections(newSelections);
    
    if (gameType === "memory" && newSelections.length === 2) {
      if (gameElements[newSelections[0]] === gameElements[newSelections[1]]) {
        setScore(s => s + 10 * gameLevel);
        toast.success("Match found!");
      }
      
      setTimeout(() => {
        setUserSelections([]);
        if (Math.random() > 0.7) {
          setGameLevel(l => l + 1);
          generateGame();
        }
      }, 1000);
    } else if (["puzzle", "pattern", "focus"].includes(gameType || "") && newSelections.length === 1) {
      if (gameElements[index] % 2 === 0) {
        setScore(s => s + 5 * gameLevel);
        toast.success("Correct!");
      } else {
        setScore(s => Math.max(0, s - 2));
        toast.error("Try again!");
      }
      
      setTimeout(() => {
        setUserSelections([]);
        if (Math.random() > 0.6) {
          setGameLevel(l => l + 1);
          generateGame();
        }
      }, 800);
    }
  };

  const getGameColors = () => {
    switch (gameType) {
      case "memory": return "from-blue-600 to-purple-600";
      case "puzzle": return "from-green-600 to-teal-600";
      case "pattern": return "from-yellow-600 to-orange-600";
      case "math": return "from-red-600 to-pink-600";
      case "reaction": return "from-purple-600 to-indigo-600";
      case "focus": return "from-teal-600 to-cyan-600";
      default: return "from-blue-600 to-purple-600";
    }
  };

  const renderGameUI = () => {
    if (gameType === 'math') {
      return (
        <div className="space-y-6">
          {currentProblem && (
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold bg-gradient-to-br from-red-600 to-pink-600 bg-clip-text text-transparent">
                {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
              </div>
              
              <div className="flex justify-center gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMathAnswer(userAnswer)}
                  className="w-32 px-4 py-2 text-center text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="?"
                  autoFocus
                />
                <Button
                  onClick={() => handleMathAnswer(userAnswer)}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500"
                >
                  Submit
                </Button>
              </div>
              
              {feedback.type && (
                <div className={`text-lg font-semibold ${
                  feedback.type === 'correct' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {feedback.message}
                </div>
              )}
              
              <div className="text-sm text-gray-400">
                Level {gameLevel} • {timeLeft}s remaining
              </div>
            </div>
          )}
        </div>
      );
    } else if (gameType === 'reaction') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
                <span className="text-gray-400">Streak:</span>
                <span className="ml-1 font-bold text-green-500">{reactionStreak}x</span>
              </div>
              <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
                <span className="text-gray-400">Average:</span>
                <span className="ml-1 font-bold text-blue-500">
                  {reactionStats.average ? Math.round(reactionStats.average) + 'ms' : '-'}
                </span>
              </div>
              {reactionBestTime && (
                <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
                  <span className="text-gray-400">Best:</span>
                  <span className="ml-1 font-bold text-yellow-500">{reactionBestTime}ms</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all transform ${
                  reactionTarget?.index === index
                    ? "bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white shadow-lg hover:scale-105 animate-pulse"
                    : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700"
                }`}
                onClick={() => handleReactionClick(index)}
              >
                {reactionTarget?.index === index && (
                  <div className="animate-bounce">
                    <span className="text-xl font-bold">!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-400">
              Level {gameLevel} • {timeLeft}s remaining
            </div>
          </div>
        </div>
      );
    } else if (gameType === 'pattern') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-3">
              {patternSequence.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 shadow-inner"
                >
                  <span className="text-lg font-bold text-white">{num}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-3">
              {Array.from({ length: patternSequence.length }).map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                    userPattern[index] !== undefined
                      ? `bg-gradient-to-br ${getGameColors()} text-white shadow-lg`
                      : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700"
                  }`}
                  onClick={() => handlePatternClick(index + 1)}
                >
                  <span className="text-lg font-bold">
                    {userPattern[index] !== undefined ? userPattern[index] : index + 1}
                  </span>
                </div>
              ))}
            </div>
            
            {patternFeedback.type && (
              <div className={`text-lg font-semibold ${
                patternFeedback.type === 'correct' ? 'text-green-500' : 'text-red-500'
              }`}>
                {patternFeedback.message}
              </div>
            )}
            
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
                <span className="text-gray-400">Pattern:</span>
                <span className="ml-1 font-bold text-primary">
                  {patternType.charAt(0).toUpperCase() + patternType.slice(1)}
                </span>
              </div>
              <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
                <span className="text-gray-400">Level:</span>
                <span className="ml-1 font-bold text-yellow-500">{gameLevel}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              {timeLeft}s remaining
            </div>
          </div>
        </div>
      );
    } else {
      switch (gameType) {
        case "memory":
          return (
            <div className="grid grid-cols-4 gap-3 w-full">
              {gameElements.map((element, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                    userSelections.includes(index)
                      ? `bg-gradient-to-br ${getGameColors()} text-white shadow-lg`
                      : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700"
                  }`}
                  onClick={() => handleElementClick(index)}
                >
                  <span className="text-xl font-bold">
                    {userSelections.includes(index) ? element : "?"}
                  </span>
                </div>
              ))}
            </div>
          );
          
        case "puzzle":
          return (
            <div className="flex flex-wrap gap-3 justify-center">
              {gameElements.map((element, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                    userSelections.includes(index)
                      ? `bg-gradient-to-br ${getGameColors()} text-white shadow-lg`
                      : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700"
                  }`}
                  onClick={() => handleElementClick(index)}
                >
                  <span className="text-xl font-bold">{element}</span>
                </div>
              ))}
            </div>
          );
          
        case "focus":
          return (
            <div className="grid grid-cols-3 gap-3 w-full">
              {Array.from({ length: 9 }).map((_, index) => {
                const isTarget = gameElements.includes(index);
                return (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all transform hover:scale-102 ${
                      isTarget
                        ? "bg-gradient-to-br from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white shadow-lg"
                        : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700"
                    }`}
                    onClick={() => handleElementClick(index)}
                  >
                    {isTarget ? (
                      <span className="text-sm font-bold">Target</span>
                    ) : ""}
                  </div>
                );
              })}
            </div>
          );
          
        default:
          return <div>Game not available</div>;
      }
    }
  };

  const renderRecommendations = () => {
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-200">Recommended for you:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendations.slice(0, 3).map((rec, index) => (
            <Card key={index} className="bg-black/40 border border-gray-800 hover:border-gray-700 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-black/40">
                    {getIconComponent(rec.iconType)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 text-sm">{rec.title}</h4>
                    <p className="text-xs text-gray-400">{rec.duration}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">{rec.description}</p>
                
                <Button 
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-gray-300"
                  size="sm"
                  onClick={() => navigate(rec.link || "/")}
                >
                  {rec.type === "meditation" ? "Meditate" : 
                   rec.type === "music" ? "Listen" : "Watch"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const instructions = {
    memory: [
      "You will see a grid of face-down cards.",
      "Click on two cards to flip them over.",
      "If they match, they stay face up.",
      "If they don't match, they will flip back down.",
      "Your goal is to find all matching pairs in the shortest time possible.",
      "Each matching pair earns you points!"
    ],
    puzzle: [
      "You'll be presented with puzzle pieces arranged randomly.",
      "Click on pieces to select them.",
      "Solve the puzzle by arranging the pieces correctly.",
      "Work quickly - your score is based on time and accuracy.",
      "Higher levels will introduce more complex puzzles."
    ],
    pattern: [
      "You'll see a sequence of numbers following a pattern.",
      "Study the pattern carefully.",
      "Select the correct next value in the sequence.",
      "Each correct answer earns points.",
      "Patterns get more complex as you advance through levels."
    ],
    math: [
      "Simple math problems will appear on screen.",
      "Quickly solve the equation in your head.",
      "Click on the answer or type it in before time runs out.",
      "Each correct answer earns points.",
      "The difficulty increases with your level."
    ],
    reaction: [
      "Watch for highlighted squares to appear on the grid.",
      "Click on them as quickly as possible.",
      "Your reaction time determines your score.",
      "Be careful not to click on incorrect squares.",
      "The game gets faster as you progress."
    ],
    focus: [
      "Specific target squares will be highlighted.",
      "Focus on only clicking the highlighted targets.",
      "Ignore distractions that may appear.",
      "Points are awarded for accuracy and speed.",
      "Higher levels introduce more distractions."
    ]
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${getGameColors()} bg-clip-text text-transparent animate-fade-in`}>
            {currentGame.title}
          </h1>
          <p className="text-gray-400 mt-2">
            {currentGame.description}
          </p>
        </div>
        
        <Card className="mb-8 bg-black/30 backdrop-blur-sm border border-gray-800 overflow-hidden">
          <div className={`h-1 w-full bg-gradient-to-r ${getGameColors()}`} />
          <CardContent className="p-6">
            {!isPlaying && !showResults ? (
              <div className="text-center space-y-4">
                <div className={`p-5 bg-gradient-to-br ${getGameColors()} rounded-full mx-auto w-20 h-20 flex items-center justify-center shadow-lg`}>
                  {currentGame.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-200">{currentGame.title}</h2>
                <p className="text-gray-400">{currentGame.description}</p>
                
                <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="instructions" className="border-gray-700">
                      <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200 py-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>How to Play</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        <ol className="list-decimal pl-5 space-y-1">
                          {instructions[gameType as keyof typeof instructions]?.map((step, index) => (
                            <li key={index} className="text-sm">{step}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <p className="text-sm text-gray-500">Earn up to {currentGame.xpReward} XP per game</p>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${getGameColors()} hover:opacity-90 transition-all`}
                  onClick={startGame}
                >
                  Start Game
                </Button>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/games')}
                    className="w-full"
                  >
                    Back to Games
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/game-history')}
                    className="w-full"
                  >
                    View History
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isPlaying && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-400">Score:</span>
                        <span className="ml-2 text-lg font-bold text-primary">{score}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Time:</span>
                        <span className={`ml-2 text-lg font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-300"}`}>
                          {timeLeft}s
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Level:</span>
                        <span className="ml-2 text-lg font-bold text-purple-400">{gameLevel}</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-800/80 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getGameColors()} transition-all duration-300`}
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                      />
                    </div>
                    
                    <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800">
                      {renderGameUI()}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={endGame}
                      className="w-full border-red-800/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                      End Game
                    </Button>
                  </div>
                )}
                
                {showResults && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center mb-4">
                      <Trophy className="h-12 w-12 text-yellow-500 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-200">Game Complete!</h2>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-xl border border-blue-800/30">
                      <h3 className="text-lg font-semibold text-primary mb-2">Game Results</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">Final Score:</span>
                        <span className="font-bold text-white">{score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level Reached:</span>
                        <span className="font-bold text-purple-400">{gameLevel}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <p className="text-gray-300">{currentGame.cognitiveMessage}</p>
                    </div>
                    
                    {recommendations.length > 0 && renderRecommendations()}
                    
                    <div className="flex space-x-3">
                      <Button 
                        className={`w-full bg-gradient-to-r ${getGameColors()} hover:opacity-90`}
                        onClick={startGame}
                      >
                        Play Again
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => navigate('/games')}
                        className="w-full"
                      >
                        Back to Games
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/game-history')}
                      className="w-full border-gray-700 text-gray-400 hover:text-gray-300"
                    >
                      View Game History
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GamePage;

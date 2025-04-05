
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, Brain, Heart, Sun, Moon, Flower2, Dumbbell } from "lucide-react";
import { toast } from "sonner";

interface MeditationExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  icon: JSX.Element;
  xpReward: number;
  guide: string[];
}

const updateCognitiveLevel = (xpAmount: number): void => {
  // Get current cognitive data
  const savedLevel = localStorage.getItem("cognitiveLevel");
  const savedXp = localStorage.getItem("cognitiveXp");
  
  const currentLevel = savedLevel ? parseInt(savedLevel) : 0;
  const currentXp = savedXp ? parseInt(savedXp) : 0;
  
  // Calculate XP needed for next level
  const xpForNextLevel = (currentLevel + 1) * 100;
  
  // Add XP and check for level up
  let newXp = currentXp + xpAmount;
  let newLevel = currentLevel;
  
  // Handle level up if needed
  if (newXp >= xpForNextLevel) {
    newLevel += 1;
    newXp -= xpForNextLevel;
    toast.success(`Level Up! You are now Level ${newLevel}!`, {
      description: "Your meditation practice is improving your cognitive abilities.",
      duration: 4000,
    });
  } else {
    toast.success(`Gained ${xpAmount} XP!`, {
      description: `${xpForNextLevel - newXp} XP needed for next level.`,
      duration: 2000,
    });
  }
  
  // Save updated data
  localStorage.setItem("cognitiveLevel", newLevel.toString());
  localStorage.setItem("cognitiveXp", newXp.toString());
};

const MeditationSession = () => {
  const [selectedExercise, setSelectedExercise] = useState<MeditationExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Define meditation exercises
  const meditationExercises: MeditationExercise[] = [
    {
      id: "mindful",
      title: "Mindful Breathing",
      description: "Focus on your breath to center your mind",
      duration: 300, // 5 minutes
      icon: <Brain className="h-6 w-6" />,
      xpReward: 40,
      guide: [
        "Find a comfortable position and close your eyes",
        "Bring your attention to your breath",
        "Inhale slowly through your nose for 4 counts",
        "Hold for 2 counts",
        "Exhale slowly through your mouth for 6 counts",
        "Notice when your mind wanders and gently return to your breath"
      ]
    },
    {
      id: "loving",
      title: "Loving-Kindness",
      description: "Cultivate compassion toward yourself and others",
      duration: 360, // 6 minutes
      icon: <Heart className="h-6 w-6" />,
      xpReward: 45,
      guide: [
        "Sit comfortably with eyes closed",
        "Begin by focusing on your heart center",
        "Bring to mind someone you care about deeply",
        "Silently repeat: 'May you be happy, may you be healthy, may you be safe'",
        "Now direct these same wishes to yourself",
        "Finally, extend these wishes to all beings everywhere"
      ]
    },
    {
      id: "morning",
      title: "Morning Energizer",
      description: "Start your day with mental clarity and energy",
      duration: 240, // 4 minutes
      icon: <Sun className="h-6 w-6" />,
      xpReward: 35,
      guide: [
        "Sit up straight with eyes gently closed",
        "Take 5 deep breaths, filling your lungs completely",
        "Visualize bright light filling your body with energy",
        "Set a positive intention for your day",
        "Gently open your eyes and bring awareness to your surroundings"
      ]
    },
    {
      id: "evening",
      title: "Evening Wind-Down",
      description: "Relax your mind and prepare for restful sleep",
      duration: 420, // 7 minutes
      icon: <Moon className="h-6 w-6" />,
      xpReward: 50,
      guide: [
        "Lie down comfortably with your eyes closed",
        "Take deep breaths, focusing on relaxing your body",
        "Scan your body from toes to head, releasing tension",
        "Let go of thoughts about the day",
        "Visualize a peaceful scene that brings you comfort",
        "Allow yourself to drift toward sleep"
      ]
    },
    {
      id: "focus",
      title: "Focus Enhancer",
      description: "Sharpen concentration before important tasks",
      duration: 180, // 3 minutes
      icon: <Flower2 className="h-6 w-6" />,
      xpReward: 30,
      guide: [
        "Sit upright in a comfortable position",
        "Take three deep clearing breaths",
        "Choose a single point of focus (a word, object, or your breath)",
        "When your mind wanders, gently bring it back to your focus point",
        "Notice distractions without judgment and return to your focus"
      ]
    },
    {
      id: "body",
      title: "Body Scan Meditation",
      description: "Develop awareness of physical sensations",
      duration: 360, // 6 minutes
      icon: <Dumbbell className="h-6 w-6" />,
      xpReward: 45,
      guide: [
        "Lie down or sit comfortably",
        "Begin by bringing attention to your feet",
        "Slowly move your attention up through each part of your body",
        "Notice any sensations without trying to change them",
        "Pay special attention to areas of tension",
        "End by being aware of your body as a whole"
      ]
    }
  ];

  useEffect(() => {
    if (!isActive || !selectedExercise) return;

    let interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          // Reward XP when meditation completes
          updateCognitiveLevel(selectedExercise.xpReward);
          toast.success("Meditation completed!", {
            description: "Take a moment to notice how you feel now."
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, selectedExercise]);

  const handleSelectExercise = (exercise: MeditationExercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setCurrentStep(0);
  };

  const startMeditation = () => {
    setIsActive(true);
    toast("Meditation started", {
      description: "Find a comfortable position and follow the guide."
    });
  };

  const stopMeditation = () => {
    setIsActive(false);
    toast("Meditation paused", {
      description: "You can resume at any time."
    });
  };

  const resetMeditation = () => {
    setIsActive(false);
    setSelectedExercise(null);
    setTimeLeft(0);
    setCurrentStep(0);
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Display next guide step every 30 seconds
  useEffect(() => {
    if (!isActive || !selectedExercise) return;
    
    const stepDuration = Math.floor(selectedExercise.duration / selectedExercise.guide.length);
    const nextStep = selectedExercise.guide.length - Math.ceil(timeLeft / stepDuration);
    
    if (nextStep > currentStep && nextStep < selectedExercise.guide.length) {
      setCurrentStep(nextStep);
      toast(selectedExercise.guide[nextStep], {
        duration: 4000
      });
    }
  }, [timeLeft, isActive, selectedExercise, currentStep]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!selectedExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full mb-4">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
              Select a Meditation Exercise
            </h2>
            <p className="text-gray-400 text-center mt-2">
              Choose an exercise that suits your current needs
            </p>
          </div>
          
          {meditationExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="bg-black/30 backdrop-blur-sm border border-gray-800 hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleSelectExercise(exercise)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {exercise.icon}
                  </div>
                  <div>
                    <CardTitle className="text-gray-200">{exercise.title}</CardTitle>
                    <CardDescription>{formatTime(exercise.duration)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{exercise.description}</p>
                <div className="mt-2 text-xs text-primary">+{exercise.xpReward} XP</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/30 backdrop-blur-sm border border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  {selectedExercise.icon}
                </div>
                <div>
                  <CardTitle className="text-gray-200">{selectedExercise.title}</CardTitle>
                  <CardDescription>{selectedExercise.description}</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-400"
                onClick={resetMeditation}
              >
                Change
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-mono font-semibold text-gray-200 mb-2">
                {formatTime(timeLeft)}
              </div>
              <Progress 
                value={(timeLeft / selectedExercise.duration) * 100} 
                className="h-2 bg-gray-800"
              />
            </div>
            
            <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Current Focus
              </h3>
              <p className="text-gray-200">
                {selectedExercise.guide[currentStep]}
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              {isActive ? (
                <Button 
                  className="bg-amber-900/50 hover:bg-amber-800/60 text-amber-100"
                  onClick={stopMeditation}
                >
                  Pause Meditation
                </Button>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400"
                  onClick={startMeditation}
                >
                  {timeLeft < selectedExercise.duration ? 'Resume Meditation' : 'Start Meditation'}
                </Button>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Meditation Guide</h3>
              <div className="space-y-3">
                {selectedExercise.guide.map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      index === currentStep 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-black/20 border border-gray-800'
                    }`}
                  >
                    <p className={`text-sm ${index === currentStep ? 'text-primary' : 'text-gray-400'}`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeditationSession;

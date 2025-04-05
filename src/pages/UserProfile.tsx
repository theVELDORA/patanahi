import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, User, LineChart, Activity, Trophy, Calendar, Heart, Music, Utensils, Film, Book, Smile, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

interface CognitiveDetails {
  name: string;
  age: string;
  focusLevel: string;
  memoryLevel: string;
  reactionLevel: string;
  meditationFrequency: string;
  sleepHours: string;
  dailyGoal: string;
  // New personal preference fields
  favoriteMusic: string;
  favoriteFoods: string;
  favoriteActivities: string;
  favoriteMovies: string;
  favoriteBooks: string;
  relaxationTechniques: string;
  stressors: string;
  personalGoals: string;
  moodTriggers: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [cognitiveLevel, setCognitiveLevel] = useState(0);
  const [cognitiveXp, setCognitiveXp] = useState(0);
  const [activeTab, setActiveTab] = useState("cognitive");
  const [cognitiveDetails, setCognitiveDetails] = useState<CognitiveDetails>({
    name: "",
    age: "",
    focusLevel: "3",
    memoryLevel: "3",
    reactionLevel: "3",
    meditationFrequency: "Occasionally",
    sleepHours: "7",
    dailyGoal: "20",
    favoriteMusic: "",
    favoriteFoods: "",
    favoriteActivities: "",
    favoriteMovies: "",
    favoriteBooks: "",
    relaxationTechniques: "",
    stressors: "",
    personalGoals: "",
    moodTriggers: "",
  });
  const [activityStreak, setActivityStreak] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState<Date | null>(null);
  const [timeSinceLastActivity, setTimeSinceLastActivity] = useState<string>("");
  
  // Load cognitive level and XP from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem("cognitiveLevel");
    const savedXp = localStorage.getItem("cognitiveXp");
    
    setCognitiveLevel(savedLevel ? parseInt(savedLevel) : 0);
    setCognitiveXp(savedXp ? parseInt(savedXp) : 0);
    
    // Load saved cognitive details if they exist
    const savedDetails = localStorage.getItem("cognitiveDetails");
    if (savedDetails) {
      setCognitiveDetails(JSON.parse(savedDetails));
    }
  }, []);
  
  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem("activityStreak");
    const savedLastActivity = localStorage.getItem("lastActivityTime");
    
    if (savedStreak) {
      setActivityStreak(parseInt(savedStreak));
    }
    
    if (savedLastActivity) {
      const lastActivity = new Date(savedLastActivity);
      setLastActivityTime(lastActivity);
      updateTimeSinceLastActivity(lastActivity);
    }

    // Set up interval to update time since last activity
    const interval = setInterval(() => {
      if (lastActivityTime) {
        updateTimeSinceLastActivity(lastActivityTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivityTime]);

  const updateTimeSinceLastActivity = (lastActivity: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastActivity.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      setTimeSinceLastActivity(`${diffInSeconds}s ago`);
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      setTimeSinceLastActivity(`${minutes}m ago`);
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      setTimeSinceLastActivity(`${hours}h ago`);
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      setTimeSinceLastActivity(`${days}d ago`);
    }
  };

  const updateActivityStreak = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!lastActivityTime) {
      // First activity
      setActivityStreak(1);
      setLastActivityTime(now);
      localStorage.setItem("activityStreak", "1");
      localStorage.setItem("lastActivityTime", now.toISOString());
      return;
    }

    const lastActivityDate = new Date(lastActivityTime);
    const lastActivityDay = new Date(lastActivityDate.getFullYear(), lastActivityDate.getMonth(), lastActivityDate.getDate());
    
    if (today.getTime() === lastActivityDay.getTime()) {
      // Activity on the same day
      return;
    }

    const dayDifference = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDifference === 1) {
      // Consecutive day
      const newStreak = activityStreak + 1;
      setActivityStreak(newStreak);
      setLastActivityTime(now);
      localStorage.setItem("activityStreak", newStreak.toString());
      localStorage.setItem("lastActivityTime", now.toISOString());
    } else if (dayDifference > 1) {
      // Streak broken
      setActivityStreak(1);
      setLastActivityTime(now);
      localStorage.setItem("activityStreak", "1");
      localStorage.setItem("lastActivityTime", now.toISOString());
    }
  };

  const handleSave = () => {
    // Save cognitive details to localStorage
    localStorage.setItem("cognitiveDetails", JSON.stringify(cognitiveDetails));
    toast.success("Profile updated successfully!", {
      description: "Your cognitive profile has been saved.",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCognitiveDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <h1 className="text-4xl font-display bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Personal Profile
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Cognitive Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center text-purple-400">{cognitiveLevel}</div>
              <div className="text-sm text-gray-300 text-center mt-1">XP Progress: {cognitiveXp}/100</div>
              <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-blue-400 h-full rounded-full" 
                  style={{ width: `${(cognitiveXp/100) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Game Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white" 
                onClick={() => navigate("/game-history")}
              >
                View Game History
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                Activity Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-center text-blue-400 mb-2">
                  {activityStreak}
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Consecutive Days
                </div>
                {lastActivityTime && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>Last activity: {timeSinceLastActivity}</span>
                  </div>
                )}
                <Button 
                  onClick={updateActivityStreak}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
                >
                  Log Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === "cognitive" ? "default" : "outline"} 
            onClick={() => setActiveTab("cognitive")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
          >
            <Brain className="h-4 w-4" /> Cognitive
          </Button>
          <Button 
            variant={activeTab === "personal" ? "default" : "outline"} 
            onClick={() => setActiveTab("personal")}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white"
          >
            <Heart className="h-4 w-4" /> Personal
          </Button>
        </div>

        {activeTab === "cognitive" && (
          <>
            <Card className="bg-black/30 backdrop-blur-sm border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  Personal Details
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your personal information to optimize cognitive training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={cognitiveDetails.name}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-200">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your age"
                      value={cognitiveDetails.age}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sleepHours" className="text-gray-200">Average Sleep (hours/day)</Label>
                    <Input
                      id="sleepHours"
                      name="sleepHours"
                      type="number"
                      min="4"
                      max="12"
                      value={cognitiveDetails.sleepHours}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dailyGoal" className="text-gray-200">Daily XP Goal</Label>
                    <Input
                      id="dailyGoal"
                      name="dailyGoal"
                      type="number"
                      min="10"
                      max="100"
                      value={cognitiveDetails.dailyGoal}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-400" />
                  Cognitive Self-Assessment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Rate your cognitive abilities to personalize training recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="focusLevel" className="text-gray-200">Focus Ability (1-5)</Label>
                    <Input
                      id="focusLevel"
                      name="focusLevel"
                      type="range"
                      min="1"
                      max="5"
                      value={cognitiveDetails.focusLevel}
                      onChange={handleInputChange}
                      className="accent-green-400"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Easily Distracted</span>
                      <span>Highly Focused</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="memoryLevel" className="text-gray-200">Memory (1-5)</Label>
                    <Input
                      id="memoryLevel"
                      name="memoryLevel"
                      type="range"
                      min="1"
                      max="5"
                      value={cognitiveDetails.memoryLevel}
                      onChange={handleInputChange}
                      className="accent-purple-400"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Often Forget</span>
                      <span>Remember Everything</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reactionLevel" className="text-gray-200">Reaction Time (1-5)</Label>
                    <Input
                      id="reactionLevel"
                      name="reactionLevel"
                      type="range"
                      min="1"
                      max="5"
                      value={cognitiveDetails.reactionLevel}
                      onChange={handleInputChange}
                      className="accent-blue-400"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Slow</span>
                      <span>Very Fast</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meditationFrequency" className="text-gray-200">Meditation Frequency</Label>
                    <select
                      id="meditationFrequency"
                      name="meditationFrequency"
                      value={cognitiveDetails.meditationFrequency}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Never">Never</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Daily">Daily</option>
                      <option value="Multiple times daily">Multiple times daily</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "personal" && (
          <>
            <Card className="bg-black/30 backdrop-blur-sm border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  Personal Preferences
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Share your preferences to help us personalize your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="favoriteMusic" className="flex items-center gap-2 text-gray-200">
                      <Music className="h-4 w-4 text-purple-400" /> Favorite Music
                    </Label>
                    <Textarea
                      id="favoriteMusic"
                      name="favoriteMusic"
                      placeholder="What music helps you relax or energize?"
                      value={cognitiveDetails.favoriteMusic}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favoriteFoods" className="flex items-center gap-2 text-gray-200">
                      <Utensils className="h-4 w-4 text-yellow-400" /> Favorite Foods
                    </Label>
                    <Textarea
                      id="favoriteFoods"
                      name="favoriteFoods"
                      placeholder="What foods do you enjoy most?"
                      value={cognitiveDetails.favoriteFoods}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favoriteActivities" className="flex items-center gap-2 text-gray-200">
                      <Activity className="h-4 w-4 text-green-400" /> Favorite Activities
                    </Label>
                    <Textarea
                      id="favoriteActivities"
                      name="favoriteActivities"
                      placeholder="What activities bring you joy?"
                      value={cognitiveDetails.favoriteActivities}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favoriteMovies" className="flex items-center gap-2 text-gray-200">
                      <Film className="h-4 w-4 text-blue-400" /> Favorite Movies/Shows
                    </Label>
                    <Textarea
                      id="favoriteMovies"
                      name="favoriteMovies"
                      placeholder="What do you enjoy watching?"
                      value={cognitiveDetails.favoriteMovies}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favoriteBooks" className="flex items-center gap-2 text-gray-200">
                      <Book className="h-4 w-4 text-amber-400" /> Favorite Books
                    </Label>
                    <Textarea
                      id="favoriteBooks"
                      name="favoriteBooks"
                      placeholder="What do you enjoy reading?"
                      value={cognitiveDetails.favoriteBooks}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relaxationTechniques" className="flex items-center gap-2 text-gray-200">
                      <Smile className="h-4 w-4 text-cyan-400" /> Relaxation Techniques
                    </Label>
                    <Textarea
                      id="relaxationTechniques"
                      name="relaxationTechniques"
                      placeholder="What helps you relax when stressed?"
                      value={cognitiveDetails.relaxationTechniques}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  Mental Wellness Insights
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Help us understand your mental wellness journey better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="stressors" className="text-gray-200">Common Stressors</Label>
                    <Textarea
                      id="stressors"
                      name="stressors"
                      placeholder="What situations typically cause you stress?"
                      value={cognitiveDetails.stressors}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="personalGoals" className="text-gray-200">Personal Growth Goals</Label>
                    <Textarea
                      id="personalGoals"
                      name="personalGoals"
                      placeholder="What are your goals for personal growth?"
                      value={cognitiveDetails.personalGoals}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="moodTriggers" className="text-gray-200">Mood Triggers</Label>
                    <Textarea
                      id="moodTriggers"
                      name="moodTriggers"
                      placeholder="What typically improves or worsens your mood?"
                      value={cognitiveDetails.moodTriggers}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white"
          >
            Save Profile
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;

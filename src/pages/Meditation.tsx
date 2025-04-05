
import Layout from "../components/Layout";
import MeditationSession from "../components/MeditationSession";
import { Flower2, Brain, Heart, Moon, Info } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MeditationPage = () => {
  const [showCbtInfo, setShowCbtInfo] = useState(false);
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-500 text-transparent bg-clip-text">
                Meditation Center
              </h1>
              <Flower2 className="h-6 w-6 text-teal-400 animate-pulse" />
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Improve your mental clarity, focus, and emotional wellbeing through guided meditation exercises
            </p>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 mt-4 border-teal-500/30"
              onClick={() => setShowCbtInfo(!showCbtInfo)}
            >
              <Info className="h-4 w-4 text-teal-500" />
              About Meditation in CBT
            </Button>
          </div>
            {showCbtInfo && (
            <Card className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg border border-gray-700 mx-auto max-w-4xl">
              <CardHeader>
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Brain className="h-5 w-5 text-teal-400" />
                Meditation in Modern CBT
              </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
              <p className="leading-relaxed">
                Mindfulness meditation has become an essential component of third-wave Cognitive Behavioral Therapy. Unlike traditional relaxation techniques, mindfulness-based CBT practices emphasize non-judgmental awareness and acceptance of thoughts and feelings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-gradient-to-br from-teal-800 via-teal-900 to-black p-6 rounded-lg border border-teal-700 shadow-md">
                <h3 className="font-semibold text-teal-300 mb-3">Meta-Cognitive Awareness</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Meditation helps develop the ability to observe thoughts without attachment, creating space between stimuli and response.
                </p>
                </div>
                <div className="bg-gradient-to-br from-purple-800 via-purple-900 to-black p-6 rounded-lg border border-purple-700 shadow-md">
                <h3 className="font-semibold text-purple-300 mb-3">Neuroplasticity</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Regular meditation practice physically reshapes the brain, increasing gray matter in regions associated with self-awareness and compassion.
                </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-800 via-indigo-900 to-black p-6 rounded-lg border border-indigo-700 shadow-md">
                <h3 className="font-semibold text-indigo-300 mb-3">Emotion Regulation</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Meditation strengthens the prefrontal cortex's ability to modulate limbic system reactivity, improving emotional regulation.
                </p>
                </div>
              </div>
              <div className="mt-6 p-6 bg-gradient-to-br from-teal-700 via-teal-800 to-black rounded-lg border border-teal-600 shadow-md">
                <h3 className="font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                The CBT-Meditation Connection
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                While traditional CBT focuses on changing thought content, meditation-enhanced CBT focuses on changing one's relationship with thoughts. This combination creates a powerful approach that addresses both cognitive patterns and the awareness context in which they occur.
                </p>
              </div>
              </CardContent>
            </Card>
            )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/30 to-teal-900/30 p-4 rounded-xl border border-blue-800/30 backdrop-blur-sm">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-blue-400">Mental Clarity</h3>
              <p className="text-sm text-gray-400">Enhance focus and concentration with mindful exercises</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 rounded-xl border border-purple-800/30 backdrop-blur-sm">
              <Heart className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-purple-400">Emotional Balance</h3>
              <p className="text-sm text-gray-400">Develop kindness and compassion toward yourself and others</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 p-4 rounded-xl border border-indigo-800/30 backdrop-blur-sm">
              <Moon className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-indigo-400">Better Sleep</h3>
              <p className="text-sm text-gray-400">Improve sleep quality with evening relaxation techniques</p>
            </div>
          </div>
        </div>

        <MeditationSession />
      </div>
    </Layout>
  );
};

export default MeditationPage;

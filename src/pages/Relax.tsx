import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Music, Video, WavesIcon, Brain, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "video" | "music";
  thumbnail?: string;
  xpValue: number;
  description?: string;
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
      description: "Your relaxation practices are improving your cognitive abilities.",
      duration: 4000,
    });
  } else {
    toast(`+${xpAmount} XP`, {
      description: "Relaxation improves mental clarity.",
      duration: 2000,
    });
  }
  
  // Save updated data
  localStorage.setItem("cognitiveLevel", newLevel.toString());
  localStorage.setItem("cognitiveXp", newXp.toString());
};

const Relax = () => {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});
  const [videoDuration, setVideoDuration] = useState<{ [key: string]: number }>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState<{ [key: string]: boolean }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [showCbtInfo, setShowCbtInfo] = useState(false);

  const mediaItems: MediaItem[] = [
    {
      id: "waves",
      title: "Ocean Waves",
      url: "/media/Music to relax the mind.mp3",
      type: "music",
      xpValue: 12,
      description: "Calming ocean waves to reduce stress and stabilize breathing patterns."
    },
    {
      id: "rain",
      title: "Rainy Mood",
      url: "/media/Music for anxiety.mp3",
      type: "music",
      xpValue: 12,
      description: "Calm your mind and block out distractions with soothing thunder and rain sounds."
    },
    {
      id: "forest",
      title: "Forest Birds",
      url: "/media/Sleep Therapy music.mp3",
      type: "music",
      xpValue: 10,
      description: "Birdsong and forest ambience to promote mindfulness and presence."
    },
    {
      id: "meditation1",
      title: "Guided Meditation - Breathing",
      url: "/media/video1.mp4",
      type: "video",
      thumbnail: "/media/Meditation.jpg",
      xpValue: 30,
      description: "A breathing-focused guided meditation to help regulate emotions."
    },
    {
      id: "meditation2",
      title: "Nature Meditation",
      url: "/media/video2.mp4",
      type: "video",
      thumbnail: "/media/meditation22.png",
      xpValue: 25,
      description: "Uses nature visualization to reduce rumination and negative thought patterns."
    },
    {
      id: "meditation3",
      title: "Mindful Movement",
      url: "/media/video3.mp4",
      type: "video",
      thumbnail: "/media/yoga.jpg",
      xpValue: 35,
      description: "A gentle movement practice that combines mindfulness with physical awareness."
    },
  ];

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const updateProgressLoop = () => {
      updateProgress();
      animationFrameId = requestAnimationFrame(updateProgressLoop);
    };

    if (audioRef.current) {
      animationFrameId = requestAnimationFrame(updateProgressLoop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setIsLoading(false);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setActiveAudio(null);
        setCurrentTime(0);
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        toast.error('Failed to load audio file');
      });
      audioRef.current.addEventListener('loadstart', () => {
        setIsLoading(true);
      });
    }

    // Set volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.removeEventListener('loadstart', () => {});
      }
    };
  }, [volume]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const togglePlay = async (item: MediaItem) => {
    const selectedAudio = mediaItems.find(audio => audio.id === item.id);
    if (!selectedAudio) return;

    if (activeAudio === item.id) {
      // Toggle play/pause for current audio
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
          updateCognitiveLevel(Math.floor(item.xpValue / 3));
        } catch (error) {
          console.error("Audio playback error:", error);
          toast.error("Failed to play audio. Please try again.");
          setIsPlaying(false);
        }
      }
    } else {
      // Play new audio
      if (audioRef.current) {
        try {
          setIsLoading(true);
          audioRef.current.src = selectedAudio.url;
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          setIsPlaying(true);
          setActiveAudio(item.id);
          updateCognitiveLevel(item.xpValue);
          toast.success(`Now playing: ${selectedAudio.title}`);
        } catch (error) {
          console.error("Audio playback error:", error);
          toast.error("Failed to play audio. Please try again.");
          setIsPlaying(false);
          setActiveAudio(null);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const adjustVolume = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleVideoProgress = (videoId: string, event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.target as HTMLVideoElement;
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: video.currentTime
    }));
  };

  const handleVideoDuration = (videoId: string, event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.target as HTMLVideoElement;
    setVideoDuration(prev => ({
      ...prev,
      [videoId]: video.duration
    }));
  };

  const handleVideoPlay = (videoId: string) => {
    setIsVideoPlaying(prev => ({
      ...prev,
      [videoId]: true
    }));
  };

  const handleVideoPause = (videoId: string) => {
    setIsVideoPlaying(prev => ({
      ...prev,
      [videoId]: false
    }));
  };

  const handleVideoSeek = (videoId: string, value: number[]) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.currentTime = value[0];
      setVideoProgress(prev => ({
        ...prev,
        [videoId]: value[0]
      }));
    }
  };

  const openVideo = (item: MediaItem) => {
    try {
      const videoUrl = item.url;
      const video = document.createElement('video');
      video.src = videoUrl;
      videoRefs.current[item.id] = video;
      
      video.addEventListener('timeupdate', () => handleVideoProgress(item.id, { target: video } as any));
      video.addEventListener('loadedmetadata', () => handleVideoDuration(item.id, { target: video } as any));
      video.addEventListener('play', () => handleVideoPlay(item.id));
      video.addEventListener('pause', () => handleVideoPause(item.id));
      
      window.open(videoUrl, "_blank");
      updateCognitiveLevel(item.xpValue);
      toast.success(`Enjoying: ${item.title}`, {
        description: "Video opened in new tab"
      });
    } catch (error) {
      console.error("Error opening video:", error);
      toast.error("Failed to open video. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Relaxation Center
          </h1>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 border-primary/30"
            onClick={() => setShowCbtInfo(!showCbtInfo)}
          >
            <Info className="h-4 w-4 text-primary" />
            <span>About Relaxation in CBT</span>
          </Button>
        </div>

        {showCbtInfo && (
          <Card className="bg-[#0F172A] backdrop-blur-sm border border-gray-800/40 rounded-xl">
            <CardHeader className="space-y-6 text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-[#2AADA1]" />
                <span className="text-white font-display text-3xl">Relaxation in Modern CBT</span>
              </CardTitle>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                The relaxation techniques provided here are a key component of modern Cognitive Behavioral Therapy (CBT). They work by activating your parasympathetic nervous system – the body's natural "rest and digest" mode – which counteracts the physiological symptoms of stress and anxiety.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1F8B88] rounded-xl p-6 text-center">
                  <h3 className="font-display text-[#9FFFF5] text-2xl mb-4">
                    Physical Benefits
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    Reduces muscle tension, lowers blood pressure and heart rate, and improves breathing patterns associated with anxiety.
                  </p>
                </div>
                <div className="bg-[#7E22CE] rounded-xl p-6 text-center">
                  <h3 className="font-display text-[#E9D5FF] text-2xl mb-4">
                    Cognitive Benefits
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    Creates mental space to recognize and challenge negative thought patterns, improving cognitive flexibility.
                  </p>
                </div>
                <div className="bg-[#3730A3] rounded-xl p-6 text-center">
                  <h3 className="font-display text-[#C7D2FE] text-2xl mb-4">
                    Emotional Regulation
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    Helps build awareness of emotional states and provides skills to modulate intense emotions through sensory focus.
                  </p>
                </div>
              </div>

              <div className="bg-[#1F8B88] rounded-xl p-6 text-center">
                <h4 className="text-[#9FFFF5] font-display text-2xl mb-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9FFFF5]"></span>
                  The CBT-Relaxation Connection
                </h4>
                <p className="text-gray-200 leading-relaxed max-w-3xl mx-auto">
                  Regular practice of these relaxation techniques helps build neural pathways that make stress management increasingly automatic over time. This combination creates a powerful approach that addresses both physiological responses and cognitive patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Music Section */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Music className="w-6 h-6 text-primary" />
                Calming Sounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {mediaItems
                    .filter((item) => item.type === "music")
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border ${activeAudio === item.id ? 'bg-primary/10 border-primary/30' : 'bg-black/40 border-gray-800'} hover:bg-black/50 transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className={`font-medium ${activeAudio === item.id ? 'text-primary' : 'text-gray-300'}`}>
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500">+{item.xpValue} XP</p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => togglePlay(item)}
                                  disabled={isLoading}
                                  className={`hover:scale-110 transition-transform ${
                                    activeAudio === item.id ? 'text-primary bg-primary/10' : 'text-gray-400'
                                  } hover:text-primary hover:bg-primary/10`}
                                >
                                  {isLoading && activeAudio === item.id ? (
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  ) : activeAudio === item.id && isPlaying ? (
                                    <Pause className="w-6 h-6" />
                                  ) : (
                                    <Play className="w-6 h-6" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isLoading ? 'Loading...' : activeAudio === item.id && isPlaying ? 'Pause' : 'Play'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                        
                        {activeAudio === item.id && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                            <Slider 
                              value={[currentTime]} 
                              max={duration || 100} 
                              step={1} 
                              onValueChange={seekTo}
                              className="cursor-pointer"
                            />
                            <div className="flex items-center gap-3">
                              <WavesIcon className="h-4 w-4 text-gray-500" />
                              <Slider 
                                value={[volume]} 
                                max={1} 
                                step={0.01} 
                                onValueChange={adjustVolume}
                                className="cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Video className="w-6 h-6 text-primary" />
                Meditation Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-6">
                  {mediaItems
                    .filter((item) => item.type === "video")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg overflow-hidden border border-gray-800 bg-black/40"
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="relative group cursor-pointer">
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-primary/20 hover:bg-primary/40 rounded-full p-3 transition-colors">
                                  <Play className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{item.title}</DialogTitle>
                            </DialogHeader>
                            <div className="aspect-video w-full">
                              <video
                                ref={el => videoRefs.current[item.id] = el}
                                src={item.url}
                                className="w-full h-full rounded-lg"
                                controls
                                onTimeUpdate={(e) => handleVideoProgress(item.id, e)}
                                onLoadedMetadata={(e) => handleVideoDuration(item.id, e)}
                                onPlay={() => handleVideoPlay(item.id)}
                                onPause={() => handleVideoPause(item.id)}
                              />
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{formatTime(videoProgress[item.id] || 0)}</span>
                                <span>{formatTime(videoDuration[item.id] || 0)}</span>
                              </div>
                              <Slider 
                                value={[videoProgress[item.id] || 0]} 
                                max={videoDuration[item.id] || 100} 
                                step={1} 
                                onValueChange={(value) => handleVideoSeek(item.id, value)}
                                className="cursor-pointer"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>

                        <div className="p-4">
                          <h3 className="text-gray-200 font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-primary">+{item.xpValue} XP</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-primary hover:bg-primary/10"
                              onClick={() => openVideo(item)}
                            >
                              Open in new tab
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden audio element for reference */}
      <audio className="hidden" ref={audioRef} />
    </Layout>
  );
};

export default Relax;

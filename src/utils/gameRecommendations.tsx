import { Flower2, Music, Video } from "lucide-react";

// Icon type for recommendations
export type IconType = "flower" | "music" | "video";

export interface Recommendation {
  title: string;
  description: string;
  type: "meditation" | "music" | "video";
  iconType: IconType;
  link?: string;
  duration?: string;
}

// Function to get personalized recommendations based on game performance
export const getRecommendations = (gameType: string, score: number, level: number): Recommendation[] => {
  // Base recommendations (always include at least one of each type)
  
  // Base recommendations (always include at least one of each type)
  const baseRecommendations: Recommendation[] = [
    {
      title: "Mindful Breathing",
      description: "A quick 5-minute meditation to reset your mental focus",
      type: "meditation",
      iconType: "flower",
      link: "/meditation",
      duration: "5 min"
    },
    {
      title: "Focus Ambient",
      description: "Calm instrumental music designed to improve concentration",
      type: "music",
      iconType: "music",
      link: "/relax",
      duration: "15 min"
    },
    {
      title: "Cognitive Training",
      description: "Short video with techniques to improve mental processing",
      type: "video",
      iconType: "video",
      link: "/relax",
      duration: "8 min"
    }
  ];
  
  // Game-specific recommendations
  const gameRecommendations: Record<string, Recommendation[]> = {
    memory: [
      {
        title: "Memory Enhancement",
        description: "Specific meditation for improving memory retention",
        type: "meditation",
        iconType: "flower",
        link: "/meditation",
        duration: "7 min"
      },
      {
        title: "Alpha Wave Music",
        description: "Sound patterns that support memory function",
        type: "music",
        iconType: "music",
        link: "/relax",
        duration: "20 min"
      }
    ],
    puzzle: [
      {
        title: "Problem Solving Focus",
        description: "Meditation to enhance analytical thinking",
        type: "meditation",
        iconType: "flower",
        link: "/meditation",
        duration: "6 min"
      },
      {
        title: "Spatial Reasoning Guide",
        description: "Video tutorial on improving spatial intelligence",
        type: "video",
        iconType: "video",
        link: "/relax",
        duration: "12 min"
      }
    ],
    pattern: [
      {
        title: "Pattern Recognition",
        description: "Meditation for enhancing pattern identification",
        type: "meditation",
        iconType: "flower",
        link: "/meditation",
        duration: "8 min"
      }
    ],
    math: [
      {
        title: "Numerical Focus",
        description: "Guided meditation for mathematical thinking",
        type: "meditation",
        iconType: "flower",
        link: "/meditation",
        duration: "5 min"
      },
      {
        title: "Math Processing Techniques",
        description: "Video with mental math enhancement methods",
        type: "video",
        iconType: "video",
        link: "/relax",
        duration: "10 min"
      }
    ],
    reaction: [
      {
        title: "Reflex Meditation",
        description: "Meditation to improve reaction time",
        type: "meditation",
        iconType: "flower",
        link: "/meditation",
        duration: "4 min"
      },
      {
        title: "Response Enhancement",
        description: "Binaural beats designed to improve reaction speed",
        type: "music",
        iconType: "music",
        link: "/relax",
        duration: "15 min"
      }
    ],
    focus: [
      {
        title: "Deep Focus",
        description: "Meditation for sustained attention",
        type: "meditation",
        iconType: "flower",
        link: "/meditation",
        duration: "10 min"
      },
      {
        title: "Concentration Music",
        description: "Specially designed audio to enhance focus",
        type: "music",
        iconType: "music",
        link: "/relax",
        duration: "25 min"
      }
    ]
  };
  
  // Combine base and game-specific recommendations
  const specificRecs = gameRecommendations[gameType] || [];
  
  // If score is high, add a "challenge" recommendation
  if (score > 50) {
    specificRecs.push({
      title: "Advanced Techniques",
      description: `Level up your ${gameType} skills with advanced strategies`,
      type: "video",
      iconType: "video",
      link: "/relax",
      duration: "15 min"
    });
  }
  
  return [...specificRecs, ...baseRecommendations];
};

// Helper function to render the correct icon component based on type
export const getIconComponent = (iconType: IconType) => {
  switch (iconType) {
    case "flower":
      return <Flower2 className="h-5 w-5 text-teal-400" />;
    case "music":
      return <Music className="h-5 w-5 text-blue-400" />;
    case "video":
      return <Video className="h-5 w-5 text-purple-400" />;
    default:
      return null;
  }
};

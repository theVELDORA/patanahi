
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";

interface GameInstructionsProps {
  gameType: string;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({ gameType }) => {
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
    <div className="mt-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="instructions" className="border-gray-700">
          <AccordionTrigger className="text-sm text-gray-400 hover:text-gray-300 py-2">
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
  );
};

export default GameInstructions;

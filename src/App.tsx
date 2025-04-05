
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Games from "./pages/Games";
import Relax from "./pages/Relax";
import Talk from "./pages/Talk";
import LevelProgress from "./pages/LevelProgress";
import Meditation from "./pages/Meditation"; 
import GamePage from "./pages/GamePage";
import GameHistory from "./pages/GameHistory";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game/:gameType" element={<GamePage />} />
            <Route path="/game-history" element={<GameHistory />} />
            <Route path="/relax" element={<Relax />} />
            <Route path="/talk" element={<Talk />} />
            <Route path="/level-progress" element={<LevelProgress />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

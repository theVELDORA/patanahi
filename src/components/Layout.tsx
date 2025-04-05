
import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] bg-fixed overflow-hidden relative">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[140px] translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full bg-teal-500/5 blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {showBackButton && (
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-400 hover:bg-teal-400/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
              {location.pathname !== "/meditation" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-400 hover:bg-teal-400/10 flex items-center gap-1"
                  onClick={() => navigate("/meditation")}
                >
                  <Flower2 className="h-4 w-4" />
                  Meditation
                </Button>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

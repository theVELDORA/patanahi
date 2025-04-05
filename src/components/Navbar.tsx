import { Link } from "react-router-dom";
import { MessageCircle, GamepadIcon, Music, Mic, User, Trophy, LogOut, LogIn, Menu, X, Bell, Settings, CheckCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'achievement', message: 'New achievement unlocked!', read: false, time: '2m ago' },
    { id: 2, type: 'reminder', message: 'Time for your daily meditation', read: false, time: '15m ago' },
    { id: 3, type: 'progress', message: 'You\'ve reached level 5!', read: false, time: '1h ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const isLoggedIn = false;
  const userInitials = "GU";

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marked as read");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { to: "/chat", icon: <MessageCircle size={20} />, label: "Chat" },
    { to: "/games", icon: <GamepadIcon size={20} />, label: "Games" },
    { to: "/relax", icon: <Music size={20} />, label: "Relax" },
    { to: "/talk", icon: <Mic size={20} />, label: "Talk" },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-lg border-b border-gray-800/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-blue-300 hover:via-purple-400 hover:to-pink-400 transition-all duration-300">
            Rimuru
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 text-gray-300 hover:text-primary transition-colors font-medium"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Profile and Notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative hidden md:block">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-300 hover:text-primary hover:bg-white/5"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium text-gray-200">Notifications</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-400 hover:text-primary"
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 border-b border-gray-700/50 hover:bg-white/5 cursor-pointer transition-colors ${
                          notification.read ? 'opacity-70' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start gap-2">
                          {notification.type === 'achievement' && (
                            <Trophy className="h-4 w-4 text-yellow-400 mt-0.5" />
                          )}
                          {notification.type === 'reminder' && (
                            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                          )}
                          {notification.type === 'progress' && (
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-200">{notification.message}</p>
                            <span className="text-xs text-gray-400">{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-300">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-xl font-heading font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">Rimuru</span>
                    </div>
                    <nav className="flex flex-col gap-4 mt-8">
                      {menuItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-colors p-3 rounded-lg hover:bg-white/5"
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                      <div className="mt-auto pt-4 border-t border-gray-700">
                        <Link
                          to="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-colors p-3 rounded-lg hover:bg-white/5"
                        >
                          <Settings size={20} />
                          <span className="font-medium">Settings</span>
                        </Link>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-700/50 hover:border-primary/50 transition-colors">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800/90 backdrop-blur-md border border-gray-700 mt-2" align="end">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="font-heading text-gray-200">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-gray-200">
                      <User className="mr-2 h-4 w-4 text-blue-400" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-gray-200">
                      <MessageCircle className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Chat History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-gray-200">
                      <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
                      <span>Game Scores</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-gray-200">
                      <LogOut className="mr-2 h-4 w-4 text-red-400" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="font-heading text-gray-200">Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <Link to="/profile" className="block">
                      <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-gray-200">
                        <User className="mr-2 h-4 w-4 text-blue-400" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-gray-200">
                      <LogIn className="mr-2 h-4 w-4 text-green-400" />
                      <span>Log in</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

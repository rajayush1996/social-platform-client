import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Film, UserRound, LogOut } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Don't show navbar on login page
  if (isLoginPage) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-reel-purple-500" />
          <span className="text-xl font-bold text-white">ReelVibes</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/videos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Videos
          </Link>
          <Link to="/reels" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Reels
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Blog
          </Link>
          {isAuthenticated && (
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <UserRound className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          ) : (
            <Button className="bg-reel-purple-600 hover:bg-reel-purple-700" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
        
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/videos" 
              className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Videos
            </Link>
            <Link 
              to="/reels" 
              className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Reels
            </Link>
            <Link 
              to="/blog" 
              className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 w-full"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            ) : (
              <Button className="bg-reel-purple-600 hover:bg-reel-purple-700 w-full" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

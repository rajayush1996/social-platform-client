
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Film, BookOpen } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-reel-purple-500" />
          <span className="text-xl font-bold text-white">ReelVibes</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/reels" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Reels
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Blog
          </Link>
          <Button className="bg-reel-purple-600 hover:bg-reel-purple-700">
            Get Started
          </Button>
        </div>
        
        {/* Mobile Navigation Toggle */}
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
      
      {/* Mobile Navigation Menu */}
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
            <Button className="bg-reel-purple-600 hover:bg-reel-purple-700 w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

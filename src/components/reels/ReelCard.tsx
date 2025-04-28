
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Play, Volume2, VolumeX } from "lucide-react";

interface ReelCardProps {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  views: number;
  duration: string;
}

const ReelCard = ({ id, thumbnail, title, author, views, duration }: ReelCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const formattedViews = views >= 1000000
    ? `${(views / 1000000).toFixed(1)}M`
    : views >= 1000
    ? `${(views / 1000).toFixed(1)}K`
    : views;

  return (
    <Link to={`/reels/${id}`}>
      <Card 
        className="overflow-hidden relative group card-hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-video relative overflow-hidden bg-black">
          <img 
            src={thumbnail} 
            alt={title} 
            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-100'}`}
          />
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-14 h-14 rounded-full bg-reel-purple-500/90 flex items-center justify-center transition-transform duration-300 transform group-hover:scale-110">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
          
          {/* Mute Toggle (only show when hovered) */}
          {isHovered && (
            <button 
              className="absolute bottom-2 left-2 bg-black/70 text-white p-1.5 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-foreground line-clamp-1">{title}</h3>
          <div className="flex justify-between mt-1">
            <p className="text-sm text-foreground/70">{author}</p>
            <p className="text-sm text-foreground/70">{formattedViews} views</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ReelCard;

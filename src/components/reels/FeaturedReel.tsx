
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface FeaturedReelProps {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  author: string;
  views: number;
}

const FeaturedReel = ({ id, thumbnail, title, description, author, views }: FeaturedReelProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedViews = views >= 1000000
    ? `${(views / 1000000).toFixed(1)}M`
    : views >= 1000
    ? `${(views / 1000).toFixed(1)}K`
    : views;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-reel-purple-900/60 to-black/60 border-0">
      <div className="relative aspect-[21/9] md:aspect-[21/9] lg:aspect-[21/8]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{title}</h2>
            <p className="text-foreground/90 mb-4 line-clamp-2 md:line-clamp-3">{description}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4">
              <div className="text-sm text-foreground/70">
                <span className="text-white">{author}</span> • {formattedViews} views
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-reel-purple-600 hover:bg-reel-purple-700"
                size="lg"
                asChild
              >
                <Link to={`/reels/${id}`}>
                  <Play className="mr-2 h-5 w-5" /> Watch Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedReel;

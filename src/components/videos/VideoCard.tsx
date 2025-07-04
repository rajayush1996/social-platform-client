
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoCardProps {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  views: number;
  duration: string;
}

const VideoCard = ({ id, thumbnail, title, author, views, duration }: VideoCardProps) => {
  const formattedViews = views >= 1000000
    ? `${(views / 1000000).toFixed(1)}M`
    : views >= 1000
    ? `${(views / 1000).toFixed(1)}K`
    : views;

  return (
    <Link to={`/videos/${id}`}>
      <Card className="overflow-hidden group hover:ring-2 hover:ring-reel-purple-500/50 transition-all duration-300">
        <div className="aspect-video relative overflow-hidden bg-black">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            crossOrigin="anonymous"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-reel-purple-500/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-foreground line-clamp-2 mb-2">{title}</h3>
          <div className="flex justify-between items-center text-sm text-foreground/70">
            <p>{author}</p>
            <p>{formattedViews} views</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default VideoCard;

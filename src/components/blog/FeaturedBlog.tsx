
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface FeaturedBlogProps {
  id: string;
  thumbnail: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const FeaturedBlog = ({ id, thumbnail, title, excerpt, author, date, category, readTime }: FeaturedBlogProps) => {
  return (
    <Card className="overflow-hidden border-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative aspect-square md:aspect-auto">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-reel-purple-900/60 to-black/60">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-reel-purple-500/10 text-reel-purple-400 hover:bg-reel-purple-500/20">
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground">{readTime} read</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
          <p className="text-foreground/80 mb-6 line-clamp-3">{excerpt}</p>
          <div className="flex items-center mb-6">
            <div className="text-sm">
              <span className="text-foreground/80">By </span>
              <span className="font-medium">{author}</span>
              <span className="mx-2">•</span>
              <span className="text-foreground/80">{date}</span>
            </div>
          </div>
          <Button 
            className="w-fit bg-reel-purple-600 hover:bg-reel-purple-700"
            asChild
          >
            <Link to={`/blog/${id}`}>
              <BookOpen className="mr-2 h-4 w-4" /> Read Article
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedBlog;


import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  id: string;
  thumbnail: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const BlogCard = ({ id, thumbnail, title, excerpt, author, date, category, readTime }: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <Card className="overflow-hidden h-full card-hover">
        <div className="aspect-[16/9] relative overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-reel-purple-500/10 text-reel-purple-400 hover:bg-reel-purple-500/20">
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground">{readTime} read</span>
          </div>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">By {author}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;

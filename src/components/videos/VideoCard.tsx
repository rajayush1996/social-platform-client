/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VideoCard.tsx

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { formatDuration, formatCount } from "@/lib/utils";

export default function VideoCard({ v }: any) {
  const {
    _id: id,
    thumbnailUrl: thumbnail,
    previewUrl,
    title,
    author,
    lengthSec,
  } = v;

  const authorName =
    author ||
    v.username ||
    v.user?.displayName ||
    (v.createdBy === 'admin' ? 'Admin' : undefined) ||
    'Unknown';


  const duration = formatDuration(lengthSec);
  const [hovered, setHovered] = useState(false);

  const views = v.stats?.views ?? v.views ?? 0;
  const reviews =
    v.stats?.comments ?? v.stats?.reviews ?? v.reviewCount ?? 0;
  const formattedViews = formatCount(views);
  const formattedReviews = formatCount(reviews);

  return (
    <Link to={`/videos/${id}`}>
      <Card
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="
          flex flex-col h-full overflow-hidden
          bg-card text-card-foreground
          rounded-lg shadow-md
          transition-all duration-300
          hover:ring-2 hover:ring-pink-500
        "
      >
        {/* thumbnail/video */}
        <div className="relative aspect-video flex-shrink-0 bg-black overflow-hidden">
          <img
            src={hovered && previewUrl ? previewUrl : thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            crossOrigin="anonymous"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 text-xs rounded text-white">
            {duration}
          </div>
        </div>

        {/* text area */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-medium mb-2 line-clamp-2 truncate">{title}</h3>
          <div className="mt-auto flex justify-between text-sm text-card-foreground/70">
            <span>{authorName}</span>
            <span>
              {formattedViews} views
            </span>
             {/* {formattedReviews} reviews */}
          </div>
        </div>
      </Card>
    </Link>
  );
}

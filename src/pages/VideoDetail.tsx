import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useVideo } from '@/hooks/useVideo';
import Layout from '@/components/Layout';
import { useRef, useState } from 'react';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading, isError } = useVideo(id!);
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(null);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const seconds = video.duration;
      setDuration(seconds);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">Loading video...</span>
        </div>
      </Layout>
    );
  }

  if (isError || !video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Video not found</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedViews = video.views >= 1000000
    ? `${(video.views / 1000000).toFixed(1)}M`
    : video.views >= 1000
    ? `${(video.views / 1000).toFixed(1)}K`
    : video.views;

  // Default thumbnail if none is provided
  const defaultThumbnail = 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81';

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-background/80 rounded-2xl shadow-xl p-6">
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Videos
          </Button>
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <video
              src={video.mediaFile.url}
              poster={video.thumbnail?.url || defaultThumbnail}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-contain rounded-xl"
              controls
              autoPlay={false}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{video.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <span>By {video?.user?.username || 'Unknown Author'}</span>
            <span>• {formattedViews} views</span>
            <span>• {video.duration || duration}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail; 
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useVideo } from '@/hooks/useVideo';
import Layout from '@/components/Layout';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading, isError } = useVideo(id!);

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
              poster={video.thumbnail.url}
              className="w-full h-full object-contain rounded-xl"
              controls
              autoPlay
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{video.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <span>By {video.author}</span>
            <span>• {formattedViews} views</span>
            <span>• {video.duration}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail; 
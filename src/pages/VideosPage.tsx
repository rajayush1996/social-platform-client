import VideoCard from "@/components/videos/VideoCard";
import { useVideos } from "@/hooks/useVideo";
import Layout from "@/components/Layout";

const VideosPage = () => {
  const { data, isLoading, isError } = useVideos();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">Loading videos...</span>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-red-500">Failed to load videos. Please try again later.</span>
        </div>
      </Layout>
    );
  }

  if (!data || !data.videos || data.videos.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">No videos available.</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Videos</h1>
            <p className="text-lg text-foreground/90">
              Watch and enjoy our collection of long-form video content
            </p>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.videos.map(video => (
              <VideoCard 
                key={video._id}
                id={video._id}
                thumbnail={video.thumbnail?.url || 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81'}
                title={video.title || 'Untitled Video'}
                author={video.author || 'Unknown Author'}
                views={video.views || 0}
                duration={video.duration || '0:00'}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VideosPage;

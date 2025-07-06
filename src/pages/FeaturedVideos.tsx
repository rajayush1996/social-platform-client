import VideoCard from "@/components/videos/VideoCard";

export function FeaturedVideos({ videos }: { videos: any[] }) {
    if (!videos?.length) return null;
  
    return (
      <section className="py-12 px-5">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Most Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video._id || video.id}
                id={video._id || video.id}
                thumbnail={video?.thumbnailDetails?.url || ''}
                title={video.title}
                author={video.categoryId?.name || 'Unknown'}
                views={video.stats?.views || 0}
                duration={video.videoSpecific?.duration || '0:00'}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
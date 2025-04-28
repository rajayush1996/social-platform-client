
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/videos/VideoCard";
import { reelsData } from "@/data/mockData";

const VideosPage = () => {
  // Reuse reels data for now as mock videos data
  const videos = reelsData;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
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
              {videos.map(video => (
                <VideoCard 
                  key={video.id}
                  id={video.id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  author={video.author}
                  views={video.views}
                  duration={video.duration}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VideosPage;

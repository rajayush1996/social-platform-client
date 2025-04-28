
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReelCard from "@/components/reels/ReelCard";
import { reelsData } from "@/data/mockData";

const ReelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Find the current reel
  const reel = reelsData.find(reel => reel.id === id);
  
  // Get recommended reels (exclude current)
  const recommendedReels = reelsData
    .filter(item => item.id !== id)
    .slice(0, 4);
  
  // Format views 
  const formattedViews = reel?.views ? (
    reel.views >= 1000000
      ? `${(reel.views / 1000000).toFixed(1)}M`
      : reel.views >= 1000
      ? `${(reel.views / 1000).toFixed(1)}K`
      : reel.views
  ) : 0;

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  // Update progress bar
  const updateProgress = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!reel) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Reel not found</h1>
            <p className="text-muted-foreground mb-6">The reel you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/reels">Back to Reels</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
        <div className="container px-4 mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src=""
                  poster={reel.thumbnail}
                  className="w-full aspect-video object-contain"
                  onTimeUpdate={updateProgress}
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Video Controls */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="p-4 flex justify-end">
                    {/* Top controls can go here if needed */}
                  </div>
                  
                  <div className="p-4">
                    {/* Progress bar */}
                    <div className="w-full bg-white/30 h-1 rounded-full mb-4 cursor-pointer">
                      <div 
                        className="bg-reel-purple-500 h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    {/* Control buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          className="text-white rounded-full p-2 hover:bg-white/10"
                          onClick={togglePlay}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </button>
                        
                        <button 
                          className="text-white rounded-full p-2 hover:bg-white/10"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-6 w-6" />
                          ) : (
                            <Volume2 className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                      
                      <button 
                        className="text-white rounded-full p-2 hover:bg-white/10"
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? (
                          <Minimize className="h-6 w-6" />
                        ) : (
                          <Maximize className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="mt-6">
                <h1 className="text-2xl font-bold">{reel.title}</h1>
                <div className="flex items-center text-muted-foreground mt-2">
                  <span>{formattedViews} views</span>
                  <span className="mx-2">•</span>
                  <span>{reel.duration}</span>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-reel-purple-600 flex items-center justify-center text-white font-bold">
                    {reel.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{reel.author}</h3>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-foreground/80">{reel.description}</p>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Recommended Reels</h2>
              <div className="space-y-4">
                {recommendedReels.map(rec => (
                  <ReelCard 
                    key={rec.id}
                    id={rec.id}
                    thumbnail={rec.thumbnail}
                    title={rec.title}
                    author={rec.author}
                    views={rec.views}
                    duration={rec.duration}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReelDetail;

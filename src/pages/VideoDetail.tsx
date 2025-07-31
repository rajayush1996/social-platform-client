/* VideoDetail.tsx */
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useVideo, useVideos } from "@/hooks/useVideo";
import Layout from "@/components/Layout";
import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import Hls from "hls.js";

// HLS‐aware <video> wrapper
type HlsVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
};
const HlsVideo = forwardRef<HTMLVideoElement, HlsVideoProps>(
  ({ src, ...props }, ref) => {
    const vidRef = useRef<HTMLVideoElement>(null);
    useImperativeHandle(ref, () => vidRef.current!);

    useEffect(() => {
      const v = vidRef.current!;
      let hls: Hls | null = null;
      if (src.endsWith(".m3u8") && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(v);
      } else {
        v.src = src;
      }
      return () => {
        if (hls) hls.destroy();
      };
    }, [src]);

    return (
      <video
        ref={vidRef}
        {...props}
        playsInline
        webkit-playsinline="true"
        controls
      />
    );
  }
);

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading, isError } = useVideo(id!);
  const { data: recsData, isLoading: recsLoading } = useVideos({
    selectedMediaId: id,
    recommend: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // SCROLL INTO VIEW on initial load
  useEffect(() => {
    if (!isLoading && video && containerRef.current && !hasScrolled) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      containerRef.current.focus({ preventScroll: true });
      setHasScrolled(true);
    }
  }, [isLoading, video, hasScrolled]);

  // Reset scroll flag when switching videos
  useEffect(() => {
    setHasScrolled(false);
  }, [id]);

  if (isLoading) return <Layout>Loading…</Layout>;
  if (isError || !video)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold">Video not found</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft /> Back
        </Button>

        {/* Video Container with auto-scroll ref */}
        <div ref={containerRef} tabIndex={0} className="max-w-4xl mx-auto mb-6">
          <HlsVideo
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Title & metadata */}
        <div className="max-w-4xl mx-auto text-white space-y-1">
          <h1 className="text-3xl font-bold">{video.title}</h1>
          <p className="text-sm text-gray-400">
            By {video.username || "Unknown"} • {video.views} views
          </p>
          {video.description && (
            <p className="mt-2 text-gray-200">{video.description}</p>
          )}
        </div>

        {/* Recommended Videos */}
        {!recsLoading && recsData?.results?.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Recommended Videos</h2>

            {/* 
      - auto-rows-fr: makes every row the same height
      - grid-cols-2/...: your responsive columns
    */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-fr">
              {recsData.results.map((rec) => (
                <div
                  key={rec._id}
                  onClick={() => navigate(`/videos/${rec._id}`)}
                  className="cursor-pointer flex flex-col h-full bg-gray-800 rounded-lg overflow-hidden"
                >
                  {/* fixed 16:9 box */}
                  <div className="relative pb-[56.25%]">
                    <img
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* flex-1 so this area always grows to fill the card */}
                  <div className="p-2 flex-1">
                    {/* clamp to 2 lines */}
                    <p className="text-sm text-white line-clamp-2">
                      {rec.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

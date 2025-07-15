/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSlider({ videos }: { videos: any[] }) {
  const [current, setCurrent] = useState(0);
  const total = videos.length;
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const next = () => setCurrent((c) => (c + 1 + total) % total);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  // auto-advance every 5s
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // pause on hover
  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  };

  // whenever current slide changes, reset the videoRef
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // wait until metadata is loaded, then jump to mid
    const onLoaded = () => {
      vid.currentTime = vid.duration / 2;
      vid.removeEventListener("loadedmetadata", onLoaded);
    };
    vid.addEventListener("loadedmetadata", onLoaded);

    // ensure it starts from that point
    vid.play().catch(() => {});
  }, [current, videos]);

  const slide = videos[current];

  return (
    <>
      <section className="hero_slider mt-12">
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Picks for You</h2>
            <button
              onClick={() => navigate("/videos")}
              className="text-pink-500 hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div
            ref={containerRef}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="mx-auto relative rounded-2xl overflow-hidden shadow-lg h-[500px]"
          >
            {/* Background: thumbnail or video */}
            {slide?.thumbnailDetails?.url ? (
              <img
                src={slide.thumbnailDetails.url}
                alt={slide.title || "Slide thumbnail"}
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : slide?.mediaDetails?.url ? (
              <video
                ref={videoRef}
                src={slide.mediaDetails.url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                crossOrigin="anonymous"
              />
            ) : (
              <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-xl">
                No Preview Available
              </div>
            )}

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-10 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {slide?.title}
              </h2>
              {slide?.subtitle && (
                <p className="text-lg mb-4 text-white/90">{slide.subtitle}</p>
              )}
              <Button
                className="bg-pink-500 hover:bg-pink-600 text-white"
                onClick={() => navigate(`/videos/${slide?.id}`)}
              >
                <span className="inline-flex items-center gap-2">
                  <Play className="w-6 h-6 text-white" fill="currentColor" />
                  Play now
                </span>
              </Button>
            </div>

            {/* Arrows */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-pink-600 text-white p-2 rounded-full transition"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-pink-600 text-white p-2 rounded-full transition"
            >
              <ChevronRight />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 right-6 z-30 hidden md:flex gap-2">
              {videos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    current === idx ? "bg-pink-500" : "bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

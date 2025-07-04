import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Hot Summer Vacation Getaway",
    subtitle: "Watch this steamy encounter during a tropical vacation",
    image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
  },
  {
    title: "Office Romance Unleashed",
    subtitle: "Watch a secret romance unfold after hours",
    image: "https://images.pexels.com/photos/1181351/pexels-photo-1181351.jpeg",
  },
];

export default function HeroSlider({ videos }: { videos: any[] }) {
  const [current, setCurrent] = useState(0);
  const total = videos.length;
  const navigate = useNavigate();

  const next = () => setCurrent((current + 1) % total);
  const prev = () => setCurrent((current - 1 + total) % total);

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto relative rounded-2xl overflow-hidden shadow-lg h-[500px]">
        {/* Background image */}
        <img
          src={videos[current]?.thumbnailDetails?.url}
          alt={videos[current]?.title}
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        {/* Content aligned to bottom-left */}
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{videos[current]?.title}</h2>
          <p className="text-lg mb-4 text-white/90">{videos[current]?.subtitle || ''}</p>
          <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => {
            navigate(`/videos/${videos[current]?.id}`);
          }}>
            <span className="flex items-center gap-2">▶️ Play Now</span>
          </Button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-pink-600 text-white p-2 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-pink-600 text-white p-2 rounded-full"
        >
          <ChevronRight />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 right-6 z-30 flex gap-2">
          {videos.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                current === idx ? "bg-pink-500" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EarnBannerProps {
  onClose: () => void;
}
export default function EarnBanner({ onClose }: EarnBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  function handleEarnBannerVisibility() {
    setVisible(false);
    onClose();
  }

  return (
    <div className="relative w-full bg-pink-600">
      {/* Close button */}
      <button
        onClick={handleEarnBannerVisibility}
        aria-label="Close banner"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full z-20"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Centered content */}
      <div className="flex items-center justify-center space-x-4 py-3">
        <span className="font-medium text-white">💸 Earn money with us</span>
        <Link to="/login">
          <Button size="sm" className="bg-white text-pink-600 hover:bg-gray-100 py-1 px-3">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
}

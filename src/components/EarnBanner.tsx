import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function EarnBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  // single “block” of content
  const Block = () => (
    <div className=" flex-shrink-0 flex items-center space-x-3 px-12 py-3">
      <span className="font-medium text-white">💸 Earn money with us</span>
      <Link to="/earn-money-with-us">
        <Button
          size="sm"
          className="bg-white text-pink-600 hover:bg-gray-100 py-1 px-3"
        >
          Learn More
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-pink-600">
      {/* ✖️ pill button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Close banner"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full z-20"
      >
        <X className="w-4 h-4" />
      </button>

      {/* two copies, so width = 200% */}
      <div className="flex animate-marquee whitespace-nowrap">
        <Block />
      </div>
    </div>
  );
}

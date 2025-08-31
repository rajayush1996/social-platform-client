import { ChangeEvent } from "react";

interface ReelScrubberProps {
  progress: number; // 0 to 1
  onSeek: (value: number) => void;
}

const ReelScrubber = ({ progress, onSeek }: ReelScrubberProps) => {
  const clamped = Math.min(Math.max(progress, 0), 1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  return (
    <div className="absolute bottom-0 left-0 w-full z-40">
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={clamped}
        onChange={handleChange}
        className="w-full h-1 appearance-none cursor-pointer bg-white/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-reel-purple-500 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-reel-purple-500"
        style={{
          background: `linear-gradient(to right, #eb49b7 ${clamped * 100}%, rgba(255,255,255,0.2) ${clamped * 100}%)`,
        }}
      />
    </div>
  );
};

export default ReelScrubber;
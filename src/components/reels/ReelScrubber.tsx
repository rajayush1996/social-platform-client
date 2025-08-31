interface ReelScrubberProps {
  progress: number; // 0 to 1
}

const ReelScrubber = ({ progress }: ReelScrubberProps) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return (
    <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-30">
      <div
        className="h-full bg-reel-purple-500 transition-all"
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
};

export default ReelScrubber;

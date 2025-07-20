// src/pages/ReelPage.tsx
import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReel } from '@/hooks/useReel'; // custom hook to fetch single reel
// import { useVideoDuration } from '@/hooks/useVideoDuration';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export default function ReelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: reel, isLoading, isError } = useReel(id!);
  const videoRef = useRef<HTMLVideoElement>(null);
  // const duration = useVideoDuration(reel?.mediaFileUrl || '');
  const duration = 0;

  const [muted, setMuted] = React.useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  if (isLoading) return <p>Loading reel...</p>;
  if (isError || !reel) return <p>Failed to load reel.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="link" onClick={() => navigate(-1)} className="mb-4">
        &larr; Back
      </Button>

      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={reel.mediaDetails.url}
          controls
          loop
          playsInline
          className="w-full h-auto"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
        <button
          onClick={() => setMuted(m => !m)}
          className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <h1 className="text-2xl font-bold mt-4">{reel.title}</h1>
      <p className="text-gray-400 mb-2">{new Date(reel.createdAt).toLocaleString()}</p>
      <p className="mb-4">{reel.description}</p>

      {/* Additional metadata */}
      <div className="text-sm text-gray-600 space-x-4">
        <span>Category: {reel.category}</span>
        <span>Views: {reel.views}</span>
        <span>Likes: {reel.likeCount}</span>
      </div>
    </div>
  );
}

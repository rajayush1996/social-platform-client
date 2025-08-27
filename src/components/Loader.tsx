import React from 'react';
import { BounceLoader } from 'react-spinners';

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
}

export default function Loader({ fullScreen = false, size = 80 }: LoaderProps) {
  const classes = fullScreen
    ? 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center'
    : 'flex items-center justify-center';
  return (
    <div className={classes}>
      <BounceLoader loading color="#ec4899" size={size} />
    </div>
  );
}

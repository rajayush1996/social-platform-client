// // src/hooks/useVideoDuration.ts
// import { useState, useEffect } from 'react';

// /**
//  * Given a video URL, returns a human‑readable duration string like "2:05" or "1:02:30".
//  */
// export function useVideoDuration(url: string) {
//   const [formatted, setFormatted] = useState('0:00');

//   useEffect(() => {
//     if (!url) return;

//     const vid = document.createElement('video');
//     vid.preload = 'metadata';
//     vid.src = url;

//     const onLoaded = () => {
//       const totalSec = Math.floor(vid.duration);
//       const hrs = Math.floor(totalSec / 3600);
//       const mins = Math.floor((totalSec % 3600) / 60);
//       const secs = totalSec % 60;

//       const mm = hrs
//         ? String(mins).padStart(2, '0')
//         : String(mins);
//       const ss = String(secs).padStart(2, '0');

//       setFormatted(hrs
//         ? `${hrs}:${mm}:${ss}`
//         : `${mm}:${ss}`);
//     };

//     vid.addEventListener('loadedmetadata', onLoaded);
//     return () => {
//       vid.removeEventListener('loadedmetadata', onLoaded);
//     };
//   }, [url]);

//   return formatted;
// }

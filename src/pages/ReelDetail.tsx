// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ArrowLeft } from "lucide-react";
// import Layout from "@/components/Layout";
// // import { useReel } from "@/hooks/useReel";

// const ReelDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [progress, setProgress] = useState(0);
  
//   // const { data: reel, isLoading, isError } = useReel(id!);

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
//           <span className="text-lg text-muted-foreground">Loading reel...</span>
//         </div>
//       </Layout>
//     );
//   }

//   if (isError || !reel) {
//     return (
//       <Layout>
//         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
//           <h2 className="text-2xl font-bold mb-4 text-foreground">Reel not found</h2>
//           <Button onClick={() => navigate(-1)} variant="outline">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
//           </Button>
//         </div>
//       </Layout>
//     );
//   }

//   // Format views 
//   const formattedViews = reel.views ? (
//     reel.views >= 1000000
//       ? `${(reel.views / 1000000).toFixed(1)}M`
//       : reel.views >= 1000
//       ? `${(reel.views / 1000).toFixed(1)}K`
//       : reel.views
//   ) : 0;

//   // Handle play/pause
//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   // Handle mute/unmute
//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   // Handle fullscreen
//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       videoRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   // Update progress
//   const updateProgress = () => {
//     if (videoRef.current) {
//       const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
//       setProgress(progress);
//     }
//   };

//   return (
//     <Layout>
//       <div className="container px-4 mx-auto py-8">
//         <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reels
//         </Button>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             {/* Video Player */}
//             <div className="relative bg-black rounded-lg overflow-hidden">
//               <video
//                 ref={videoRef}
//                 src={reel.mediaFileUrl}
//                 poster={reel.thumbnailUrl}
//                 className="w-full aspect-video object-contain"
//                 onTimeUpdate={updateProgress}
//                 onEnded={() => setIsPlaying(false)}
//               />
              
//               {/* Video Controls */}
//               <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity">
//                 <div className="p-4 flex justify-end">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:text-white hover:bg-white/20"
//                     onClick={toggleFullscreen}
//                   >
//                     {isFullscreen ? (
//                       <Minimize className="h-5 w-5" />
//                     ) : (
//                       <Maximize className="h-5 w-5" />
//                     )}
//                   </Button>
//                 </div>
                
//                 <div className="p-4">
//                   {/* Progress Bar */}
//                   <div className="w-full h-1 bg-white/30 rounded-full mb-4">
//                     <div
//                       className="h-full bg-reel-purple-500 rounded-full"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
                  
//                   {/* Control Buttons */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="text-white hover:text-white hover:bg-white/20"
//                         onClick={togglePlay}
//                       >
//                         {isPlaying ? (
//                           <Pause className="h-5 w-5" />
//                         ) : (
//                           <Play className="h-5 w-5" />
//                         )}
//                       </Button>
                      
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="text-white hover:text-white hover:bg-white/20"
//                         onClick={toggleMute}
//                       >
//                         {isMuted ? (
//                           <VolumeX className="h-5 w-5" />
//                         ) : (
//                           <Volume2 className="h-5 w-5" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Video Info */}
//             <div className="mt-6">
//               <h1 className="text-2xl font-bold">{reel.title}</h1>
//               <div className="flex items-center text-muted-foreground mt-2">
//                 <span>{formattedViews} views</span>
//               </div>
              
//               <Separator className="my-6" />
              
//               <div className="mt-6">
//                 <h3 className="font-semibold mb-2">Description</h3>
//                 <p className="text-foreground/80">{reel.description}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ReelDetail;

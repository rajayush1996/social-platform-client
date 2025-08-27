// pages/ReelsPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ReelsNavigation from "@/components/ReelsNavigation";
import { useReelsInfinite } from "@/hooks/useReel";
import { ReelCard } from "@/components/reels/ReelCard2";
import { BounceLoader } from "react-spinners";

export default function ReelsPage() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const startId = searchParams.get("reelId");

  const {
    data, isLoading, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useReelsInfinite(10);

  const reels = data?.pages.flatMap(p => p.results) || [];

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // When arriving with a reelId, load pages until it's found then scroll to it
  useEffect(() => {
    if (!startId) return;
    const el = document.getElementById(`reel-${startId}`);
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    } else if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [startId, data, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <Layout hideFooter>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <BounceLoader loading color="#ec4899" size={100}/>
        </div>
      </Layout>
    );
  }

  if (isError || reels.length === 0) {
    return (
      <Layout hideFooter>
        <div className="flex items-center justify-center h-full text-white">
          {isError ? 'Failed to load reels.' : 'No reels available.'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div
        className="
          absolute overflow-y-scroll snap-y snap-mandatory touch-pan-y
          left-0 right-0 bottom-[5rem]
          md:left-[12rem] md:right-[12rem] md:bottom-0
        "
        style={{ top: 'var(--header-height)' }}
      >
        {reels.map((r: any) => (
          <div id={`reel-${r._id}`} key={r._id} className="snap-start h-full flex justify-center">
            <div className="w-full max-w-md h-full">
              <ReelCard reel={r}/>
            </div>
          </div>
        ))}
        <div ref={loaderRef} className="h-1"/>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <ReelsNavigation/>
      </div>
    </Layout>
  );
}

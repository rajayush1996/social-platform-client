import { CSSProperties, useMemo } from "react";
import { cn } from "@/lib/utils";

type ExoClickAdProps = {
  zoneId?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

const buildIframeSrc = (zoneId: string) =>
  `https://syndication.exoclick.com/ads-iframe-display.php?idzone=${encodeURIComponent(
    zoneId
  )}&adtype=banner`;

const ExoClickAd = ({
  zoneId,
  width,
  height,
  className,
  style,
  title = "Advertisement",
}: ExoClickAdProps) => {
  const sanitizedZoneId = zoneId?.trim();

  const iframeSrc = useMemo(() => {
    if (!sanitizedZoneId) return null;
    return buildIframeSrc(sanitizedZoneId);
  }, [sanitizedZoneId]);

  if (!iframeSrc) {
    return null;
  }

  const inlineStyles: CSSProperties = {
    border: "none",
    overflow: "hidden",
    width: "100%",
    maxWidth: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    ...style,
  };

  return (
    <iframe
      title={title}
      src={iframeSrc}
      width={width ?? undefined}
      height={height ?? undefined}
      scrolling="no"
      frameBorder={0}
      allow="autoplay"
      loading="lazy"
      className={cn("block w-full", className)}
      style={inlineStyles}
    />
  );
};

export default ExoClickAd;

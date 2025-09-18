import { useEffect, useRef, type CSSProperties } from "react";

const EXOCLICK_SCRIPT_SRC = "https://a.exoclick.com/ads.js";

type ExoClickAdProps = {
  zoneId: string;
  width?: number;
  height?: number;
  className?: string;
  containerId?: string;
  style?: CSSProperties;
};

const ExoClickAd = ({
  zoneId,
  width,
  height,
  className,
  containerId,
  style,
}: ExoClickAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = adRef.current;
    if (!target) return;

    target.innerHTML = "";

    if (!zoneId) {
      if (import.meta.env.DEV) {
        console.warn("[ExoClickAd] Missing zoneId, nothing will render.");
      }
      return;
    }

    const configScript = document.createElement("script");
    configScript.type = "application/javascript";

    const configLines = [`var ad_idzone = "${zoneId}";`];
    if (width) configLines.push(`var ad_width = ${width};`);
    if (height) configLines.push(`var ad_height = ${height};`);

    configScript.innerHTML = configLines.join("\n");
    target.appendChild(configScript);

    const script = document.createElement("script");
    script.type = "application/javascript";
    script.src = EXOCLICK_SCRIPT_SRC;
    script.async = true;
    target.appendChild(script);

    return () => {
      target.innerHTML = "";
    };
  }, [zoneId, width, height]);

  return (
    <div
      ref={adRef}
      className={className}
      id={containerId}
      style={style}
    />
  );
};

export default ExoClickAd;

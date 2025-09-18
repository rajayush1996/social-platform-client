const parsePositiveNumber = (value?: string) => {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

export const exoClickAdConfig = {
  videoDetail: {
    vastTagUrl: import.meta.env.VITE_EXOCLICK_VAST_TAG ?? "https://s.magsrv.com/v1/vast.php?idzone=5725504",
    zoneId: import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_ID ?? "",
    width: parsePositiveNumber(import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_WIDTH),
    height: parsePositiveNumber(import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_HEIGHT),
  },
};

const parsePositiveNumber = (value?: string) => {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

const parseList = (value?: string) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const unique = <T,>(items: T[]) => Array.from(new Set(items));

const buildVastUrlFromZone = (zoneId: string) =>
  `https://s.magsrv.com/v1/vast.php?idzone=${encodeURIComponent(zoneId)}`;

const ensureVastUrl = (value: string) =>
  /^https?:/i.test(value) ? value : buildVastUrlFromZone(value);

const extractZoneIdFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("idzone") ?? undefined;
  } catch (error) {
    return undefined;
  }
};

const pickRandom = <T,>(items: T[]): T | null => {
  if (!items.length) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

const DEFAULT_VIDEO_VAST_ZONE = "5725504";

const envVideoZoneIds = parseList(import.meta.env.VITE_EXOCLICK_VAST_ZONE_IDS);
const singleVideoZoneId = (import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_ID ?? "").trim();
const combinedZoneIds = unique(
  [
    ...envVideoZoneIds,
    singleVideoZoneId,
    DEFAULT_VIDEO_VAST_ZONE,
  ].filter(Boolean)
);

const envVastUrl = (import.meta.env.VITE_EXOCLICK_VAST_TAG ?? "").trim();

const videoInstreamCandidates = [
  ...combinedZoneIds.map((zoneId) => ({
    zoneId,
    vastTagUrl: buildVastUrlFromZone(zoneId),
  })),
];

if (envVastUrl) {
  videoInstreamCandidates.push({
    zoneId: extractZoneIdFromUrl(envVastUrl),
    vastTagUrl: ensureVastUrl(envVastUrl),
  });
}

const getRandomVideoInstreamTag = () => {
  const candidate = pickRandom(videoInstreamCandidates);
  return candidate ? { ...candidate } : null;
};

export const exoClickAdConfig = {
  videoDetail: {
    instream: {
      candidates: videoInstreamCandidates.map((candidate) => ({
        ...candidate,
      })),
      getRandomTag: getRandomVideoInstreamTag,
    },
    banner: {
      zoneId: (import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_ID ?? "").trim(),
      width: parsePositiveNumber(
        import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_WIDTH
      ),
      height: parsePositiveNumber(
        import.meta.env.VITE_EXOCLICK_VIDEO_ZONE_HEIGHT
      ),
    },
  },
  sideLeft: {
    zoneId: (import.meta.env.VITE_EXOCLICK_LEFT_ZONE_ID ?? "5726730").trim(),
    width:
      parsePositiveNumber(import.meta.env.VITE_EXOCLICK_LEFT_ZONE_WIDTH) ?? 300,
    height:
      parsePositiveNumber(import.meta.env.VITE_EXOCLICK_LEFT_ZONE_HEIGHT) ?? 250,
  },
  sideRight: {
    zoneId: (import.meta.env.VITE_EXOCLICK_RIGHT_ZONE_ID ?? "5726752").trim(),
    width:
      parsePositiveNumber(import.meta.env.VITE_EXOCLICK_RIGHT_ZONE_WIDTH) ?? 300,
    height:
      parsePositiveNumber(import.meta.env.VITE_EXOCLICK_RIGHT_ZONE_HEIGHT) ?? 600,
  },
  mobileBanner: {
    zoneId: (import.meta.env.VITE_EXOCLICK_MOBILE_ZONE_ID ?? "5726760").trim(),
    width:
      parsePositiveNumber(import.meta.env.VITE_EXOCLICK_MOBILE_ZONE_WIDTH) ?? 300,
    height:
      parsePositiveNumber(import.meta.env.VITE_EXOCLICK_MOBILE_ZONE_HEIGHT) ?? 250,
  },
};

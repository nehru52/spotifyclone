import { getAudioCdnBaseUrl } from '../config/audioCdn';
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION, SANITY_API_TOKEN } from '../config/sanity';
import { Sight, AudioVariant, AudioLang, LangAudioFiles, Tour } from '../types';

const BASE = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

const LANGS: AudioLang[] = ['en', 'it', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pl', 'ru', 'ar', 'ko'];

// Build GROQ projection for all language audio blocks
const audioLangProjection = LANGS.map(
  (lang) =>
    `"${lang}": audio_${lang}{ "quick": audioQuick{url,duration,size}, "deep": audioDeep{url,duration,size}, "kids": audioKids{url,duration,size} }`
).join(',\n    ');

const SIGHTS_QUERY = encodeURIComponent(`*[_type == "sight" && defined(lat) && defined(lng)]{
  "id": slug.current,
  name,
  name_it,
  category,
  pack,
  lat,
  lng,
  radius,
  description,
  "thumbnail": thumbnail.asset->url + "?w=800&auto=format",
  tips,
  kidsMyth,
  transcripts,
  "audioFiles": {
    ${audioLangProjection}
  },
  "linkedTour": linkedTour->{
    "slug": slug.current,
    title,
    price,
    "site": sites[0]->{ domain }
  }
}`);

export type SanitySight = {
  id: string;
  name: string;
  name_it?: string;
  category?: string;
  pack?: 'essential' | 'full';
  lat: number;
  lng: number;
  radius?: number;
  description?: string;
  thumbnail?: string;
  tips?: string[];
  kidsMyth?: string;
  transcripts?: any;
  audioFiles?: LangAudioFiles;
  linkedTour?: {
    slug: string;
    title: string;
    price?: number;
    site?: { domain: string };
  };
};

const mapCategory = (cat?: string): Sight['category'] => {
  const map: Record<string, Sight['category']> = {
    ancient: 'ancient',
    religious: 'religious',
    museum: 'museum',
    piazza: 'piazza',
  };
  return map[cat ?? ''] ?? 'other';
};

const getFetchHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization if API token is available
  if (SANITY_API_TOKEN) {
    headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
  }
  
  return headers;
};

export const fetchSightsFromSanity = async (): Promise<Sight[]> => {
  console.log('[Sanity] Fetching sights from Sanity CMS...');
  const res = await fetch(`${BASE}?query=${SIGHTS_QUERY}`, {
    headers: getFetchHeaders(),
  });
  if (!res.ok) {
    console.error('[Sanity] Fetch failed:', res.status, res.statusText);
    throw new Error(`Sanity fetch failed: ${res.status}`);
  }
  const json = await res.json();
  const rows: SanitySight[] = json.result ?? [];
  console.log(`[Sanity] Fetched ${rows.length} sights`);
  const audioCdnBase = getAudioCdnBaseUrl();

  return rows
    .filter((r) => r.id && r.lat && r.lng)
    .map((r): Sight => {
      const audioFiles: LangAudioFiles = r.audioFiles ?? {};

      // Inject R2 URLs if CDN base is configured
      if (audioCdnBase) {
        const langs: AudioLang[] = LANGS;
        const variants: AudioVariant[] = ['quick', 'deep', 'kids'];

        // Map app IDs to R2 folder names
        const r2FolderMap: Record<string, string> = {
          'vatican-museums': 'vatican-museums',
          'st-peters-basilica': 'st-peters-basilica',
          'sistine-chapel': 'sistine-chapel',
          'vatican-pinacoteca': 'vatican-pinacoteca',
          'colosseum': 'colosseum',
          'forum': 'forum',
          'roman-forum': 'forum',
          'heart': 'heart',
          'jewish-ghetto': 'jewish-ghetto',
          'ostia-antica': 'ostia-antica',
          'pantheon': 'pantheon',
          'trastevere': 'trastevere'
        };

        // Existing R2 folders
        const existingR2Folders = new Set([
          'vatican-museums',
          'st-peters-basilica',
          'sistine-chapel',
          'vatican-pinacoteca',
          'colosseum',
          'forum',
          'heart',
          'jewish-ghetto',
          'ostia-antica',
          'pantheon',
          'trastevere'
        ]);

        for (const lang of langs) {
          for (const variant of variants) {
            const existing = audioFiles?.[lang]?.[variant]?.url?.trim() ?? '';
            if (!existing || existing.includes('example.com')) {
              const folderName = r2FolderMap[r.id] ?? r.id;
              
              if (existingR2Folders.has(folderName)) {
                // Only map the 'deep' variant since it's the only one we have.
                // We remove the fallback for kids/quick as they don't exist.
                if (variant === 'deep') {
                  const url = `${audioCdnBase}/${lang}/${folderName}/deep.mp3`;
                  audioFiles[lang] = audioFiles[lang] ?? {};
                  audioFiles[lang]![variant] = {
                    url,
                    duration: audioFiles[lang]?.[variant]?.duration ?? 0,
                    size: audioFiles[lang]?.[variant]?.size ?? 0,
                  };
                }
              }
            }
          }
        }
      }

      return {
        id: r.id,
        name: r.name,
        name_it: r.name_it,
        lat: r.lat,
        lng: r.lng,
        radius: r.radius ?? 20,
        category: mapCategory(r.category),
        has_tips: !!(r.tips?.length || r.kidsMyth),
        pack: r.pack ?? 'full',
        thumbnail: r.thumbnail ?? '',
        description: r.description ?? '',
        tips: r.tips,
        kidsMyth: r.kidsMyth,
        audioFiles,
        transcripts: r.transcripts ?? undefined,
        linkedTour: r.linkedTour,
      };
    });
};

// Audio Tours / Routes
// Query for both audio tours AND regular booking tours
const AUDIO_TOURS_QUERY = encodeURIComponent(`*[
  _type == "tour" || _type == "audioTour"
] | order(_createdAt desc) {
  "id": slug.current,
  title,
  "description": select(
    defined(description) && _type == "tour" => array::join(description[].children[].text, " "),
    description
  ),
  duration,
  category,
  difficulty,
  featured,
  "thumbnail": coalesce(mainImage.asset->url, thumbnail.asset->url) + "?w=800&auto=format",
  "stops": coalesce(stops, sights, route, itinerary)[]->{
    "id": slug.current,
    name,
    name_it,
    category,
    pack,
    lat,
    lng,
    radius,
    description,
    "thumbnail": thumbnail.asset->url + "?w=800&auto=format",
    tips,
    kidsMyth,
    "audioFiles": {
      ${audioLangProjection}
    }
  },
  price,
  tourType,
  highlights,
  location,
  groupSize
}`);

export type SanityAudioTour = {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  category?: string;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  featured?: boolean;
  thumbnail?: string;
  stops?: SanitySight[];
  price?: number;
  tourType?: string;
  highlights?: string[];
  location?: string;
  groupSize?: string;
};

export const fetchAudioToursFromSanity = async (): Promise<Tour[]> => {
  const url = `${BASE}?query=${AUDIO_TOURS_QUERY}`;
  console.log('[Sanity] Fetching audio tours from Sanity CMS...');
  console.log('[Sanity] URL:', url.substring(0, 100) + '...');
  
  const headers = getFetchHeaders();
  console.log('[Sanity] Auth Header present:', !!headers['Authorization']);

  const res = await fetch(url, {
    headers,
  });
  if (!res.ok) {
    console.error('[Sanity] Audio tours fetch failed:', res.status, res.statusText);
    throw new Error(`Sanity audio tours fetch failed: ${res.status}`);
  }
  const json = await res.json();
  const tours: SanityAudioTour[] = json.result ?? [];
  console.log(`[Sanity] Fetched ${tours.length} audio tours from API`);
  
  const mapped = tours
    .filter((t) => t.id && t.title)
    .map((t): Tour => ({
      id: t.id,
      title: t.title,
      description: t.description,
      duration: t.duration,
      thumbnail: t.thumbnail,
      category: t.category || t.tourType || 'Tour',
      difficulty: t.difficulty || 'moderate',
      featured: t.featured ?? false,
      downloadable: true,
      stops: (t.stops ?? [])
        .filter((s) => s.id && s.lat && s.lng)
        .map((s): Sight => ({
          id: s.id,
          name: s.name,
          name_it: s.name_it,
          lat: s.lat,
          lng: s.lng,
          radius: s.radius ?? 20,
          category: mapCategory(s.category),
          has_tips: !!(s.tips?.length || s.kidsMyth),
          pack: s.pack ?? 'full',
          thumbnail: s.thumbnail ?? '',
          description: s.description ?? '',
          tips: s.tips,
          kidsMyth: s.kidsMyth,
          audioFiles: s.audioFiles ?? {},
        })),
    }));
  return mapped;
};

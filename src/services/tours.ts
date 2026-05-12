import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION, SANITY_API_TOKEN } from '../config/sanity';

const BASE = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

export interface SanityTour {
  id: string;
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  thumbnail?: string;
  category?: string;
  highlights?: string[];
  location?: string;
  groupSize?: string;
}

const TOURS_QUERY = encodeURIComponent(`*[
  _type == "tour" || _type == "audioTour"
] | order(title asc) {
  "id": slug.current,
  title,
  "description": select(
    defined(description) && _type == "tour" => array::join(description[].children[].text, " "),
    description
  ),
  price,
  duration,
  "thumbnail": coalesce(mainImage.asset->url, thumbnail.asset->url) + "?w=600&auto=format",
  category,
  highlights,
  location,
  groupSize
}`);

const getFetchHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (SANITY_API_TOKEN) {
    headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
  }
  
  return headers;
};

export const fetchToursFromSanity = async (): Promise<SanityTour[]> => {
  try {
    if (!SANITY_PROJECT_ID) {
      console.warn('[Tours] SANITY_PROJECT_ID is missing');
      return [];
    }

    console.log('[Tours] Fetching tours from Sanity...');
    const res = await fetch(`${BASE}?query=${TOURS_QUERY}`, {
      headers: getFetchHeaders(),
    });
    
    if (!res.ok) {
      console.error('[Tours] Fetch failed:', res.status, res.statusText);
      return [];
    }
    
    const json = await res.json();
    
    if (json.error) {
      console.error('[Tours] Sanity error:', json.error);
      return [];
    }

    const tours: SanityTour[] = json.result ?? [];
    console.log(`[Tours] Fetched ${tours.length} tours from Sanity`);
    
    return tours;
  } catch (error) {
    console.error('[Tours] Error fetching tours:', error);
    return [];
  }
};

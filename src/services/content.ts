import { getContentProvider } from '../config/content';
import { Sight, Tour } from '../types';
import { fetchAudioToursFromPayload, fetchSightsFromPayload } from './payload';
import { fetchAudioToursFromSanity, fetchSightsFromSanity } from './sanity';
import { getMockTours, getMockSights } from '../data/mock-tours';
import { getAudioCdnBaseUrl } from '../config/audioCdn';

/**
 * CUSTOM SCRIPTS & MAPPINGS LAYER
 * This ensures your 11 locations always have the correct scripts and R2 links,
 * regardless of which database (Sanity or Payload) the data comes from.
 */
const applyCustomScripts = (sights: Sight[]): Sight[] => {
  const audioCdnBase = getAudioCdnBaseUrl();
  
  const customMetadata: Record<string, Partial<Sight>> = {
    'colosseum': {
      description: "Rome’s iconic amphitheatre where gladiators fought and emperors entertained the city.",
      kidsMyth: "Legend says the Colosseum was a stage for heroes. Imagine you’re a young messenger racing through the arches!",
      tips: ["Go early for the best photos", "Carry water—there is little shade."]
    },
    'forum': {
      description: "The political and social heart of ancient Rome. Walk the Via Sacra where triumphs once unfolded.",
      kidsMyth: "They say the stones can still remember speeches. Practice your most powerful Roman voice!",
      tips: ["Wear comfortable shoes", "Pair it with the Colosseum."]
    },
    'heart': {
      name: "Heart of Rome",
      description: "A journey through the winding streets connecting the Trevi Fountain, Pantheon, and Piazza Navona.",
      kidsMyth: "The center of Rome is like a giant heart made of stone and water. As long as fountains flow, the heart beats!",
      tips: ["Best explored on foot", "Gelato stops are mandatory."]
    },
    'jewish-ghetto': {
      name: "Jewish Ghetto",
      description: "One of the oldest Jewish quarters in the world, known for its unique blend of culture and cuisine.",
      kidsMyth: "The stones here are like a giant puzzle. Can you find the secret smells of a kosher kitchen?",
      tips: ["Try the fried artichokes", "Visit the Great Synagogue."]
    },
    'ostia-antica': {
      name: "Ostia Antica",
      description: "The ancient harbor city of Rome. Perfectly preserved ruins of houses, theaters, and temples.",
      kidsMyth: "Imagine this as a giant 2,000-year-old playground where kids used to play hide and seek!",
      tips: ["Bring water and a hat", "Take the train from Piramide."]
    },
    'pantheon': {
      description: "A masterpiece of Roman engineering with a perfect dome and open oculus.",
      kidsMyth: "The oculus is like a giant eye. When it rains, the Pantheon 'drinks' from the sky!",
      tips: ["Step inside to feel the dome", "Photos work best from the center."]
    },
    'sistine-chapel': {
      description: "Marvel at Michelangelo's masterpiece on the ceiling and the Last Judgment on the altar wall.",
      kidsMyth: "Michelangelo painted the ceiling standing on scaffolding, almost touching God's finger!",
      tips: ["No photography allowed", "Silence is required."]
    },
    'st-peters-basilica': {
      description: "The heart of Catholicism and a showcase of Renaissance art like Michelangelo’s Pietà.",
      kidsMyth: "The dome is like a stone umbrella. Whisper a wish inside and the echo carries it to the top!",
      tips: ["Dress code applies", "Go early for shorter queues."]
    },
    'trastevere': {
      description: "A charming neighborhood of cobbled lanes, small piazzas, and lively evenings.",
      kidsMyth: "Local cats are the secret guides here. If one follows you, you're going the right way!",
      tips: ["Best in the evening", "Explore side streets for quiet corners."]
    },
    'vatican-museums': {
      description: "A vast museum complex packed with classical sculptures and world-class masterpieces.",
      kidsMyth: "Somewhere in the halls, a marble statue blinks when nobody is looking. Try to spot it!",
      tips: ["Book timed entry", "Pick a few highlights to save energy."]
    },
    'vatican-pinacoteca': {
      description: "The Vatican Art Gallery houses masterpieces from the Middle Ages to the 19th century.",
      kidsMyth: "Leonardo da Vinci’s 'St. Jerome' was once used as a shoemaker’s stool before being saved!",
      tips: ["Look for Raphael’s 'Transfiguration'", "Room VIII has the famous tapestries."]
    }
  };

  return sights.map(sight => {
    const meta = customMetadata[sight.id];
    if (!meta) return sight;

    const updatedSight = { ...sight, ...meta };

    if (audioCdnBase) {
      updatedSight.audioFiles = updatedSight.audioFiles || {};
      
      // Map all 12 supported languages for the deep variant
      const langs = ['en', 'it', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pl', 'ru', 'ar', 'ko'];
      
      langs.forEach(lang => {
        const l = lang as any;
        updatedSight.audioFiles[l] = updatedSight.audioFiles[l] || {};
        updatedSight.audioFiles[l].deep = {
          url: `${audioCdnBase}/${lang}/${sight.id}/deep/playlist.m3u8`,
          duration: updatedSight.audioFiles[l]?.deep?.duration || 0,
          size: updatedSight.audioFiles[l]?.deep?.size || 0
        };
      });
    }

    return updatedSight;
  });
};

// --- DATA ADAPTER LOGIC (Cousin's Strategy) ---

export const fetchSights = async (): Promise<Sight[]> => {
  const source = getContentProvider();
  
  if (source === 'mock') return applyCustomScripts(await getMockSights());

  let result: Sight[] = [];

  try {
    if (source === 'sanity') {
      result = await fetchSightsFromSanity();
    } else if (source === 'payload') {
      result = await fetchSightsFromPayload();
    } else if (source === 'dual') {
      // Try Payload first, fallback to Sanity
      result = await fetchSightsFromPayload();
      if (result.length === 0) result = await fetchSightsFromSanity();
    } else if (source === 'hybrid') {
      // COUSIN'S HYBRID: Sanity content + Payload images
      const [sanitySights, payloadSights] = await Promise.all([
        fetchSightsFromSanity().catch(() => []),
        fetchSightsFromPayload().catch(() => [])
      ]);

      result = sanitySights.map(sSight => {
        const pSight = payloadSights.find(p => p.id === sSight.id);
        return {
          ...sSight,
          thumbnail: sSight.thumbnail || pSight?.thumbnail || ''
        };
      });
      
      if (result.length === 0) result = payloadSights;
    }
  } catch (e) {
    console.warn('[ContentService] Adapter failed, using fallback:', e);
    result = await fetchSightsFromSanity().catch(() => getMockSights());
  }

  return applyCustomScripts(result.length > 0 ? result : await getMockSights());
};

export const fetchTours = async (): Promise<Tour[]> => {
  const source = getContentProvider();
  
  if (source === 'mock') return await getMockTours();

  let result: Tour[] = [];

  try {
    if (source === 'sanity') {
      result = await fetchAudioToursFromSanity();
    } else if (source === 'payload') {
      result = await fetchAudioToursFromPayload();
    } else if (source === 'dual') {
      result = await fetchAudioToursFromPayload();
      if (result.length === 0) result = await fetchAudioToursFromSanity();
    } else if (source === 'hybrid') {
      const [sanityTours, payloadTours] = await Promise.all([
        fetchAudioToursFromSanity().catch(() => []),
        fetchAudioToursFromPayload().catch(() => [])
      ]);

      result = sanityTours.map(sTour => {
        const pTour = payloadTours.find(p => p.id === sTour.id);
        return {
          ...sTour,
          thumbnail: sTour.thumbnail || pTour?.thumbnail,
          stops: applyCustomScripts(sTour.stops)
        };
      });

      if (result.length === 0) result = payloadTours;
    }
  } catch (e) {
    result = await fetchAudioToursFromSanity().catch(() => getMockTours());
  }

  return result.map(tour => ({
    ...tour,
    stops: applyCustomScripts(tour.stops)
  }));
};

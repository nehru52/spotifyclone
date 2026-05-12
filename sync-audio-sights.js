const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const PROJECT_ID = env.EXPO_PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.EXPO_PUBLIC_SANITY_DATASET || 'production';
const API_TOKEN = env.EXPO_PUBLIC_SANITY_API_TOKEN;
const CDN_BASE = env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL;

const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;

// Load sights data from JSON
const SIGHTS_DATA_PATH = path.join(__dirname, '..', 'wondersofrome_app', 'src', 'data', 'sights.json');
const SIGHTS = JSON.parse(fs.readFileSync(SIGHTS_DATA_PATH, 'utf8'));

async function run() {
  console.log('--- Rich Audio-to-Sanity Sync ---');
  console.log(`Syncing ${SIGHTS.length} sights to Sanity...`);

  const mutations = SIGHTS.map(sight => {
    // Construct audio_en object for Sanity
    const audio_en = {};
    if (sight.audioFiles && sight.audioFiles.en) {
      if (sight.audioFiles.en.quick) {
        audio_en.audioQuick = {
          _type: 'object',
          url: sight.audioFiles.en.quick.url,
          duration: sight.audioFiles.en.quick.duration,
          size: sight.audioFiles.en.quick.size
        };
      }
      if (sight.audioFiles.en.deep) {
        audio_en.audioDeep = {
          _type: 'object',
          url: sight.audioFiles.en.deep.url,
          duration: sight.audioFiles.en.deep.duration,
          size: sight.audioFiles.en.deep.size
        };
      }
      if (sight.audioFiles.en.kids) {
        audio_en.audioKids = {
          _type: 'object',
          url: sight.audioFiles.en.kids.url,
          duration: sight.audioFiles.en.kids.duration,
          size: sight.audioFiles.en.kids.size
        };
      }
    }

    return {
      createOrReplace: {
        _id: `sight-${sight.id}`,
        _type: 'sight',
        name: sight.name,
        name_it: sight.name_it,
        slug: { _type: 'slug', current: sight.id },
        lat: sight.lat,
        lng: sight.lng,
        radius: sight.radius || 40,
        category: sight.category || 'museum',
        description: sight.description,
        kidsMyth: sight.kidsMyth,
        tips: sight.tips,
        audio_en: audio_en
      }
    };
  });

  // Also try to find a tour to link them to
  try {
    const TOURS_QUERY = `*[_type == "audioTour" || _type == "tour"][0...1] { _id }`;
    const queryUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(TOURS_QUERY)}`;
    const tourRes = await axios.get(queryUrl, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });

    if (tourRes.data.result && tourRes.data.result.length > 0) {
      const tourId = tourRes.data.result[0]._id;
      console.log(`Linking sights to Tour: ${tourId}`);
      
      mutations.push({
        patch: {
          id: tourId,
          set: {
            stops: SIGHTS.map(sight => ({
              _type: 'reference',
              _ref: `sight-${sight.id}`,
              _key: sight.id
            }))
          }
        }
      });
    }
  } catch (e) {
    console.log('Could not find a tour to link to. Creating Sights only.');
  }

  try {
    const res = await axios.post(BASE_URL, { mutations }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`
      }
    });
    console.log('\n🚀 SUCCESS!');
    console.log(`Synced ${SIGHTS.length} Sights with rich metadata to Sanity.`);
    console.log('Check your Sanity Studio to verify.');
  } catch (error) {
    console.error('\n❌ Sanity Mutation Failed:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

run();

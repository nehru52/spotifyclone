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
const API_VERSION = '2024-01-01';
const API_TOKEN = env.EXPO_PUBLIC_SANITY_API_TOKEN;

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

const LANGS = ['en', 'it', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pl', 'ru', 'ar', 'ko'];

const audioLangProjection = LANGS.map(
  (lang) =>
    `"${lang}": audio_${lang}{ "quick": audioQuick{url,duration,size}, "deep": audioDeep{url,duration,size}, "kids": audioKids{url,duration,size} }`
).join(',\n    ');

const AUDIO_TOURS_QUERY = `*[
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
}`;

async function testSanity() {
  console.log('--- Sanity Diagnostic ---');
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Dataset: ${DATASET}`);
  console.log(`Token: ${API_TOKEN ? 'PRESENT' : 'MISSING'}`);
  console.log('-------------------------');

  try {
    const headers = {};
    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }

    // 1. List document types and counts
    const TYPES_QUERY = `* { "type": _type }`;
    const typesRes = await axios.get(`${BASE}?query=${encodeURIComponent(TYPES_QUERY)}`, { headers });
    const counts = {};
    typesRes.data.result.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    console.log('Document counts by type:');
    console.log(JSON.stringify(counts, null, 2));

    // 2. Fetch tours with raw data to see why stops are empty
    const RAW_TOUR_QUERY = `*[_type == "tour" || _type == "audioTour"][0...3] {
      _id,
      _type,
      title,
      slug,
      stops,
      sights,
      route,
      itinerary
    }`;
    const rawRes = await axios.get(`${BASE}?query=${encodeURIComponent(RAW_TOUR_QUERY)}`, { headers });
    console.log('\nSample Tours (Raw Data):');
    console.log(JSON.stringify(rawRes.data.result, null, 2));

    // 3. Run the actual app query
    const url = `${BASE}?query=${encodeURIComponent(AUDIO_TOURS_QUERY)}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const tours = response.data.result || [];
      console.log(`\n✅ App Query Success! Found ${tours.length} tours.`);
    }

  } catch (error) {
    console.error('❌ Diagnostic Failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testSanity();

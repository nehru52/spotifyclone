const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load env
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

const CDN_BASE = env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL;

const LOCATIONS = [
  'st-peters-basilica', 'vatican-museums', 'sistine-chapel', 'colosseum', 
  'roman-forum', 'pantheon', 'trevi-fountain', 'trastevere', 'jewish-ghetto', 
  'ostia-antica', 'vatican-pinacoteca', 'vatican-gardens', 'castel-santangelo',
  'pompeii', 'borghese-gallery', 'catacombs', 'appian-way', 'domus-aurea',
  'palatine-hill', 'monte-cassino', 'lake-bracciano', 'assisi', 'orvieto',
  'tivoli', 'villa-d-este', 'navona', 'spanish-steps', 'st-peters-square',
  'raphael-rooms', 'st-peters-dome', 'vatican-necropolis'
];

async function run() {
  console.log('--- Deep Audio Audit ---');
  const results = [];
  const hashGroup = {};

  for (const id of LOCATIONS) {
    const url = `${CDN_BASE}/en/${id}/deep.mp3`;
    try {
      const res = await axios.head(url);
      if (res.status === 200) {
        const size = res.headers['content-length'];
        const etag = res.headers['etag'];
        results.push({ id, size, etag });
        
        // Group by size+etag to find duplicates
        const key = `${size}-${etag}`;
        if (!hashGroup[key]) hashGroup[key] = [];
        hashGroup[key].push(id);
        
        console.log(`✅ ${id.padEnd(20)} | Size: ${size} | ETag: ${etag}`);
      }
    } catch (e) {
      // Skip 404s
    }
  }

  console.log('\n--- Duplicate Analysis ---');
  let duplicateCount = 0;
  for (const key in hashGroup) {
    if (hashGroup[key].length > 1) {
      console.log(`⚠️ Identical files found for: ${hashGroup[key].join(', ')}`);
      duplicateCount += (hashGroup[key].length - 1);
    }
  }

  if (duplicateCount === 0) {
    console.log('✨ No duplicates found. Every file has unique metadata.');
  } else {
    console.log(`\nFound ${results.length} files total, but ${duplicateCount} appear to be duplicates.`);
  }

  console.log(`\nSummary: ${results.length} live audio locations identified.`);
}

run();

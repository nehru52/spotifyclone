const axios = require('axios');

const PROJECT_ID = 'aknmkkwd';
const DATASET = 'production';
const API_VERSION = '2024-01-01';
const TOKEN = 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1';
const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

const query = encodeURIComponent(`*[_type == "tour"] { 
  title,
  category, 
  tourType,
  "slug": slug.current
} | order(category asc)`);

axios.get(`${BASE}?query=${query}`, {
  headers: { Authorization: `Bearer ${TOKEN}` }
}).then(res => {
  const cats = {};
  const examples = {};
  
  res.data.result.forEach(t => {
    const cat = t.category || t.tourType || 'Other';
    cats[cat] = (cats[cat] || 0) + 1;
    
    if (!examples[cat]) {
      examples[cat] = [];
    }
    if (examples[cat].length < 3) {
      examples[cat].push(t.title);
    }
  });
  
  console.log('\n=== CATEGORY COUNTS ===');
  console.log(JSON.stringify(cats, null, 2));
  
  console.log('\n=== EXAMPLES PER CATEGORY ===');
  Object.keys(examples).forEach(cat => {
    console.log(`\n${cat} (${cats[cat]} tours):`);
    examples[cat].forEach(title => console.log(`  - ${title}`));
  });
  
}).catch(err => {
  console.error('Error:', err.message);
  if (err.response) {
    console.error('Response:', err.response.data);
  }
});

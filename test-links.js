const http = require('http');

const get = (url) => new Promise((resolve, reject) => {
  http.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve({statusCode: res.statusCode, data}));
  }).on('error', reject);
});

async function test() {
  console.log('Testing localhost:5180...');
  
  try {
    const res = await get('http://localhost:5180/');
    console.log(`GET / -> ${res.statusCode}`);
    
    if (res.statusCode !== 200) {
      console.error('Failed to load home page.');
      return;
    }

    const regex = /href="\.\/([^"]+\.html)"/g;
    const links = [...res.data.matchAll(regex)].map(m => m[1]);
    const uniqueLinks = [...new Set(links)];
    
    console.log(`Found links: ${uniqueLinks.join(', ')}`);
    
    let allPassed = true;
    for (const link of uniqueLinks) {
      const pageRes = await get('http://localhost:5180/' + link);
      console.log(`GET /${link} -> ${pageRes.statusCode}`);
      if (pageRes.statusCode !== 200) {
        allPassed = false;
        console.error(`ERROR: /${link} returned ${pageRes.statusCode}`);
      }
    }
    
    if (allPassed) {
      console.log('All links tested successfully! The navigation works perfectly.');
    } else {
      console.log('Some links failed.');
    }
  } catch (err) {
    console.error('Error connecting to harness:', err);
  }
}

test();

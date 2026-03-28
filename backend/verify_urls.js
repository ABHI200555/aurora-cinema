const fs = require('fs');
const https = require('https');

const db = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

const checkUrl = (url) => {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('https://')) return resolve({ url, status: 'Invalid' });
        https.request(url, { method: 'HEAD' }, (res) => {
            resolve({ url, status: res.statusCode });
        }).on('error', (err) => {
            resolve({ url, status: 'Error: ' + err.message });
        }).end();
    });
};

async function run() {
    console.log('Checking ' + db.length + ' urls...');
    let fails = [];
    for(let i=0; i<db.length; i+=10) {
        const batch = db.slice(i, i+10).map(m => checkUrl(m.image).then(res => {
            if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
                fails.push({ title: m.title, status: res.status });
            }
        }));
        await Promise.all(batch);
    }
    console.log('Failed URLs (' + fails.length + '):');
    fails.forEach(f => console.log(f.title + ' - ' + f.status));
}
run();

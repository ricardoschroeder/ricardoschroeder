const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';
const https = require('https');

let temperature = '';
let apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

https.get('https://api.openweathermap.org/data/2.5/weather?q=Amsterdam,nl&units=metric&appid=' + apiKey,
  (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      temperature = JSON.parse(data).$.main.temp;
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  })


let DATA = {
  name: 'Ricardo',
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Amsterdam',
  }),
  temperature: temperature
};

function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

generateReadMe();
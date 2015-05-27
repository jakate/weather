var program = require('commander');
var request = require('request');

program
.version('0.0.1')
.option('-c, --city [type]', 'Add the City [Helsinki]', 'Helsinki')
.option('-o, --country [type]', 'Add the country [fi]', 'fi')
.parse(process.argv);

var city = program.city;
var country = program.country.toUpperCase();
var reqURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country;

console.log(' ');
console.log(' ');
console.log('Looking for weather for ' + city + ', ' + country + '...');
console.log(' ');


function addIcon(type, night){
  switch (type){
    case "rain" :
      //console.log('☂');
      console.log("     .-.        ");
      console.log("    (   ).      ");
      console.log("   (___(__)     ");
      console.log("    ‘ ‘ ‘ ‘     ");
      console.log("   ‘ ‘ ‘ ‘      ");
    break;
    case "clouds" :
      //console.log("☁");
      console.log("     .--.       ");
      console.log("  .-(    ).     ");
      console.log(" (___.__)__)    ");
    break;
    case "clear" :
      if(night) {
        //console.log('☽');
        console.log("     _.._     ");
        console.log("   .' .-'`    ");
        console.log("  /  /        ");
        console.log("  |  |        ");
        console.log("  \\  '._ _.; ");
        console.log("   '. _ _.'   ");
      } else {
        //console.log("☀");
        console.log("    \\   /    ");
        console.log("     .-.      ");
        console.log("  ― (   ) ―   ");
        console.log("     `-’      ");
        console.log("    /   \\    ");
      }
    break;
  }

  console.log(" ");
}

function getWindData(wind){
  var dir = Math.floor(wind.deg / 45) * 45;
  var arrow = '';

  switch(dir){
    case 0:
      arrow = '↑';
    break;
    case 45:
      arrow = '↗';
    break;
    case 90:
      arrow = '→';
    break;
    case 135:
      arrow = '↘';
    break;
    case 180:
      arrow = '↓';
    break;
    case 225:
      arrow = '↙';
    break;
    case 270:
      arrow = '↖';
    break;
    case 315:
      arrow = '←';
    break;
  }

  console.log('Wind');
  console.log('---');
  console.log(arrow + ' ' + Math.floor(wind.deg) + '°');
  console.log(wind.speed + '/mps');
}

function showWeather(data){
  var sunrise = new Date(Number(data.sys.sunrise) * 1000);
  var sunset = new Date(Number(data.sys.sunset) * 1000);

  console.log(data.name + ' ' + data.sys.country);
  console.log('---');
  console.log(' ');

  // Is the sun up?
  var timenow = new Date().getTime();

  if(timenow > sunrise.getTime() && timenow < sunset.getTime()) {
    addIcon(data.weather[0].main.toLowerCase());
  } else {
    addIcon(data.weather[0].main.toLowerCase(), true);
  }

  if(data.clouds.all) {
    console.log(data.clouds.all + "% cloudy");
  }

  //console.log(data.weather[0].main);
  //console.log(data.weather[0].description);

  var kelvin = Number(data.main.temp);
  var celcius = (kelvin - 273.15).toFixed(2);
  console.log(celcius + '°C');

  console.log(" ");
  console.log(" ");
  getWindData(data.wind);
}

request(reqURL, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    var weatherData = JSON.parse(body);
    showWeather(weatherData);
  } else {
    console.log(error);
  }
});

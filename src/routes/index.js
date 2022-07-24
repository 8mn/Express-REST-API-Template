const express = require('express');

const router = express.Router();

const makeRequest = require('../utilities').makeRequest;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.get('/', async (req, res) => {
  try {
    res.json({
      message: 'Hello World!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.post('/weather', async (req, res) => {
  try {
    const body = req.body;

    const latitude = body.latitude;
    const longitude = body.longitude;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const result = await makeRequest('GET', url);

    // console.log(result)
    res.json(result);
  } catch (error) {
    res.json({
      error: error,
    });
  }
});

router.post('/sms', async (req, res) => {
  try {

    let lat = req.body.Latitude;
    let lon = req.body.Longitude;

    let weather = await getWeather(lat, lon);

    let sampleText = makeMessage(weather);


    const message = new MessagingResponse().message(sampleText);
    res.set('Content-Type', 'text/xml');
    res.send(message.toString()).status(200);


  } catch (error) {
    console.log(error);
  }
});

const getWeather = async (latitude, longitude) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

  const result = await makeRequest('GET', url);

  return result;
};


const makeMessage = (weather) => {
  console.log(weather.body.list[0]);

  currentTemp = weather.body.list[0].main.temp;
  currentWeather = weather.body.list[0].weather[0].description;
  currentPop = weather.body.list[0].pop;
 
  let message = `Current Weather\n\n${currentTemp}°C degrees - ${currentWeather} \nProbability of rain is ${(currentPop) * 100}%\n____________________________________________\n`;

  return message;
}

// const MessageConsole = () => {
//   getWeather(18.67, 73.71).then((weather) => {
//     console.log(makeMessage(weather));

//     // send message to user
//     // const message = new MessagingResponse().message(makeMessage(weather));
//     // res.set('Content-Type', 'text/xml');
//     // res.send(message.toString()).status(200);


//   }
//   ).catch((error) => {
//     console.log(error);
//   }
//   );
// }






module.exports = router;

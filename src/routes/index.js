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

    const weatherMessage = await getWeather(lat, lon);

    // const message = new MessagingResponse().message(weatherMessage);
    // res.set('Content-Type', 'text/xml');
    // res.send(message.toString()).status(200);
    console.log(weatherMessage);




    // send message from twilio api
    const message = new MessagingResponse().message(weatherMessage);
    res.set('Content-Type', 'text/xml');
    res.send(message.toString()).status(200);
  } catch (error) {
    console.log(error);
  }
});

const getWeather = async (latitude, longitude) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

  const result = await makeRequest('GET', url);


  console.log(result);

  const weatherMessage = makeMessage(result);

  return weatherMessage;
};

const makeMessage = (w) => {
  // console.log(w.body.list[0]);

  currentTemp = w.body.list[0].main.temp;
  currentWeather = w.body.list[0].weather[0].description;
  currentPop = w.body.list[0].pop;

  let message = `Current Weather\n\n${currentTemp}°C degrees - ${currentWeather} \nProbability of rain is ${
    currentPop * 100
  }%\n____________________________________________\n`;

  const listLength = w.body.list.length;

  for (let i = 1; i < listLength; i++) {
    let day = w.body.list[i].dt_txt.split(' ')[0];
    let time = w.body.list[i].dt_txt.split(' ')[1];
    let temp = w.body.list[i].main.temp;
    let weather = w.body.list[i].weather[0].description;
    let pop = w.body.list[i].pop;

    message += `${day} ${time}\n\n${temp}°C degrees - ${weather} \nProbability of rain is ${
      pop * 100
    }%\n____________________________________________\n\n`;
  }

  return message;
};

module.exports = router;

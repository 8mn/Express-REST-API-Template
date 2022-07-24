const https = require('https');
const log = false;

async function makeRequest(method, urlPath, body = null) {
  try {
    httpMethod = method;
    // httpBaseUrl = urlPath;
    httpURLPath = urlPath;

    const options = {
      hostname: 'api.openweathermap.org',
      port: 443,
      path: httpURLPath,
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return await httpRequest(options, body, log);
  } catch (error) {
    console.error('Error generating request options');
    // console.log(options);
    throw error;
  }
}

async function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyString = '';
      if (body) {
        bodyString = JSON.stringify(body);
        bodyString = bodyString == '{}' ? '' : bodyString;
      }

      log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
      const req = https.request(options, (res) => {
        let response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: '',
        };

        res.on('data', (data) => {
          response.body += data;
        });

        res.on('end', () => {
          response.body = response.body ? JSON.parse(response.body) : {};
          log &&
            console.log(`httpRequest response: ${JSON.stringify(response)}`);

          if (response.statusCode !== 200) {
            return reject(response);
          }

          return resolve(response);
        });
      });

      req.on('error', (error) => {
        return reject(error);
      });

      req.write(bodyString);
      req.end();
    } catch (err) {
      return reject(err);
    }
  });
}

exports.makeRequest = makeRequest;

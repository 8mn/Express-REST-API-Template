[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Backend relay for Agro Alerts App

This repo is a backend relay for [Agro Alert App](https://github.com/8mn/agroalerts)

## Getting Started

### Clone the repo on your machine

```
git clone https://github.com/8mn/agro-alerts-server.git
cd agro-alerts-server
```


### Install dependencies

```
npm install
```

### Environment variables

- Head over to [Twilio console](https://console.twilio.com/) and get the Twilio account sid, auth token
- Head over to [Openweather map](https://openweathermap.org/) signup and get the key
- rename `.env.example` to `.env` and insert the credentials as shown below

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
OPENWEATHER_API_KEY=
```

### Running in development

```
npm run dev
```

### Running in production

```
npm start
```

Runs on localhost:3000 by default but can be configured using the `PORT` environment variable.

### Running tests

```
npm test

# Watch repo
npm run test:watch
```

### Linting
```
npm run lint

# fix issues
npm run lint:fix
```

import {juggler} from '@loopback/repository';

const config = {
  name: 'WeatherApi',
  connector: 'rest',
  baseURL: 'https://api.openweathermap.org/data/2.5', // Example for weather API
  operations: [
    {
      template: {
        method: 'GET',
        url: '/weather?lat={lat}&lon={lon}&appid={API_KEY}', // Replace with your API key
      },
      functions: {
        getWeather: ['lat', 'lon'],
      },
    },
  ],
};

export class WeatherApiDataSource extends juggler.DataSource {
  static dataSourceName = 'WeatherApi';
  static readonly defaultConfig = config;

  constructor() {
    super(config);
  }
}

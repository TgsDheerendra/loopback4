import {inject} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {WeatherApiDataSource} from '../datasources/weather-api.datasource';

export class WeatherServiceProvider {
  constructor(
    @inject('datasources.WeatherApi')
    protected dataSource: WeatherApiDataSource,
  ) {}

  async getWeather(lat: number, lon: number): Promise<object> {
    const service = await getService(this.dataSource);
    return service.getWeather(lat, lon);
  }
}

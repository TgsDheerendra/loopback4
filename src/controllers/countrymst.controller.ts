import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Country} from '../models';
import {CountryRepository} from '../repositories';

export class CountrymstController {
  constructor(
    @repository(CountryRepository) public countryRepository: CountryRepository,
    @inject(SecurityBindings.USER, {optional: true})
    private readonly currentUser: UserProfile,
  ) {}

  @post('/countries')
  @response(200, {
    description: 'Country model instance',
    content: {'application/json': {schema: getModelSchemaRef(Country)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {
            title: 'NewCountry',
            exclude: ['id'],
          }),
        },
      },
    })
    country: Omit<Country, 'id'>,
  ): Promise<Country> {
    return this.countryRepository.create(country);
  }

  @get('/countries/count')
  @authenticate('jwt') // Specify the strategy name
  @response(200, {
    description: 'Country model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Country) where?: Where<Country>): Promise<Count> {
    return this.countryRepository.count(where);
  }

  @get('/countries')
  @response(200, {
    description: 'Array of Country model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          message: 'You are authenticated',
          items: getModelSchemaRef(Country, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Country) filter?: Filter<Country>,
  ): Promise<Country[]> {
    console.log('Current User:', this.currentUser); // Debugging user info
    return this.countryRepository.find(filter);
  }

  @patch('/countries')
  @response(200, {
    description: 'Country PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
    @param.where(Country) where?: Where<Country>,
  ): Promise<Count> {
    return this.countryRepository.updateAll(country, where);
  }

  @get('/countries/{id}')
  @response(200, {
    description: 'Country model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Country, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Country, {exclude: 'where'})
    filter?: FilterExcludingWhere<Country>,
  ): Promise<Country> {
    return this.countryRepository.findById(id, filter);
  }

  @patch('/countries/{id}')
  @response(204, {
    description: 'Country PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
  ): Promise<void> {
    await this.countryRepository.updateById(id, country);
  }

  @put('/countries/{id}')
  @response(204, {
    description: 'Country PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() country: Country,
  ): Promise<void> {
    await this.countryRepository.replaceById(id, country);
  }

  @del('/countries/{id}')
  @response(204, {
    description: 'Country DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.countryRepository.deleteById(id);
  }
}

import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Component} from '../models';
import {ComponentRepository} from '../repositories';

export class ComponentmstController {
  constructor(
    @repository(ComponentRepository)
    public componentRepository: ComponentRepository,
  ) {}

  @post('/component')
  @response(200, {
    description: 'Component model instance',
    content: {'application/json': {schema: getModelSchemaRef(Component)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Component, {
            title: 'NewComponent',
            exclude: ['id'],
          }),
        },
      },
    })
    component: Omit<Component, 'id'>,
  ): Promise<Component> {
    return this.componentRepository.create(component);
  }

  @get('/component')
  @response(200, {
    description: 'Array of Component model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Component, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Component) filter?: Filter<Component>,
  ): Promise<Component[]> {
    return this.componentRepository.find(filter);
  }

  @get('/component/{id}')
  @response(200, {
    description: 'Component model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Component, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Component, {exclude: 'where'})
    filter?: FilterExcludingWhere<Component>,
  ): Promise<Component> {
    return this.componentRepository.findById(id, filter);
  }

  @put('/component/{id}')
  @response(204, {
    description: 'Component PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() component: Component,
  ): Promise<void> {
    await this.componentRepository.replaceById(id, component);
  }
}

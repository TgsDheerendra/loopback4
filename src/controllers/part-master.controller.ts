import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
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
  requestBody,
  response,
} from '@loopback/rest';
import {ResponseHelper} from '../helpers/response.helper';
import {Component} from '../models';
import {ComponentRepository} from '../repositories';
import {PartMasterService} from '../services';
import {HTTP_STATUS} from '../utils/constants';

export class PartMasterController {
  constructor(
    @repository(ComponentRepository)
    public componentRepository: ComponentRepository,
    @service(PartMasterService) // Correct way to inject services
    private readonly partMasterService: PartMasterService,
  ) {}

  @post('/components')
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
  ): Promise<ResponseHelper> {
    try {
      // Custom service to manage or handle create new component
      const newComponent =
        await this.partMasterService.createComponent(component);
      return ResponseHelper.success(
        'Component create successful',
        newComponent,
      );
    } catch (error) {
      return ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message);
    }
  }

  @get('/components')
  @authenticate('jwt')
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

  @patch('/components')
  @response(200, {
    description: 'Component PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Component, {partial: true}),
        },
      },
    })
    component: Component,
    @param.where(Component) where?: Where<Component>,
  ): Promise<Count> {
    return this.componentRepository.updateAll(component, where);
  }

  @get('/components/{id}')
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

  @del('/components/{id}')
  @response(204, {
    description: 'Component DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.componentRepository.deleteById(id);
  }
}

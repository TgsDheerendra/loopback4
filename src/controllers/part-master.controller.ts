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
import {ComponentDTO} from '../dtoValidator/component.dto';
import {ResponseHelper} from '../helpers/response.helper';
import {Component} from '../models';
import {ComponentRepository} from '../repositories';
import {ComponentService} from '../services/component.service';
import {HTTP_STATUS} from '../utils/constants';

export class PartMasterController {
  constructor(
    @repository(ComponentRepository)
    public componentRepository: ComponentRepository,
    private componentService: ComponentService,
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
    @requestBody() componentDTO: ComponentDTO,
  ): Promise<Component> {
    try {
      const newComponent =
        await this.componentService.createComponent(componentDTO);
      return ResponseHelper.success(
        'Component create successful',
        newComponent,
      );
    } catch (error) {
      return ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, 'Bad request');
    }
  }

  @get('/components')
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

  @patch('/components/{id}')
  @response(204, {
    description: 'Component PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Component, {partial: true}),
        },
      },
    })
    component: Component,
  ): Promise<void> {
    await this.componentRepository.updateById(id, component);
  }

  @put('/components/{id}')
  @response(204, {
    description: 'Component PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() component: Component,
  ): Promise<void> {
    await this.componentRepository.replaceById(id, component);
  }

  @del('/components/{id}')
  @response(204, {
    description: 'Component DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.componentRepository.deleteById(id);
  }
}

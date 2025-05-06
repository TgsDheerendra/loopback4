import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
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
    description:
      'Array of Component model instances including RfqLineItems and Alternate Parts',
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
    return this.componentRepository.find({
      ...filter,
      include: [
        {
          relation: 'rfqLineItems',
        },
      ],
    });
  }

  @get('/component/{id}')
  @response(200, {
    description:
      'Component model instance with related RfqLineItems and Alternate Parts',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Component, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Component> {
    return this.componentRepository.findById(id, {
      include: [
        {
          relation: 'rfqLineItems',
          scope: {
            include: [{relation: 'rfqLineItemsAlternatePart'}], // Nested relation
          },
        },
      ],
    });
  }
}

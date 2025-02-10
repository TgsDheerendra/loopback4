import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Component, RfqLineItems} from '../models';
import {ComponentRepository} from '../repositories';

export class ComponentRfqLineItemsController {
  constructor(
    @repository(ComponentRepository)
    protected componentRepository: ComponentRepository,
  ) {}

  @get('/components/{id}/rfq-line-items', {
    responses: {
      '200': {
        description: 'Array of Component has many RfqLineItems',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RfqLineItems)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<RfqLineItems>,
  ): Promise<RfqLineItems[]> {
    return this.componentRepository.rfqlineitems(id).find(filter);
  }

  @post('/components/{id}/rfq-line-items', {
    responses: {
      '200': {
        description: 'Component model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RfqLineItems)},
        },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Component.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RfqLineItems, {
            title: 'NewRfqLineItemsInComponent',
            exclude: ['id'],
            optional: ['pardID'],
          }),
        },
      },
    })
    rfqLineItems: Omit<RfqLineItems, 'id'>,
  ): Promise<RfqLineItems> {
    return this.componentRepository.rfqlineitems(id).create(rfqLineItems);
  }

  @patch('/components/{id}/rfq-line-items', {
    responses: {
      '200': {
        description: 'Component.RfqLineItems PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RfqLineItems, {partial: true}),
        },
      },
    })
    rfqLineItems: Partial<RfqLineItems>,
    @param.query.object('where', getWhereSchemaFor(RfqLineItems))
    where?: Where<RfqLineItems>,
  ): Promise<Count> {
    return this.componentRepository.rfqlineitems(id).patch(rfqLineItems, where);
  }

  @del('/components/{id}/rfq-line-items', {
    responses: {
      '200': {
        description: 'Component.RfqLineItems DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(RfqLineItems))
    where?: Where<RfqLineItems>,
  ): Promise<Count> {
    return this.componentRepository.rfqlineitems(id).delete(where);
  }
}

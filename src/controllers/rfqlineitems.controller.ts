import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {RfqLineItems} from '../models';
import {RfqLineItemsRepository} from '../repositories';

export class RfqlineitemsController {
  constructor(
    @repository(RfqLineItemsRepository)
    public rfqLineItemsRepository: RfqLineItemsRepository,
  ) {}

  @post('/rfq-line-items')
  @response(200, {
    description: 'RfqLineItems model instance',
    content: {'application/json': {schema: getModelSchemaRef(RfqLineItems)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RfqLineItems, {
            title: 'NewRfqLineItems',
            exclude: ['id'],
          }),
        },
      },
    })
    rfqLineItems: Omit<RfqLineItems, 'id'>,
  ): Promise<RfqLineItems> {
    return this.rfqLineItemsRepository.create(rfqLineItems);
  }

  @get('/rfq-line-items')
  @response(200, {
    description: 'Array of RfqLineItems model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RfqLineItems, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RfqLineItems) filter?: Filter<RfqLineItems>,
  ): Promise<RfqLineItems[]> {
    return this.rfqLineItemsRepository.find(filter);
  }

  @get('/rfq-line-items/{id}')
  @response(200, {
    description: 'RfqLineItems model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RfqLineItems, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RfqLineItems, {exclude: 'where'})
    filter?: FilterExcludingWhere<RfqLineItems>,
  ): Promise<RfqLineItems> {
    return this.rfqLineItemsRepository.findById(id, filter);
  }
}

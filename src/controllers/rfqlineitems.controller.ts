import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {RfqLineItems, RfqLineItemsAlternatePart} from '../models';
import {RfqLineItemsRepository} from '../repositories';

export class RfqlineitemsController {
  constructor(
    @repository(RfqLineItemsRepository)
    public rfqLineItemsRepository: RfqLineItemsRepository,
  ) {}

  @post('/rfq-line-items')
  @response(200, {
    description: 'RfqLineItems model instance created successfully',
    content: {'application/json': {schema: RfqLineItems}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              lineItem: getModelSchemaRef(RfqLineItems, {
                title: 'NewRfqLineItem',
                exclude: ['id'],
              }),
              alternateParts: {
                type: 'array',
                items: getModelSchemaRef(RfqLineItemsAlternatePart, {
                  title: 'NewRfqLineItemsAlternatePart',
                  exclude: ['id', 'rfqLineItemsId'],
                }),
              },
            },
          },
        },
      },
    })
    data: {
      lineItem: Omit<RfqLineItems, 'id'>;
      alternateParts?: Omit<
        RfqLineItemsAlternatePart,
        'id' | 'rfqLineItemsId'
      >[];
    },
  ): Promise<RfqLineItems> {
    // Create the RFQ Line Item entry first
    const createdLineItem = await this.rfqLineItemsRepository.create(
      data.lineItem,
    );

    // If alternate parts exist, create them using createAll()
    if (data.alternateParts && data.alternateParts.length > 0) {
      await Promise.all(
        data.alternateParts.map(alternatePart =>
          this.rfqLineItemsRepository
            .rfqLineItemsAlternatePart(createdLineItem.id)
            .create(alternatePart),
        ),
      );
    }

    // Return the created line item with relations included
    return this.rfqLineItemsRepository.findById(createdLineItem.id, {
      include: [{relation: 'rfqLineItemsAlternatePart'}],
    });
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
    return this.rfqLineItemsRepository.find({
      ...filter,
      include: [
        {
          relation: 'rfqLineItemsAlternatePart',
        },
      ],
    });
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
    return this.rfqLineItemsRepository.findById(id, {
      ...filter,
      include: [
        {
          relation: 'rfqLineItemsAlternatePart',
        },
        {
          relation: 'component',
        },
      ],
    });
  }
}

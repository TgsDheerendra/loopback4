import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
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
import {ResponseHelper} from '../helpers/response.helper';
import {RfqLineItems} from '../models';
import {ComponentRepository, RfqlineitemsRepository} from '../repositories';
import {HTTP_STATUS} from '../utils/constants';

export class RfqlineitemsController {
  constructor(
    @repository(RfqlineitemsRepository)
    public rfqlineitemsRepository: RfqlineitemsRepository,
    @repository(ComponentRepository)
    public componentRepository: ComponentRepository,
  ) {}

  @post('/rfqlineitems')
  @response(200, {
    description: 'Rfqlineitems model instance',
    content: {'application/json': {schema: getModelSchemaRef(RfqLineItems)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RfqLineItems, {
            title: 'NewRfqlineitems',
          }),
        },
      },
    })
    rfqlineitems: RfqLineItems,
  ): Promise<RfqLineItems> {
    return this.rfqlineitemsRepository.create(rfqlineitems);
  }

  @get('/rfqlineitems/count')
  @response(200, {
    description: 'Rfqlineitems model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RfqLineItems) where?: Where<RfqLineItems>,
  ): Promise<Count> {
    return this.rfqlineitemsRepository.count(where);
  }

  @get('/rfqlineitems')
  @response(200, {
    description: 'Array of Rfqlineitems model instances',
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
    return this.rfqlineitemsRepository.find(filter);
  }

  @patch('/rfqlineitems')
  @response(200, {
    description: 'Rfqlineitems PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RfqLineItems, {partial: true}),
        },
      },
    })
    rfqlineitems: RfqLineItems,
    @param.where(RfqLineItems) where?: Where<RfqLineItems>,
  ): Promise<Count> {
    return this.rfqlineitemsRepository.updateAll(rfqlineitems, where);
  }

  @get('/rfqlineitems/{id}')
  @response(200, {
    description: 'Rfqlineitems model instance',
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
    return this.rfqlineitemsRepository.findById(id, filter);
  }

  @patch('/rfqlineitems/{id}')
  @response(204, {
    description: 'Rfqlineitems PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RfqLineItems, {partial: true}),
        },
      },
    })
    rfqlineitems: RfqLineItems,
  ): Promise<void> {
    await this.rfqlineitemsRepository.updateById(id, rfqlineitems);
  }

  @put('/rfqlineitems/{id}')
  @response(204, {
    description: 'Rfqlineitems PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rfqlineitems: RfqLineItems,
  ): Promise<void> {
    await this.rfqlineitemsRepository.replaceById(id, rfqlineitems);
  }

  @del('/rfqlineitems/{id}')
  @response(204, {
    description: 'Rfqlineitems DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rfqlineitemsRepository.deleteById(id);
  }

  @post('/rfqlineitems/bulk-create')
  @response(200, {
    description: 'Bulk create Rfqlineitems',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RfqLineItems, {exclude: ['id']}),
        },
      },
    },
  })
  async createAll(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(RfqLineItems, {exclude: ['id']}),
          },
        },
      },
    })
    rfqlineitems: RfqLineItems[],
  ): Promise<RfqLineItems[]> {
    return this.rfqlineitemsRepository.createAll(rfqlineitems);
  }

  @post('/rfqlineitems/bulk-create-with-transaction-validation')
  @response(HTTP_STATUS.CREATED, {
    description: 'Bulk create Rfqlineitems',
  })
  async createBulk(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RfqLineItems',
            },
          },
        },
      },
    })
    rfqlineitemsList: RfqLineItems[],
  ) {
    const transaction =
      await this.rfqlineitemsRepository.dataSource.beginTransaction({
        isolationLevel: IsolationLevel.READ_COMMITTED,
      });

    try {
      const createdItems = [];

      for (const item of rfqlineitemsList) {
        const component = await this.componentRepository.findOne({
          where: {id: item.custPNID},
        });

        if (!component) {
          await transaction.rollback();
          ResponseHelper.error(
            HTTP_STATUS.NOT_FOUND,
            `Component with ID ${item.custPNID} not found`,
          );
        }

        if (!item.qpa) {
          await transaction.rollback();
          ResponseHelper.error(
            HTTP_STATUS.BAD_REQUEST,
            `Quantity per assembly (qpa) cannot be greater than package quantity for custPNID ${item.custPNID}`,
          );
        }

        const createdItem = await this.rfqlineitemsRepository.create(item, {
          transaction,
        });

        createdItems.push(createdItem);
      }

      await transaction.commit();
      return ResponseHelper.success('Bulk create successful', createdItems);
    } catch (error) {
      await transaction.rollback();
      ResponseHelper.error(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Transaction failed, rolling back.',
      );
    }
  }
}

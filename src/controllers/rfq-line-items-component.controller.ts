import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RfqLineItems,
  Component,
} from '../models';
import {RfqLineItemsRepository} from '../repositories';

export class RfqLineItemsComponentController {
  constructor(
    @repository(RfqLineItemsRepository)
    public rfqLineItemsRepository: RfqLineItemsRepository,
  ) { }

  @get('/rfq-line-items/{id}/component', {
    responses: {
      '200': {
        description: 'Component belonging to RfqLineItems',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Component),
          },
        },
      },
    },
  })
  async getComponent(
    @param.path.number('id') id: typeof RfqLineItems.prototype.id,
  ): Promise<Component> {
    return this.rfqLineItemsRepository.parts(id);
  }
}

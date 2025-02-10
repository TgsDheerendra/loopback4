import {belongsTo, Entity, model, property} from '@loopback/repository';
import {RfqLineItems} from './rfq-line-items.model';

@model()
export class RfqLineItemsAlternatePart extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  distributor: string;

  @property({
    type: 'string',
    required: true,
  })
  mfgPN: string; // Manufacturer Part Number

  // 🔹 Define the foreign key relation explicitly
  @belongsTo(() => RfqLineItems, {
    name: 'rfqLineItems',
    keyFrom: 'rfqLineItemsId',
    keyTo: 'id',
  })
  rfqLineItemsId: number;

  constructor(data?: Partial<RfqLineItemsAlternatePart>) {
    super(data);
  }
}

import {belongsTo, Entity, model, property} from '@loopback/repository';
import {RfqLineItems} from './rfq-line-items.model';

@model({
  settings: {
    indexes: {
      unique_rfqLineItemsId: {
        keys: {rfqLineItemsId: 1}, // Ensure `custPN` is unique
        options: {unique: true},
      },
    },
    foreignKeys: {
      fk_rfqline_items_id: {
        name: 'fk_rfqline_items_id',
        entity: 'RfqLineItems',
        entityKey: 'id',
        foreignKey: 'rfqLineItemsId',
      },
    },
  },
})
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
  @belongsTo(() => RfqLineItems)
  rfqLineItemsId: number;

  constructor(data?: Partial<RfqLineItemsAlternatePart>) {
    super(data);
  }
}

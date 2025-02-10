import {Entity, hasMany, model, property} from '@loopback/repository';
import {RfqLineItems} from './rfq-line-items.model';

@model()
export class Component extends Entity {
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
  mfgPN: string; // Manufacturer Part Number

  @property({
    type: 'string',
    required: true,
  })
  mfgName: string; // Manufacturer Name

  @property({
    type: 'string',
  })
  partStatus?: string; // Status of the component

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @hasMany(() => RfqLineItems, {keyTo: 'pardID'})
  rfqlineitems: RfqLineItems[];
  // Soft delete flag

  constructor(data?: Partial<Component>) {
    super(data);
  }
}

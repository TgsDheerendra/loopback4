import {Entity, model, property, hasMany} from '@loopback/repository';
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
  mfgPN: string;

  @property({
    type: 'string',
    required: true,
  })
  mfgName: string;

  @property({
    type: 'string',
  })
  partStatus?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @hasMany(() => RfqLineItems)
  rfqLineItems: RfqLineItems[];
  // @hasMany(() => RfqLineItems, {keyTo: 'componentId'}) // Ensure correct FK reference
  // rfqlineitems: RfqLineItems[];

  constructor(data?: Partial<Component>) {
    super(data);
  }
}

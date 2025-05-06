import {Entity, hasMany, model, property} from '@loopback/repository';
import {RfqLineItems} from './rfq-line-items.model';

@model({
  settings: {
    indexes: {
      unique_mfgPN_mfgName: {
        keys: ['mfgPN', 'mfgName'],
        options: {unique: true},
      },
    },
  },
})
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

  constructor(data?: Partial<Component>) {
    super(data);
  }
}

import {Entity, hasMany, model, property} from '@loopback/repository';
import {RfqLineAlternate} from './rfqlineitemsalternate.model';

@model()
export class RfqLineItems extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  lineID: number;

  @property({
    type: 'number',
    required: true,
  })
  qpa: number;

  @property({
    type: 'string',
    required: false,
  })
  refDesig?: string;

  @property({
    type: 'string',
    required: true,
  })
  custPN: string;

  @property({
    type: 'number',
    required: true,
  })
  custPNID: number;

  @property({
    type: 'number',
    required: true,
  })
  uomID: number;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isInstall: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isPurchase: boolean;

  @hasMany(() => RfqLineAlternate)
  rfqLineAlternates: RfqLineAlternate[];

  constructor(data?: Partial<RfqLineItems>) {
    super(data);
  }
}

export interface RfqLineItemsRelations {
  // describe navigational properties here
}

export type RfqLineItemsWithRelations = RfqLineItems & RfqLineItemsRelations;

import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Component} from './component.model';
import {RfqLineItems} from './rfq-line-items.model';

@model()
export class RfqLineItemsAlternatepart extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  // 🔹 Fix field name & set up relation to `RfqLineItems`
  @belongsTo(() => RfqLineItems)
  rfqLineItemsID: number;

  // 🔹 Set up relation to `Component`
  @belongsTo(() => Component)
  partID: number;

  @property({
    type: 'string',
    required: true,
  })
  distributor: string;

  @property({
    type: 'string',
  })
  distPN?: string;

  @property({
    type: 'string',
  })
  mfgCode?: string;

  @property({
    type: 'string',
  })
  mfgPN?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'boolean',
  })
  isDeleted?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  mountingType: string;

  @property({
    type: 'string',
  })
  partcategory?: string;

  constructor(data?: Partial<RfqLineItemsAlternatepart>) {
    super(data);
  }
}

export interface RfqLineItemsAlternatepartRelations {
  rfqLineItems?: RfqLineItems;
  component?: Component;
}

export type RfqLineItemsAlternatepartWithRelations = RfqLineItemsAlternatepart &
  RfqLineItemsAlternatepartRelations;

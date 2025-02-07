import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Component} from './component.model';
import {RfqLineItemsAlternatepart} from './rfq-line-items-alternatepart.model';

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
  lineId: number;

  @property({
    type: 'number',
    required: true,
  })
  qpa: number;

  @property({
    type: 'string',
  })
  refDesg?: string;

  @property({
    type: 'string',
  })
  custPN?: string;

  @property({
    type: 'string',
  })
  description?: string;

  // 🔹 Establishing a relation: Many RfqLineItems belong to one Component
  @belongsTo(() => Component)
  partID: number;

  // 🔹 One RfqLineItems can have many alternate parts
  @hasMany(() => RfqLineItemsAlternatepart, {keyTo: 'rfqLineItemsID'})
  alternateParts: RfqLineItemsAlternatepart[];

  constructor(data?: Partial<RfqLineItems>) {
    super(data);
  }
}

export interface RfqLineItemsRelations {
  component?: Component;
  alternateParts?: RfqLineItemsAlternatepart[];
}

export type RfqLineItemsWithRelations = RfqLineItems & RfqLineItemsRelations;

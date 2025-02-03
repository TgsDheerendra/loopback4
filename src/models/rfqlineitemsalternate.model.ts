import {Entity, model, property} from '@loopback/repository';

@model()
export class RfqLineAlternate extends Entity {
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
  rfqLineItemId: number; // Foreign Key to RfqLineItems

  @property({
    type: 'string',
    required: true,
  })
  description: string; // Description of the alternate component

  constructor(data?: Partial<RfqLineAlternate>) {
    super(data);
  }
}

export interface RfqLineAlternateRelations {
  // describe navigational properties here
}

export type RfqLineAlternateRWithRelations = RfqLineAlternate &
  RfqLineAlternateRelations;

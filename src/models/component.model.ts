import {Entity, model, property} from '@loopback/repository';

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
    type: 'number',
    required: true,
  })
  packageQty: number;

  @property({
    type: 'string',
    required: true,
  })
  partStatus: string;

  @property({
    type: 'string',
    required: true,
  })
  unit: string;

  @property({
    type: 'string',
    required: false,
  })
  detailDescription?: string;

  constructor(data?: Partial<Component>) {
    super(data);
  }
}
export interface ComponentRelations {
  // describe navigational properties here
}

export type ComponentWithRelations = Component & ComponentRelations;

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
    type: 'string',
    required: true,
  })
  mfgName: string;

  @property({
    type: 'string',
  })
  partStatus: string;

  @property({
    type: 'boolean',
  })
  isDeleted: boolean;

  @property({
    type: 'boolean',
  })
  isGoodPart: boolean;

  @property({
    type: 'string',
  })
  mountingType: string;

  @property({
    type: 'string',
  })
  partCategory: string;

  constructor(data?: Partial<Component>) {
    super(data);
  }
}

export interface ComponentRelations {
  // describe navigational properties here
}

export type ComponentWithRelations = Component & ComponentRelations;

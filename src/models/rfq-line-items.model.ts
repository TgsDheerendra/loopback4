import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Component} from './component.model';

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

  @belongsTo(() => Component, {name: 'parts'})
  pardID: number;

  constructor(data?: Partial<RfqLineItems>) {
    super(data);
  }
}

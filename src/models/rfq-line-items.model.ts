import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Component} from './component.model';
import {RfqLineItemsAlternatePart} from './rfq-line-items-alternatepart.model';

@model({
  settings: {
    indexes: {
      unique_custPN: {
        keys: {custPN: 1}, // Ensure `custPN` is unique
        options: {unique: true},
      },
      // unique_lineId_componentId: {
      //   keys: {lineId: 1, componentId: 1}, // Ensure (`lineId`, `componentId`) is unique together
      //   options: {unique: true},
      // },
    },
    foreignKeys: {
      fk_component_partId: {
        name: 'fk_component_partId',
        entity: 'Component',
        entityKey: 'id',
        foreignKey: 'componentId',
      },
    },
  },
})
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
    required: true,
  })
  custPN: string;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Component)
  componentId: number;

  @hasMany(() => RfqLineItemsAlternatePart, {keyTo: 'rfqLineItemsId'}) // Ensure correct FK reference
  rfqLineItemsAlternatePart: RfqLineItemsAlternatePart[];

  constructor(data?: Partial<RfqLineItems>) {
    super(data);
  }
}

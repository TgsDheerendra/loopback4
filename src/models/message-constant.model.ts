import {Entity, model, property} from '@loopback/repository';

@model()
export class MessageConstant extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  category: string;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'boolean',
  })
  isDeleted?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  createdDate: string;


  constructor(data?: Partial<MessageConstant>) {
    super(data);
  }
}

export interface MessageConstantRelations {
  // describe navigational properties here
}

export type MessageConstantWithRelations = MessageConstant & MessageConstantRelations;

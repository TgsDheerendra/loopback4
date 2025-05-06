import {Entity, model, property, hasMany} from '@loopback/repository';
import {Employee} from './employee.model';
import {CustomerEmployee} from './customer-employee.model';

@model()
export class Customer extends Entity {
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
  name: string;

  @hasMany(() => Employee, {through: {model: () => CustomerEmployee}})
  employees: Employee[];

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;

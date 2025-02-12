import {Entity, model, property, hasMany} from '@loopback/repository';
import {Customer} from './customer.model';
import {CustomerEmployee} from './customer-employee.model';

@model()
export class Employee extends Entity {
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

  @hasMany(() => Customer, {through: {model: () => CustomerEmployee}})
  customers: Customer[];

  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;

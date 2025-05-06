import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_customerEmployee_customerId: {
        name: 'fk_customerEmployee_customerId',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerId',
      },
      fk_customerEmployee_employeeId: {
        name: 'fk_customerEmployee_employeeId',
        entity: 'Employee',
        entityKey: 'id',
        foreignKey: 'employeeId',
      },
    },
    indexes: {
      unique_customer_employee: {
        keys: {customerId: 1, employeeId: 1},
        options: {unique: true}, // Prevents duplicate customer-employee mappings
      },
    },
  },
})
export class CustomerEmployee extends Entity {
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
  customerId: number;

  @property({
    type: 'number',
    required: true,
  })
  employeeId: number;

  constructor(data?: Partial<CustomerEmployee>) {
    super(data);
  }
}

export interface CustomerEmployeeRelations {
  // describe navigational properties here
}

export type CustomerEmployeeWithRelations = CustomerEmployee &
  CustomerEmployeeRelations;

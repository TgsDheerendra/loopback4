import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {
  Customer,
  CustomerEmployee,
  CustomerRelations,
  Employee,
} from '../models';
import {CustomerEmployeeRepository} from './customer-employee.repository';
import {EmployeeRepository} from './employee.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly employees: HasManyThroughRepositoryFactory<
    Employee,
    typeof Employee.prototype.id,
    CustomerEmployee,
    typeof Customer.prototype.id
  >;
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('CustomerEmployeeRepository')
    protected customerEmployeeRepositoryGetter: Getter<CustomerEmployeeRepository>,
    @repository.getter('EmployeeRepository')
    protected employeeRepositoryGetter: Getter<EmployeeRepository>,
  ) {
    super(Customer, dataSource);
    this.employees = this.createHasManyThroughRepositoryFactoryFor(
      'employees',
      employeeRepositoryGetter,
      customerEmployeeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'employees',
      this.employees.inclusionResolver,
    );
  }
}

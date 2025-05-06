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
  Employee,
  EmployeeRelations,
} from '../models';
import {CustomerEmployeeRepository} from './customer-employee.repository';
import {CustomerRepository} from './customer.repository';

export class EmployeeRepository extends DefaultCrudRepository<
  Employee,
  typeof Employee.prototype.id,
  EmployeeRelations
> {
  public readonly customers: HasManyThroughRepositoryFactory<
    Customer,
    typeof Customer.prototype.id,
    CustomerEmployee,
    typeof Employee.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('CustomerEmployeeRepository')
    protected customerEmployeeRepositoryGetter: Getter<CustomerEmployeeRepository>,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Employee, dataSource);
    this.customers = this.createHasManyThroughRepositoryFactoryFor(
      'customers',
      customerRepositoryGetter,
      customerEmployeeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'customers',
      this.customers.inclusionResolver,
    );
  }
}

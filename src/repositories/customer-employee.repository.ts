import {inject} from '@loopback/core';
import {DefaultTransactionalRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {CustomerEmployee, CustomerEmployeeRelations} from '../models';

export class CustomerEmployeeRepository extends DefaultTransactionalRepository<
  CustomerEmployee,
  typeof CustomerEmployee.prototype.id,
  CustomerEmployeeRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(CustomerEmployee, dataSource);
  }
}

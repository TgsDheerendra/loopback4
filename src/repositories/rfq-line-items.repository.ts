import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {RfqLineItems} from '../models';

export class RfqLineItemsRepository extends DefaultCrudRepository<
  RfqLineItems,
  typeof RfqLineItems.prototype.id
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(RfqLineItems, dataSource);
  }
}

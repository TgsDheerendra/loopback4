import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {RfqLineAlternateRelations, RfqLineItems} from '../models';

export class RfqlineitemsRepository extends DefaultCrudRepository<
  RfqLineItems,
  typeof RfqLineItems.prototype.id,
  RfqLineAlternateRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(RfqLineItems, dataSource);
  }
}

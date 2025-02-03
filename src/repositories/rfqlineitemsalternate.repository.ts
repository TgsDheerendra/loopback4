import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {RfqLineAlternate, RfqLineAlternateRelations} from '../models';

export class RfqlineitemsalternateRepository extends DefaultCrudRepository<
  RfqLineAlternate,
  typeof RfqLineAlternate.prototype.id,
  RfqLineAlternateRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(RfqLineAlternate, dataSource);
  }
}

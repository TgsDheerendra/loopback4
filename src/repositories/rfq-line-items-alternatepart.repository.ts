import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {RfqLineItemsAlternatePart} from '../models';

export class RfqLineItemsAlternatepartRepository extends DefaultCrudRepository<
  RfqLineItemsAlternatePart,
  typeof RfqLineItemsAlternatePart.prototype.id
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(RfqLineItemsAlternatePart, dataSource);
  }
}

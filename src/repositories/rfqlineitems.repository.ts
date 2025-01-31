import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {RfqLineItems, RfqLineItemsRelations} from '../models';

export class RfqlineitemsRepository extends DefaultCrudRepository<
  RfqLineItems,
  typeof RfqLineItems.prototype.id,
  RfqLineItemsRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(RfqLineItems, dataSource);
  }

  // Add method to get the transaction manager from dataSource
  async beginTransaction(): Promise<juggler.Transaction> {
    return this.dataSource.beginTransaction();
  }
}

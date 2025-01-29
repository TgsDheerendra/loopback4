import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbIdDataSource} from '../datasources';
import {MessageConstant, MessageConstantRelations} from '../models';

export class MessageConstantRepository extends DefaultCrudRepository<
  MessageConstant,
  typeof MessageConstant.prototype.category,
  MessageConstantRelations
> {
  constructor(
    @inject('datasources.mongoDbId') dataSource: MongoDbIdDataSource,
  ) {
    super(MessageConstant, dataSource);
  }
}

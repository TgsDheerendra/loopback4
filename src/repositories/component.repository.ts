import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Component, RfqLineItems} from '../models';
import {RfqLineItemsRepository} from './rfq-line-items.repository';

export class ComponentRepository extends DefaultCrudRepository<
  Component,
  typeof Component.prototype.id
> {

  public readonly rfqlineitems: HasManyRepositoryFactory<RfqLineItems, typeof Component.prototype.id>;

  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('RfqLineItemsRepository') protected rfqLineItemsRepositoryGetter: Getter<RfqLineItemsRepository>,) {
    super(Component, dataSource);
    this.rfqlineitems = this.createHasManyRepositoryFactoryFor('rfqlineitems', rfqLineItemsRepositoryGetter,);
    this.registerInclusionResolver('rfqlineitems', this.rfqlineitems.inclusionResolver);
  }
}

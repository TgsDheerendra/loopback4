import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Component, RfqLineItems} from '../models';
import {RfqLineItemsRepository} from './rfq-line-items.repository';

export class ComponentRepository extends DefaultCrudRepository<
  Component,
  typeof Component.prototype.id
> {
  public readonly rfqLineItems: HasManyRepositoryFactory<
    RfqLineItems,
    typeof Component.prototype.id
  >;
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('RfqLineItemsRepository')
    protected rfqLineItemsRepositoryGetter: Getter<RfqLineItemsRepository>,
  ) {
    super(Component, dataSource);
    // DM :: Above will manage the all require method to do opration on relational database
    this.rfqLineItems = this.createHasManyRepositoryFactoryFor(
      'rfqLineItems',
      rfqLineItemsRepositoryGetter,
    );
    // Register inclusion resolver
    this.registerInclusionResolver(
      'rfqLineItems',
      this.rfqLineItems.inclusionResolver,
    );
  }
}

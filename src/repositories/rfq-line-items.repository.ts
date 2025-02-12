import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Component, RfqLineItems, RfqLineItemsAlternatePart} from '../models';
import {ComponentRepository} from './component.repository';
import {RfqLineItemsAlternatepartRepository} from './rfq-line-items-alternatepart.repository';

export class RfqLineItemsRepository extends DefaultCrudRepository<
  RfqLineItems,
  typeof RfqLineItems.prototype.id
> {
  public readonly rfqLineItemsAlternatePart: HasManyRepositoryFactory<
    RfqLineItemsAlternatePart,
    typeof RfqLineItems.prototype.id
  >;
  public readonly component: BelongsToAccessor<
    Component,
    typeof RfqLineItems.prototype.componentId
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('RfqLineItemsAlternatepartRepository')
    protected rfqLineItemsAlternatePartRepositoryGetter: Getter<RfqLineItemsAlternatepartRepository>,
    @repository.getter('ComponentRepository')
    protected componentRepositoryGetter: Getter<ComponentRepository>,
  ) {
    super(RfqLineItems, dataSource);
    this.rfqLineItemsAlternatePart = this.createHasManyRepositoryFactoryFor(
      'rfqLineItemsAlternatePart',
      rfqLineItemsAlternatePartRepositoryGetter,
    );
    this.registerInclusionResolver(
      'rfqLineItemsAlternatePart', // This must match the relation name
      this.rfqLineItemsAlternatePart.inclusionResolver,
    );
    // ✅ Register the belongsTo relation properly
    this.component = this.createBelongsToAccessorFor(
      'component',
      componentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'component', // ✅ Ensure this matches @belongsTo() name in model
      this.component.inclusionResolver,
    );
  }
}

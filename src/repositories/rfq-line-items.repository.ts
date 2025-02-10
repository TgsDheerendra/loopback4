import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Component, RfqLineItems} from '../models';
import {ComponentRepository} from './component.repository';

export class RfqLineItemsRepository extends DefaultCrudRepository<
  RfqLineItems,
  typeof RfqLineItems.prototype.id
> {
  public readonly partmst: BelongsToAccessor<
    Component,
    typeof RfqLineItems.prototype.id
  >;

  public readonly parts: BelongsToAccessor<Component, typeof RfqLineItems.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('ComponentRepository')
    protected componentRepositoryGetter: Getter<ComponentRepository>,
  ) {
    super(RfqLineItems, dataSource);
    this.parts = this.createBelongsToAccessorFor('parts', componentRepositoryGetter,);
    this.registerInclusionResolver('parts', this.parts.inclusionResolver);
    this.partmst = this.createBelongsToAccessorFor(
      'partmst',
      componentRepositoryGetter,
    );
    this.registerInclusionResolver('partmst', this.partmst.inclusionResolver);
  }
}

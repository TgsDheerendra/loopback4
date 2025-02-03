import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Component} from '../models';

export class ComponentRepository extends DefaultCrudRepository<
  Component,
  typeof Component.prototype.id
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(Component, dataSource);
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Todo, TodoRelations} from '../models';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(Todo, dataSource);
  }

  // Define a custom method for the raw SQL query
  async findWithCategory(): Promise<any[]> {
    const sql = ` select * from todo td join category ct on td.categoryId = ct.id `;

    // Execute the query directly via the dataSource
    const result = await this.dataSource.execute(sql);
    return result;
  }
}

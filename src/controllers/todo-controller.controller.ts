import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {MessageConstant, Todo} from '../models';
import {MessageConstantRepository, TodoRepository} from '../repositories';

export class TodoControllerController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,

    @repository(MessageConstantRepository) // Inject MongoDB repository
    public messageConstantRepository: MessageConstantRepository,
  ) {}

  @post('/customToDo')
  @response(200, {
    description: 'Todo model instance',
    content: {'application/json': {schema: {'x-ts-type': Todo}}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              todoData: {type: 'object'},
              messageData: {type: 'object'},
            },
          },
        },
      },
    })
    requestData: {
      todoData: Omit<Todo, 'id'>;
      messageData: Omit<MessageConstant, 'category'>;
    },
  ): Promise<{todo: Todo; message: MessageConstant}> {
    // Insert into MySQL (Todo)
    const todo = await this.todoRepository.create(requestData.todoData);

    // Insert into MongoDB (MessageConstant)
    const message = await this.messageConstantRepository.create({
      ...requestData.messageData,
      category: new Date().getTime().toString(), // Generate unique ID manually
      createdDate: new Date().toISOString(),
    });

    return {todo, message};
  }

  @get('/customToDo/count')
  @response(200, {
    description: 'Todo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Todo) where?: Where<Todo>): Promise<Count> {
    return this.todoRepository.count(where);
  }

  // Define an endpoint to get todos with their associated category
  @get('/todos-with-category')
  async findTodosWithCategory(): Promise<any[]> {
    return this.todoRepository.findWithCategory();
  }

  @patch('/customToDo')
  @response(200, {
    description: 'Todo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.updateAll(todo, where);
  }

  @get('/customToDo/{id}')
  @response(200, {
    description: 'Todo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>,
  ): Promise<Todo> {
    return this.todoRepository.findById(id, filter);
  }

  @patch('/customToDo/{id}')
  @response(204, {
    description: 'Todo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    await this.todoRepository.updateById(id, todo);
  }

  @put('/customToDo/{id}')
  @response(204, {
    description: 'Todo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<void> {
    await this.todoRepository.replaceById(id, todo);
  }

  @del('/customToDo/{id}')
  @response(204, {
    description: 'Todo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
  }
}

import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Customer, CustomerEmployee, Employee} from '../models';
import {
  CustomerEmployeeRepository,
  CustomerRepository,
  EmployeeRepository,
} from '../repositories';

export class CustomerEmployeeController {
  constructor(
    @repository(CustomerEmployeeRepository)
    public customerEmployeeRepository: CustomerEmployeeRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) {}

  @post('/customerEmployees')
  async create(
    @requestBody() data: Omit<CustomerEmployee, 'id'>,
  ): Promise<CustomerEmployee> {
    // Check if Employee Exists
    const employeeExists = await this.employeeRepository
      .findById(data.employeeId)
      .catch(() => null);
    if (!employeeExists) {
      throw new HttpErrors.BadRequest(
        `Employee with id ${data.employeeId} does not exist`,
      );
    }

    // Check if Customer Exists
    const customerExists = await this.customerRepository
      .findById(data.customerId)
      .catch(() => null);
    if (!customerExists) {
      throw new HttpErrors.BadRequest(
        `Customer with id ${data.customerId} does not exist`,
      );
    }

    // Create the relation
    return this.customerEmployeeRepository.create(data);
  }

  @patch('/customerEmployees/{id}')
  async update(
    @param.path.number('id') id: number,
    @requestBody() data: Partial<CustomerEmployee>,
  ): Promise<void> {
    // Check if relation exists
    const existingMapping = await this.customerEmployeeRepository
      .findById(id)
      .catch(() => null);
    if (!existingMapping) {
      throw new HttpErrors.NotFound(
        `Customer-Employee relation with id ${id} not found`,
      );
    }

    // Check if Employee exists (if updating employeeId)
    if (data.employeeId) {
      const employeeExists = await this.employeeRepository
        .findById(data.employeeId)
        .catch(() => null);
      if (!employeeExists) {
        throw new HttpErrors.BadRequest(
          `Employee with id ${data.employeeId} does not exist`,
        );
      }
    }

    // Check if Customer exists (if updating customerId)
    if (data.customerId) {
      const customerExists = await this.customerRepository
        .findById(data.customerId)
        .catch(() => null);
      if (!customerExists) {
        throw new HttpErrors.BadRequest(
          `Customer with id ${data.customerId} does not exist`,
        );
      }
    }

    // Perform Update
    await this.customerEmployeeRepository.updateById(id, data);
  }

  @patch('/customerEmployees/updateDetails/{customerId}/{employeeId}')
  @response(200, {
    description: 'Customer-Employee relation updated successfully',
    content: {
      'application/json': {schema: getModelSchemaRef(CustomerEmployee)},
    },
  })
  async updateDetails(
    @param.path.number('customerId') customerId: number,
    @param.path.number('employeeId') employeeId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              customerData: getModelSchemaRef(Customer, {partial: true}),
              employeeData: getModelSchemaRef(Employee, {partial: true}),
            },
          },
        },
      },
    })
    data: {customerData?: Partial<Customer>; employeeData?: Partial<Employee>},
  ): Promise<CustomerEmployee> {
    // Check if the relationship exists
    const relationExists = await this.customerEmployeeRepository.findOne({
      where: {customerId, employeeId},
    });

    if (!relationExists) {
      throw new HttpErrors.NotFound(
        `No relation found between Customer ${customerId} and Employee ${employeeId}`,
      );
    }

    // Use a transaction to ensure both updates succeed or fail together
    const transaction =
      await this.customerEmployeeRepository.beginTransaction();
    try {
      if (data.customerData) {
        await this.customerRepository.updateById(customerId, data.customerData);
      }
      if (data.employeeData) {
        await this.employeeRepository.updateById(employeeId, data.employeeData);
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpErrors.BadRequest('Update failed: ' + error.message);
    }

    return relationExists;
  }
}

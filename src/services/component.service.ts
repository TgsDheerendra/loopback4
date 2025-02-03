import {injectable} from '@loopback/core';
import {validateOrReject} from 'class-validator';
import {ComponentDTO} from '../dtoValidator/component.dto';
import {Component} from '../models';
import {ComponentRepository} from '../repositories';
import {constants} from '../utils/constants';

@injectable()
export class ComponentService {
  constructor(private componentRepository: ComponentRepository) {}

  // Method to create a component
  async createComponent(dto: ComponentDTO): Promise<Component> {
    try {
      // Validate the DTO
      await validateOrReject(dto);

      // Business logic can be added here (e.g., formatting, checking conditions)
      // For example, transforming some fields or applying complex business rules

      // Create the component instance and persist it
      const component = new Component(dto);
      return await this.componentRepository.create(component);
    } catch (errors) {
      throw new Error(constants.VALIDATION_ERROR);
    }
  }

  // Method to update a component
  async updateComponent(id: number, dto: ComponentDTO): Promise<Component> {
    try {
      // Validate DTO
      await validateOrReject(dto);

      const existingComponent = await this.componentRepository.findById(id);
      if (!existingComponent) {
        throw new Error(constants.NOT_FOUND_ERROR);
      }

      // Apply any updates to the existing component
      const updatedComponent = Object.assign(existingComponent, dto);
      return await this.componentRepository.updateById(id, updatedComponent);
    } catch (error) {
      throw new Error(constants.VALIDATION_ERROR);
    }
  }
}

import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Component} from '../models';
import {ComponentRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class PartMasterService {
  constructor(
    @repository(ComponentRepository)
    public componentRepository: ComponentRepository,
  ) {}

  // Method to create a component
  async createComponent(component: Omit<Component, 'id'>): Promise<Component> {
    try {
      // Business logic can be added here (e.g., formatting, checking conditions)
      const part = await this.componentRepository.findOne({
        where: {mfgName: component.mfgName},
      });
      if (part) {
        throw new Error('Component already exist');
      }
      return await this.componentRepository.create(component);
    } catch (errors) {
      throw Error(errors);
    }
  }
}

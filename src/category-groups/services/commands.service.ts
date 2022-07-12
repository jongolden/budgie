import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCategoryGroup } from '../commands/create-category-group.command';

@Injectable()
export class CategoryGroupsCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  createCategoryGroup(name: string) {
    return this.commandBus.execute(new CreateCategoryGroup(name));
  }
}

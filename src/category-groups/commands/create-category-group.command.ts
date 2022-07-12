import { ICommand } from '@nestjs/cqrs';

export class CreateCategoryGroup implements ICommand {
  constructor(public readonly name: string) {}
}

import { ICommand } from '@nestjs/cqrs';

export class CreateCategory implements ICommand {
  constructor(public readonly name: string) {}
}

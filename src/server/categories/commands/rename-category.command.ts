import { ICommand } from '@nestjs/cqrs';

export class RenameCategory implements ICommand {
  constructor(public readonly category: string, public readonly name: string) {}
}

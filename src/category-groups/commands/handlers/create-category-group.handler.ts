import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryGroup } from '../create-category-group.command';

@CommandHandler(CreateCategoryGroup)
export class CreateCategoryGroupHandler
  implements ICommandHandler<CreateCategoryGroup>
{
  execute(command: CreateCategoryGroup): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

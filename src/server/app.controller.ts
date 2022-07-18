import { Controller, Get, Param, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  home() {
    return {};
  }

  @Get('accounts/:id')
  @Render('accounts/[id]')
  account(@Param('id') id: string) {
    console.log('account controller', id);
    return {
      id,
    };
  }
}

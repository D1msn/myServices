import { Controller, Get } from '@nestjs/common'

@Controller('/api')
export class AppController {
  @Get('/users')
  getUsers() {
    return [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
      { id: 3, name: 'Test 3' },
      { id: 4, name: 'Test 4' },
    ]
  }
}
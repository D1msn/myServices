import { DynamicModule, Global, Module } from '@nestjs/common'
import { NotionMainService } from './notion.main.service'
import { ClientOptions } from '@notionhq/client/build/src/Client'
import { NotionMyService } from './notion.myService'

@Global()
@Module({
  providers: [NotionMainService, NotionMyService],
  exports: [NotionMainService, NotionMyService],
})
export class NotionModule {
  static forRoot(options: ClientOptions): DynamicModule {
    return {
      module: NotionModule,
      providers: [
        {
          provide: 'NotionModuleOptions',
          useValue: options,
        },
      ],
      exports: [NotionMyService],
    }
  }
}

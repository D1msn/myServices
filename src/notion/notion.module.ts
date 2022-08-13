import { DynamicModule, Module } from '@nestjs/common'
import { NotionService } from './notion.service'
import { ClientOptions } from '@notionhq/client/build/src/Client'

@Module({
  imports: [],
  providers: [NotionService],
  exports: [NotionService],
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
    }
  }
}

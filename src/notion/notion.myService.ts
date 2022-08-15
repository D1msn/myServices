import { Injectable } from '@nestjs/common'
import { NotionMainService } from './notion.main.service'
import { Context } from '../telegramBot'

@Injectable()
export class NotionMyService {
  constructor(private readonly notionService: NotionMainService) {}

  public async createInboxPin(ctx: Context, { text }: { text: string }) {
    await this.notionService.createPage(ctx, {
      parent: {
        database_id: process.env.NOTION_INBOX_DB,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
      },
    })
  }

  public async createWorkTask(ctx: Context, { text }: { text: string }) {
    await this.notionService.createPage(ctx, {
      parent: {
        database_id: process.env.NOTION_WORK_TASK_DB,
      },
      properties: {
        Description: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
        Status: {
          type: 'select',
          select: {
            name: 'Новая',
          },
        },
      },
    })
  }

  public async createHomeTask(ctx: Context, { text }: { text: string }) {
    await this.notionService.createPage(ctx, {
      parent: {
        database_id: process.env.NOTION_HOME_TASK_PAGE,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
      },
    })
  }

  public async createPin(
    ctx: Context,
    params: { text: string; block_id: string },
  ) {
    await this.notionService.createPin(ctx, params)
  }
}

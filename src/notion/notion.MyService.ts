import { Injectable } from '@nestjs/common'
import { NotionService } from './notion.service'
import { isFullPage } from '@notionhq/client'
import { notionErrorHandler } from './utils/notion.errorHandler'
import { Context } from '../telegramBot'
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import { formatDate } from '../utils'
import { mainButtons } from '../telegramBot/bot.buttons'

@Injectable()
export class NotionMyService {
  constructor(private readonly notion: NotionService) {}

  public async createPage(ctx: Context, parameters: CreatePageParameters) {
    if (!(ctx.message && 'text' in ctx.message)) {
      await ctx.replyWithHTML(
        '⛔ <b> Сообщение может быть только текстовым! </b> ⛔',
      )
      return
    }
    try {
      const page = await this.notion.notion.pages.create(parameters)
      if (isFullPage(page)) {
        const text = ctx.session.type
          ? `✅ Запись <a href="${page.url}">${ctx.message.text}</a> добавлена`
          : `✅ Запись <a href="${page.url}">${ctx.message.text}</a> добавлена <b>в Inbox</b>`

        await ctx.replyWithHTML(text, mainButtons())
      }
    } catch (error: unknown) {
      await ctx.reply(notionErrorHandler(error))
    }
  }

  public async createInboxPin(ctx: Context, { text }: { text: string }) {
    await this.createPage(ctx, {
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
    await this.createPage(ctx, {
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
    await this.createPage(ctx, {
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
    { text, block_id }: { text: string; block_id: string },
  ) {
    if (!text) {
      await ctx.replyWithHTML(
        '⛔ <b> Сообщение может быть только текстовым! </b> ⛔',
      )
      return
    }

    const messageDate = formatDate(ctx.message.date)

    try {
      await this.notion.notion.blocks.children.append({
        block_id,
        children: [
          {
            type: 'toggle',
            toggle: {
              rich_text: [
                {
                  text: {
                    content: `${text} (дата создания: ${messageDate})`,
                  },
                },
              ],
            },
          },
        ],
      })
      await ctx.reply(
        `✅ Заметка [${text}](https://www.notion.so/d1ms/${block_id}) создана`,
        {
          parse_mode: 'Markdown',
          ...mainButtons(),
        },
      )
    } catch (error: unknown) {
      await ctx.reply(notionErrorHandler(error))
    }
  }
}

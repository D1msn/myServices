import { Inject, Injectable } from '@nestjs/common'
import { ClientOptions } from '@notionhq/client/build/src/Client'
import { Client, isFullPage } from '@notionhq/client'
import { Context } from '../telegramBot'
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import { mainButtons } from '../telegramBot/utils/buttons'
import { notionErrorHandler } from './utils/notion.errorHandler'
import { formatDate } from '../utils'

@Injectable()
export class NotionMainService {
  public readonly notion: Client

  constructor(
    @Inject('NotionModuleOptions')
    protected readonly notionModuleOptions: ClientOptions,
  ) {
    this.notion = new Client(this.notionModuleOptions)
  }

  public async createPage(ctx: Context, parameters: CreatePageParameters) {
    if (!(ctx.message && 'text' in ctx.message)) return
    try {
      const page = await this.notion.pages.create(parameters)
      if (isFullPage(page)) {
        const text = !!ctx.session.__scenes.current
          ? `✅ Запись <a href="${page.url}">${ctx.message.text}</a> добавлена`
          : `✅ Запись <a href="${page.url}">${ctx.message.text}</a> добавлена <b>в Inbox</b>`

        await ctx.replyWithHTML(text, mainButtons())
      }
    } catch (error: unknown) {
      await ctx.reply(notionErrorHandler(error))
    }
  }

  public async createPin(
    ctx: Context,
    { text, block_id }: { text: string; block_id: string },
  ) {
    const messageDate = formatDate(ctx.message.date)

    try {
      await this.notion.blocks.children.append({
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
      await ctx.replyWithHTML(
        `✅ Заметка <a href='${process.env.MY_NOTION_LINK}/${block_id}'>${text}</a> создана`,
        mainButtons(),
      )
    } catch (error: unknown) {
      await ctx.reply(notionErrorHandler(error))
    }
  }
}

import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
  Use,
} from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { actionButtons, cancelButton, mainButtons } from './bot.buttons'
import { buttons } from './constants/buttons'
import { Context } from './interfaces/bot.session'
import { NotionMyService } from '../notion/notion.MyService'
import { isAllowAccess } from '../utils'

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly myNotionServices: NotionMyService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    ctx.session.type = null
    ctx.session.itemType = null
    await ctx.reply(`Привет ${ctx.message.from.first_name}`, mainButtons())
  }

  @Use()
  async checkAccess(ctx: Context, next) {
    if (!isAllowAccess(ctx)) {
      await ctx.reply('❌❌❌ У вас нет доступа! ❌❌❌')
      return
    }
    next()
  }

  @Hears(buttons.HOME_BUTTON)
  async createTask(@Ctx() ctx: Context) {
    ctx.session.type = 'home'
    await ctx.replyWithHTML('⬇ Что будем делать❓', actionButtons())
  }

  @Hears(buttons.WORK_BUTTON)
  async createPin(@Ctx() ctx: Context) {
    ctx.session.type = 'work'
    await ctx.replyWithHTML('⬇ Что будем делать❓', actionButtons())
  }

  @Hears(buttons.CANCEL_BUTTON)
  async handleCancel(@Ctx() ctx: Context) {
    ctx.session.type = null
    ctx.session.itemType = null
    await ctx.replyWithHTML('Создание отменено', mainButtons())
  }

  @Action('createTask')
  async onCreateTask(@Message('text') text, @Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    ctx.session.itemType = 'task'
    await ctx.deleteMessage()
    await ctx.reply('Введите текст задачи', cancelButton())
  }

  @Action('createPin')
  async onCreatePin(@Message('text') text, @Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    ctx.session.itemType = 'pin'
    await ctx.deleteMessage()
    await ctx.reply(`Введите текст заметки`, cancelButton())
  }

  @On('message')
  async onMessage(@Message('text') text, @Ctx() ctx: Context) {
    if (!ctx.session.type) {
      await this.myNotionServices.createInboxPin(ctx, { text })
    }

    if (ctx.session.type === 'work') {
      switch (ctx.session.itemType) {
        case 'task':
          await this.myNotionServices.createWorkTask(ctx, { text })
          break
        case 'pin':
          await this.myNotionServices.createPin(ctx, {
            text,
            block_id: process.env.NOTION_WORK_PIN_PAGE,
          })
          break
        default:
          ctx.reply('Нет такого типа!!')
      }
    }

    if (ctx.session.type === 'home') {
      switch (ctx.session.itemType) {
        case 'task':
          await this.myNotionServices.createHomeTask(ctx, { text })
          break
        case 'pin':
          await this.myNotionServices.createPin(ctx, {
            text,
            block_id: process.env.NOTION_HOME_PIN_PAGE,
          })
          break
        default:
          ctx.reply('Нет такого типа!!')
      }
    }

    ctx.session.type = null
    ctx.session.itemType = null
  }
}

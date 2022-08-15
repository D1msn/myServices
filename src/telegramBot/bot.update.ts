import {
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
import { mainButtons } from './utils/buttons'
import { buttons } from './constants/buttons'
import { Context } from './interfaces/bot.session'
import { NotionMyService } from '../notion/notion.myService'
import { isAllowAccess } from '../utils'
import { scenes } from './constants/scenes'

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly myNotionServices: NotionMyService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
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
    await ctx.scene.enter(scenes.HOME_SCENE)
  }

  @Hears(buttons.WORK_BUTTON)
  async createPin(@Ctx() ctx: Context) {
    await ctx.scene.enter(scenes.WORK_SCENE)
  }

  @On('text')
  async onMessage(@Message('text') text, @Ctx() ctx: Context) {
    await this.myNotionServices.createInboxPin(ctx, { text })
  }
}

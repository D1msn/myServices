import { Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'
import { actionButtons } from './bot.buttons'

@Update()
export class BotUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply(`Привет ${ctx.message.from.first_name}`)
    await ctx.reply(`Что хотите сделать?`, actionButtons())
  }

  @Hears('📌 Создать задачу')
  async createTask(@Ctx() ctx: Context) {
    await ctx.reply('Тут мы будем создавать Задачу(в разработке)')
  }

  @Hears('📋 Создать заметку')
  async createPin(@Ctx() ctx: Context) {
    await ctx.reply('Тут мы будем создавать заметку(в разработке)')
  }
}

import {
  Action,
  Ctx,
  Hears,
  Message,
  On,
  Scene,
  SceneEnter,
} from 'nestjs-telegraf'
import { Context } from '../interfaces/bot.session'
import { actionButtons, cancelButton, mainButtons } from '../utils/buttons'
import { scenes } from '../constants/scenes'
import { buttons, buttonsActions } from '../constants/buttons'
import { NotionMyService } from '../../notion/notion.myService'
import { getCancelButtonMessage } from '../utils'
import { APP_CONFIG } from '../../app.config'

@Scene(scenes.HOME_SCENE)
export class HomeScene {
  constructor(private readonly myNotionServices: NotionMyService) {}

  @SceneEnter()
  async onEnter(ctx: Context) {
    await ctx.replyWithHTML('⬇ Что будем делать❓', actionButtons())
  }

  @Action(buttonsActions.CREATE_TASK)
  async onCreateTask(@Message('text') text, @Ctx() ctx: Context) {
    ctx.scene.session.state.itemType = 'task'
    await ctx.answerCbQuery()
    await ctx.deleteMessage()
    await ctx.reply('Введите текст задачи', cancelButton())
  }

  @Action(buttonsActions.CREATE_PIN)
  async onCreatePin(@Message('text') text, @Ctx() ctx: Context) {
    ctx.scene.session.state.itemType = 'pin'
    await ctx.answerCbQuery()
    await ctx.deleteMessage()
    await ctx.reply(
      `Введите текст заметки (В начале укажите заголовок, а после "${APP_CONFIG.titleNotionSeparator}" тело заметки`,
      cancelButton(),
    )
  }

  @Hears(buttons.CANCEL_BUTTON)
  async handleCancel(@Ctx() ctx: Context) {
    ctx.scene.session.state.type = 'home'
    await ctx.replyWithHTML(getCancelButtonMessage(ctx), mainButtons())
    await ctx.scene.leave()
  }

  @On('text')
  async onText(@Message('text') text, @Ctx() ctx: Context) {
    switch (ctx.session.__scenes.state.itemType) {
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
        await ctx.reply('Нет такого типа')
    }
    await ctx.scene.leave()
  }

  @On('message')
  async onMessage(ctx: Context) {
    await ctx.replyWithHTML(
      '⛔ <b> Сообщение может быть только текстовым! </b> ⛔',
    )
    await ctx.scene.reenter()
  }
}

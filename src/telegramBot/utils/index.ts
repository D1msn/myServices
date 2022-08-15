import { Context } from '../interfaces/bot.session'

export const getCancelButtonMessage = (ctx: Context) => {
  const session = ctx.session.__scenes.state

  const message = {
    home: '🏠  домашней',
    work: '🧰 рабочей',
    task: '📋 задачи',
    pin: '📌 заметки',
  }

  return `<b>Создание:</b> 
<ins>${message[session.type]} ${message[session.itemType]}</ins> отменено`
}

import { Markup } from 'telegraf'

export const actionButtons = () => {
  return Markup.keyboard(
    [
      Markup.button.callback('📋 Создать заметку', 'createPin'),
      Markup.button.callback('📌 Создать задачу', 'createTask'),
    ],
    {
      columns: 2,
    },
  ).resize(true)
}

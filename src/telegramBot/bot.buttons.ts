import { Markup } from 'telegraf'
import { buttons } from './constants/buttons'

export const mainButtons = () => {
  return Markup.keyboard([buttons.HOME_BUTTON, buttons.WORK_BUTTON], {
    columns: 2,
  }).resize(true)
}

export const actionButtons = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback(buttons.CREATE_TASK_BUTTON, 'createTask'),
    Markup.button.callback(buttons.CREATE_PIN_BUTTON, 'createPin'),
  ])
}

export const cancelButton = () =>
  Markup.keyboard([buttons.CANCEL_BUTTON]).resize(true)

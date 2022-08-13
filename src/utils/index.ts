import { Context } from '../telegramBot'

export const splitToNumbersArr = (str: string) =>
  str.split(',').map((e) => Number(e))

export const isAllowAccess = (ctx: Context) =>
  splitToNumbersArr(process.env.TELEGRAM_ALLOW_IDS).includes(ctx.from.id)

export const formatDate = (date: number) =>
  new Date(date * 1000).toLocaleDateString()

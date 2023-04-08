import { APP_CONFIG } from '../../app.config'

export const getSplitText = (text: string) => {
  const splitText = text.split(APP_CONFIG.titleNotionSeparator)
  const title = splitText[0]
  const body = splitText[1]

  return {
    title,
    body,
  }
}

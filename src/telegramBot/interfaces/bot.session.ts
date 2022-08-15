import { Scenes } from 'telegraf'

type SessionType = {
  current?: string
  expires?: number
  state: {
    type?: 'home' | 'work'
    itemType?: 'pin' | 'task'
  }
}

export type Context = Scenes.SceneContext<SessionType>

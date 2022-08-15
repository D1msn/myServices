import { Module } from '@nestjs/common'
import { BotUpdate } from './bot.update'
import { HomeScene } from './scenes/bot.home.scene'
import { WorkScene } from './scenes/bot.work.scene'

@Module({
  providers: [BotUpdate, WorkScene, HomeScene],
})
export class BotModule {}

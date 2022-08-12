import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import * as LocalSession from 'telegraf-session-local'
import { TelegrafModule } from 'nestjs-telegraf'
import { ConfigModule } from '@nestjs/config'
import { BotUpdate } from './telegramBot/bot.update'

const sessions = new LocalSession({ database: 'session_db.json' })

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TELEGRAM_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [BotUpdate],
})
export class AppModule {}

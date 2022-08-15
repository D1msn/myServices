import { Module } from '@nestjs/common'
import * as LocalSession from 'telegraf-session-local'
import { TelegrafModule } from 'nestjs-telegraf'
import { ConfigModule } from '@nestjs/config'
import { NotionModule } from './notion/notion.module'
import { LogLevel } from '@notionhq/client'
import { BotModule } from './telegramBot/bot.module'

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
    NotionModule.forRoot({
      auth: process.env.NOTION_TOKEN,
      logLevel: LogLevel.DEBUG,
    }),
    BotModule,
  ],
})
export class AppModule {}

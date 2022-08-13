import { Module } from '@nestjs/common'
import * as LocalSession from 'telegraf-session-local'
import { TelegrafModule } from 'nestjs-telegraf'
import { ConfigModule } from '@nestjs/config'
import { BotUpdate } from './telegramBot/bot.update'
import { NotionModule } from './notion/notion.module'
import { LogLevel } from '@notionhq/client'
import { NotionMyService } from './notion/notion.MyService'

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
  ],
  controllers: [],
  providers: [BotUpdate, NotionMyService],
})
export class AppModule {}

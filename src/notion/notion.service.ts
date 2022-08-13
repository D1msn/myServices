import { Inject, Injectable } from '@nestjs/common'
import {
  ClientOptions,
  RequestParameters,
} from '@notionhq/client/build/src/Client'
import { Client } from '@notionhq/client'
import {
  SearchParameters,
  SearchResponse,
} from '@notionhq/client/build/src/api-endpoints'

@Injectable()
export class NotionService {
  protected _notion: Client

  constructor(
    @Inject('NotionModuleOptions')
    protected readonly notionModuleOptions: ClientOptions,
  ) {
    this._notion = new Client(this.notionModuleOptions)
  }

  public get notion() {
    return this._notion
  }

  public get databases() {
    return this.notion.databases
  }

  public request<Response>(
    requestParameters: RequestParameters,
  ): Promise<Response> {
    return this.notion.request(requestParameters)
  }

  public search(args: SearchParameters): Promise<SearchResponse> {
    return this.notion.search(args)
  }

  public get users() {
    return this.notion.users
  }
}

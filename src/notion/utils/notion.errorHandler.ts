import {
  APIErrorCode,
  ClientErrorCode,
  isNotionClientError,
} from '@notionhq/client'

//todo Можно дополнить нормальными сообщениями
export const notionErrorHandler = (error: unknown) => {
  if (isNotionClientError(error)) {
    switch (error.code) {
      case ClientErrorCode.RequestTimeout:
      case ClientErrorCode.ResponseError:
      case APIErrorCode.ObjectNotFound:
      case APIErrorCode.RateLimited:
      case APIErrorCode.InvalidJSON:
      case APIErrorCode.InvalidRequestURL:
      case APIErrorCode.InvalidRequest:
      case APIErrorCode.ValidationError:
      case APIErrorCode.ConflictError:
      case APIErrorCode.InternalServerError:
      case APIErrorCode.ServiceUnavailable:
      case APIErrorCode.Unauthorized:
      case APIErrorCode.RestrictedResource:
        return `Произошла ошибка код: ${error.code}`
      default:
        return 'Произошла непредвиденная ошибка'
    }
  }
}

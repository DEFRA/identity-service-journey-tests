import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

export abstract class BaseClient {
  protected readonly apiContext: APIRequestContext
  protected readonly serviceName?: string

  constructor(apiContext: APIRequestContext, serviceName?: string) {
    this.apiContext = apiContext
    this.serviceName = serviceName
  }

  // eslint-disable-next-line
  private prepareRemoteRequest(url: string, options?: any) {
    if (process.env.apiKey !== 'undefined' && process.env.CDP === undefined) {
      if (options !== undefined && options !== null) {
        if (!options.headers) {
          options.headers = {}
        }
        options.headers['Content-Type'] = 'application/json'
        options.headers['x-api-key'] = process.env.apiKey
        options.headers['x-operator-id'] = process.env.operatorId
        options.headers['x-correlation-id'] = process.env.correlationId
      } else {
        options = {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.apiKey,
            'x-operator-id': process.env.operatorId,
            'x-correlation-id': process.env.correlationId
          }
        }
      }
      const absoluteUrl =
        this.serviceName &&
        this.serviceName === 'identity-service-helper' &&
        process.env.ENVIRONMENT === 'dev'
          ? `/${this.serviceName}` + url
          : url
      const apiKeyOptions = options
      return { apiKeyOptions, absoluteUrl }
    } else {
      return { apiKeyOptions: options, absoluteUrl: url }
    }
  }

  protected async get<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.get(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }

  protected async post<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.post(url, options)
    expect(response.status()).toEqual(statusCode)
    if (statusCode === StatusCodes.NO_CONTENT) {
      return {} as T
    } else {
      return (await response.json()) as T
    }
  }

  protected async postWithResponseReturn(url: string, options?: object) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    return await this.apiContext.post(url, options)
  }

  protected async put<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.put(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }
}

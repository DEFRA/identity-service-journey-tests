import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

export abstract class BaseClient {
  protected readonly apiContext: APIRequestContext

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
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
      } else {
        options = {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.apiKey
          }
        }
      }
      // APIRequestContext removes /identity-service-helper from the endpoint
      const absoluteUrl = '/identity-service-helper' + url
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
    return (await response.json()) as T
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

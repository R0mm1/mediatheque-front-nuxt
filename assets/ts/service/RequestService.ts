import { singleton, autoInjectable, container } from 'tsyringe'

import { AxiosResponse, AxiosError, Method } from 'axios'
import Request from '~/assets/ts/objects/Request'
import RequestServiceInterface, { ExecuteOptionsInterface } from '~/assets/ts/service/RequestServiceInterface'
import LoginWorkflowService from '~/assets/ts/service/auth/LoginWorkflowService'

const config = require('../../../mediatheque.json')
const loginWorkflowService = container.resolve(LoginWorkflowService)

@autoInjectable()
@singleton()
export default class RequestService implements RequestServiceInterface {
  protected lastResponse?: AxiosResponse;

  createRequest (url: string, method: Method = 'GET') {
    return new Request(url, method)
  }

  execute<ExpectedResponseType> (request: Request, options: ExecuteOptionsInterface = {}): Promise<ExpectedResponseType> {
    const skipCommonUrlBase = options.skipCommonUrlBase ?? false
    request.setBaseUrl(config.api.endpoint + (skipCommonUrlBase ? '' : config.api.commonUrlBase))

    request.addHeader('Authorization', 'Bearer ' + window.sessionStorage.getItem('access_token'))

    return request.trigger<ExpectedResponseType>()
      .then(
        response => this.handleSuccess<ExpectedResponseType>(response),
        (error) => {
          const response = this.handleFailure<ExpectedResponseType>(error, request)
          if (response instanceof Error) {
            return Promise.reject(response)
          } else {
            return response
          }
        }
      )
  }

  public sendFile (file: File, url: string) {
    const formData = new FormData()
    formData.append('file', file)

    const request = this.createRequest(url, 'POST')
      .addHeader('Authorization', 'Bearer ' + window.sessionStorage.getItem('access_token'))
      .removeHeader('Content-Type') // content type will be automatically set with the correct boundary
      .setBody(formData)
      .setBaseUrl(config.api.endpoint + config.api.commonUrlBase)

    return request.trigger<any>()
      .then(
        response => this.handleSuccess(response),
        (error) => {
          const response = this.handleFailure(error, request)
          if (response instanceof Error) {
            return Promise.reject(response)
          } else {
            return Promise.resolve(response)
          }
        }
      )
  }

  private handleSuccess<ExpectedResponseType> (response: AxiosResponse<ExpectedResponseType>): ExpectedResponseType {
    this.lastResponse = response
    return response.data
  }

  private handleFailure<ExpectedResponseType> (error: AxiosError, request: Request) {
    if (error.response?.status === 401 || error.request?.status === 401) {
      return loginWorkflowService.start()
        .then(
          () => {
            // If we get there because the refresh token worked, we try the request again
            return this.execute<ExpectedResponseType>(request)
          },
          () => {
            // Currently, all resources are accessible to logged-in users, so we should not get there
            return Promise.reject(new Error('Unauthorized'))
          }
        )
    } else {
      return error
    }
  }
}

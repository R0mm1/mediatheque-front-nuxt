import { singleton, autoInjectable, inject } from 'tsyringe'

import { AxiosResponse, AxiosError, Method } from 'axios'
import Request from '~/assets/ts/objects/Request'
import RequestServiceInterface from '~/assets/ts/service/RequestServiceInterface'
import Tokens from '~/assets/ts/config/Public'
import Api from '~/assets/ts/config/public/Api'
import LoginWorkflowService from '~/assets/ts/service/auth/LoginWorkflowService'

@autoInjectable()
@singleton()
export default class RequestService implements RequestServiceInterface {
  protected lastResponse?: AxiosResponse

  constructor (
    @inject(Tokens.api) private configApi: Api,
    private loginWorkflowService: LoginWorkflowService
  ) {
  }

  getApiEndpoint () {
    return this.configApi.endpoint
  }

  createRequest (url: string, method: Method = 'GET') {
    return new Request(url, method)
  }

  execute<ExpectedResponseType> (request: Request): Promise<ExpectedResponseType> {
    request.setBaseUrl(this.getApiEndpoint())

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

  public sendFile (file: File, url: string, fieldName: string = 'file') {
    const formData = new FormData()
    formData.append(fieldName, file)

    const request = this.createRequest(url, 'POST')
      .addHeader('Authorization', 'Bearer ' + window.sessionStorage.getItem('access_token'))
      .removeHeader('Content-Type') // content type will be automatically set with the correct boundary
      .setBody(formData)
      .setBaseUrl(this.configApi.endpoint)

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
      return this.loginWorkflowService.start()
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

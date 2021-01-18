import { singleton, autoInjectable } from 'tsyringe'

import { AxiosResponse, Method } from 'axios'
import AuthenticationService from '~/assets/ts/service/AuthenticationService'
import Request from '~/assets/ts/objects/Request'
import RequestServiceInterface, { ExecuteOptionsInterface } from '~/assets/ts/service/RequestServiceInterface'

const config = require('../../../mediatheque.json')

@autoInjectable()
@singleton()
export default class RequestService implements RequestServiceInterface {
  protected lastResponse?: AxiosResponse;

  // eslint-disable-next-line no-useless-constructor
  constructor (private authenticationService: AuthenticationService) {
  }

  createRequest (url: string, method: Method = 'GET') {
    return new Request(url, method)
  }

  execute<ExpectedResponseType> (request: Request, options: ExecuteOptionsInterface = {}): Promise<ExpectedResponseType> {
    if (!this.authenticationService.isLoggedIn()) {
      this.goToLoginPage()
    }

    const skipAuthentication = options.skipAuthentication ?? false
    if (!skipAuthentication) {
      request.addHeader('Authorization', 'Bearer ' + this.authenticationService.getToken())
    }

    const skipCommonUrlBase = options.skipCommonUrlBase ?? false
    request.setBaseUrl('http://' + config.api.endpoint + (skipCommonUrlBase ? '' : config.api.commonUrlBase))

    return request.trigger<ExpectedResponseType>()
      .then(
        response => this.handleSuccess<ExpectedResponseType>(response),
        (error) => {
          const requestCredentialsIfUnauthorized = options.requestCredentialsIfUnauthorized ?? false
          const response = this.handleFailure<ExpectedResponseType>(error, request, requestCredentialsIfUnauthorized)
          if (response instanceof Error) {
            return Promise.reject(response)
          } else {
            return Promise.resolve(response)
          }
        }
      )
  }

  public sendFile (file: File, url: string, requestCredentialsIfUnauthorized: boolean = false) {
    const formData = new FormData()
    formData.append('file', file)

    const request = this.createRequest(url, 'POST')
      .addHeader('Authorization', 'Bearer ' + this.authenticationService.getToken())
      .removeHeader('Content-Type') // content type will be automatically set with the correct boundary
      .setBody(formData)

    return request.trigger<any>()
      .then(
        response => this.handleSuccess(response),
        (error) => {
          const response = this.handleFailure(error, request, requestCredentialsIfUnauthorized)
          if (response instanceof Error) {
            return Promise.reject(response)
          } else {
            return Promise.resolve(response)
          }
        }
      )
  }

  protected goToLoginPage () {
    window.location = config.params.login_page
  }

  private handleSuccess<ExpectedResponseType> (response: AxiosResponse<ExpectedResponseType>): ExpectedResponseType {
    this.lastResponse = response
    return response.data
  }

  private handleFailure<ExpectedResponseType> (error: AxiosResponse, request: Request, requestCredentialsIfUnauthorized: boolean = false): ExpectedResponseType | Error {
    if (error.status === 401) {
      if (requestCredentialsIfUnauthorized) {
        this.goToLoginPage()
      }

      return this.authenticationService.refreshToken()
        .then(() => {
          // We try again after the token has been refreshed, but if authentication fail again, we go
          // to the login page instead of trying again and again.
          return this.execute<ExpectedResponseType>(request, {
            requestCredentialsIfUnauthorized: true
          })
        })
        .catch(() => {
          // If we can't obtain a new token with the refresh token, that means it's probably expired,
          // so we go to the login page.
          this.goToLoginPage()
        })
    } else {
      console.log(error)
      return new Error(error.statusText)
    }
  }
}

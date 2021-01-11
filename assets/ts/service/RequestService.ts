import { singleton, autoInjectable } from 'tsyringe'

import AuthenticationService from '~/assets/ts/service/AuthenticationService'
import Request from '~/assets/ts/objects/Request'

const config = require('../../../mediatheque.json')

@autoInjectable()
@singleton()
export default class RequestService {
  // eslint-disable-next-line no-useless-constructor
  constructor (private authenticationService: AuthenticationService) {
  }

  createRequest (url: string, method: string = 'GET') {
    return new Request(url, method)
  }

  execute (request: Request, requestCredentialsIfUnauthorized: boolean = false, skipAuthentication: boolean = false) {
    if (!this.authenticationService.isLoggedIn()) {
      this.goToLoginPage()
    }

    if (!skipAuthentication) {
      request.addHeader('Authorization', 'Bearer ' + this.authenticationService.getToken())
    }

    return request.trigger()
      .then((response: Response) => this.handleResponse(response, request, requestCredentialsIfUnauthorized))
  }

  public sendFile (file: File, url: string, requestCredentialsIfUnauthorized: boolean = false) {
    const formData = new FormData()
    formData.append('file', file)

    const request = this.createRequest(url, 'POST')
      .addHeader('Authorization', 'Bearer ' + this.authenticationService.getToken())
      .removeHeader('Content-Type') // content type will be automatically set with the correct boundary
      .setBody(formData)

    return request.trigger()
      .then((response: Response) => this.handleResponse(response, request, requestCredentialsIfUnauthorized))
  }

  protected goToLoginPage () {
    window.location = config.params.login_page
  }

  private handleResponse (response: Response, request: Request, requestCredentialsIfUnauthorized: boolean = false) {
    if (response.status >= 200 && response.status < 300) {
      if (this.isResponseContainingJson(response)) {
        return response.json()
      } else {
        return Promise.resolve(response)
      }
    } else if (response.status === 401) {
      if (requestCredentialsIfUnauthorized) {
        this.goToLoginPage()
        return
      }

      return this.authenticationService.refreshToken()
        .then(() => {
          // We try again after the token has been refreshed, but if authentication fail again, we go
          // to the login page instead of trying again and again.
          return this.execute(request, true)
        })
        .catch(() => {
          // If we can't obtain a new token with the refresh token, that means it's probably expired,
          // so we go to the login page.
          this.goToLoginPage()
        })
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  /**
     * Check if the response body contains JSON, based on the 'Content-Type' header. Return undefined
     * if the header is not present on the response
     * @param response
     */
  private isResponseContainingJson (response: Response): boolean | undefined {
    const jsonMimeType = ['application/json', 'application/ld+json']
    const contentType = response.headers.get('Content-Type')
    let jsonLike = false

    if (contentType === null) {
      return undefined
    }

    for (let mimeIterator = 0; mimeIterator < jsonMimeType.length; mimeIterator++) {
      if (contentType.includes(jsonMimeType[mimeIterator])) {
        jsonLike = true
        break
      }
    }

    return jsonLike
  }
}

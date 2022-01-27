import { autoInjectable, singleton } from 'tsyringe'
import axios from 'axios'

const config = require('../../../../mediatheque.json')

@autoInjectable()
@singleton()
export default class LoginService {
  login () {
    if (window.sessionStorage.getItem('code_verifier') === null) {
      // The code exchange step hasn't been played yet
      this.codeExchangeRequest()
    } else {
      this.getTokenRequest()
    }
  }

  private codeExchangeRequest () {
    const array = new Uint32Array(28)
    window.crypto.getRandomValues(array)
    const codeVerifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('')

    window.sessionStorage.setItem('code_verifier', codeVerifier)
    window.sessionStorage.setItem('authentication_redirect', window.location.href)

    this.generateCodeChallenge(codeVerifier)
      .then((codeChallenge) => {
        const redirectUri = location.protocol + '//' + location.host + '/authentication'

        const args = new URLSearchParams({
          response_type: 'code',
          client_id: config.auth.client_id,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: redirectUri
        })
        window.location.href = config.auth.authorization_endpoint + '/?' + args
      })
      .catch((error) => {
        console.error(error)
      })
  }

  private getTokenRequest () {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const code = urlSearchParams.get('code')

    if (code === null) {
      console.error('Missing code in authorizarion server response')
      return
    }

    const codeVerifier = window.sessionStorage.getItem('code_verifier')
    if (codeVerifier === null) {
      console.error('Missing code verifier')
      return
    }

    return axios.post(
      config.auth.token_endpoint,
      (new URLSearchParams({
        client_id: config.auth.client_id,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: location.href.replace(location.search, ''),
        code
      })).toString(),
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        window.sessionStorage.setItem('access_token', response.data.access_token)
        window.sessionStorage.setItem('refresh_token', response.data.refresh_token)

        const authenticationRedirect: string|null = window.sessionStorage.getItem('authentication_redirect')
        if (authenticationRedirect !== null) {
          window.location.href = authenticationRedirect
        } else {
          window.location.href = location.protocol + '//' + location.host + config.default.page
        }
      })
      .finally(() => window.sessionStorage.removeItem('code_verifier'))
  }

  private generateCodeChallenge (codeVerifier: string) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
      .then(digest => btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
      )
  }
}

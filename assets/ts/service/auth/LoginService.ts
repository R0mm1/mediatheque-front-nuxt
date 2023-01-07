import { autoInjectable, inject, singleton } from 'tsyringe'
import axios from 'axios'
import Tokens from '~/assets/ts/config/Public'
import Auth from '~/assets/ts/config/public/Auth'
import Default from '~/assets/ts/config/public/Default'

@autoInjectable()
@singleton()
export default class LoginService {
  constructor (@inject(Tokens.auth) private configAuth: Auth, @inject(Tokens.default) private configDefault: Default) {
  }

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
          client_id: this.configAuth.client_id,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: redirectUri
        })
        window.location.href = this.configAuth.authorization_endpoint + '/?' + args
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
      this.configAuth.token_endpoint,
      (new URLSearchParams({
        client_id: this.configAuth.client_id,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: location.href.replace(location.search, ''),
        code
      })).toString()
    )

      .then((response: { data: { access_token: string; refresh_token: string } }) => {
        const authenticationRedirect: string|null = window.sessionStorage.getItem('authentication_redirect')

        window.sessionStorage.clear()
        window.sessionStorage.setItem('access_token', response.data.access_token)
        window.sessionStorage.setItem('refresh_token', response.data.refresh_token)

        if (authenticationRedirect !== null) {
          window.location.href = authenticationRedirect
        } else {
          window.location.href = location.protocol + '//' + location.host + this.configDefault.page
        }
      })
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

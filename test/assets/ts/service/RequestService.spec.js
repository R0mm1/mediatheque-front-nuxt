import 'reflect-metadata'
import { container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import Request from '~/assets/ts/objects/Request'
import AuthenticationService from '~/assets/ts/service/AuthenticationService'
import Navigator from '~/assets/ts/objects/Navigator'

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const axiosMock = new MockAdapter(axios)

jest.mock('~/assets/ts/service/AuthenticationService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      isLoggedIn: jest.fn(),
      getToken: jest.fn(),
      refreshToken: jest.fn()
    }
  })
})
jest.mock('~/assets/ts/objects/Navigator')

const authenticationService = container.resolve(AuthenticationService)

describe('RequestService', function () {
  test('redirect to login page when the user is not logged in', async () => {
    authenticationService.isLoggedIn.mockReturnValue(false) // The user is not considered logged in
    authenticationService.getToken.mockReturnValue('123') // So even if there is a token...
    authenticationService.refreshToken.mockImplementation(() => Promise.resolve({ token: '456' })) // ...and a refresh token, he should be redirected to the login page
    container.registerInstance(AuthenticationService, authenticationService)

    const requestService = container.resolve(RequestService)
    axiosMock.onGet(/.*\/something$/).reply(200, { something: 'cool' })

    const navigatorSpy = jest.spyOn(Navigator, 'navigate')

    await requestService.execute(new Request('/something'))
      .catch((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual('Redirection to login page')
      })
    expect(navigatorSpy).toHaveBeenCalledWith('/login')
  })

  test('redirect to login page when the user is logged but the token is invalid and there is no valid refresh token', async () => {
    authenticationService.isLoggedIn.mockReturnValue(true) // The user is logged in
    authenticationService.getToken.mockReturnValue('123') // There is a token
    axiosMock.onGet(/.*\/something$/).reply(401, {}) // But the API refuse it
    authenticationService.refreshToken.mockImplementation(() => Promise.reject(new Error(''))) // The API also refuse the refresh token

    container.registerInstance(AuthenticationService, authenticationService)
    const requestService = container.resolve(RequestService)

    const navigatorSpy = jest.spyOn(Navigator, 'navigate')

    await requestService.execute(new Request('/something'))
      .catch((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual('Redirection to login page')
      })

    expect(navigatorSpy).toHaveBeenCalledWith('/login')
  })

  test('doesn\'t redirect to the login page when the token is invalid but the refresh token is still valid', async () => {
    authenticationService.isLoggedIn.mockReturnValue(true) // The user is logged in
    authenticationService.getToken.mockReturnValue('123') // There is a token
    axiosMock.onGet(/.*\/something$/)
      .replyOnce(401, { refresh: 'KO' }) // But the API refuse it
      .onGet(/.*\/something$/)
      .replyOnce(200, { refresh: 'OK' }) // But after refresh it will accept it
    authenticationService.refreshToken.mockImplementation(() => Promise.resolve({
      token: 'abc',
      refresh_token: 'def'
    })) // The refresh token is valid thought

    container.registerInstance(AuthenticationService, authenticationService)
    const requestService = container.resolve(RequestService)

    const navigatorSpy = jest.spyOn(Navigator, 'navigate')

    await requestService.execute(new Request('/something'))
      .catch((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual('Redirection to login page')
      })

    expect(navigatorSpy).not.toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
    container.clearInstances()
    axiosMock.reset()
  })
})

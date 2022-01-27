import { singleton, autoInjectable, container } from 'tsyringe'
import UserinfoService from '~/assets/ts/service/auth/UserinfoService'
import LoginService from '~/assets/ts/service/auth/LoginService'
import RefreshTokenService from '~/assets/ts/service/auth/RefreshTokenService'

const userinfoService = container.resolve(UserinfoService)
const refreshTokenService = container.resolve(RefreshTokenService)
const loginService = container.resolve(LoginService)

@autoInjectable()
@singleton()
export default class LoginWorkflowService {
  start () {
    return userinfoService.getUserInfos()
      .catch(() => refreshTokenService.refresh()
        .catch(() => loginService.login())
      )
  }
}

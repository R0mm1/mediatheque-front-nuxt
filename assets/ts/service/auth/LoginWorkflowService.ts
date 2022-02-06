import { singleton, autoInjectable } from 'tsyringe'
import UserinfoService from '~/assets/ts/service/auth/UserinfoService'
import LoginService from '~/assets/ts/service/auth/LoginService'
import RefreshTokenService from '~/assets/ts/service/auth/RefreshTokenService'

@autoInjectable()
@singleton()
export default class LoginWorkflowService {
  constructor (
    private userinfoService: UserinfoService,
    private refreshTokenService: RefreshTokenService,
    private loginService: LoginService
  ) {
  }

  start () {
    return this.userinfoService.getUserInfos()
      .catch(() => this.refreshTokenService.refresh()
        .catch(() => this.loginService.login())
      )
  }
}

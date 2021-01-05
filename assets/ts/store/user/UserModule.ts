import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import store from '~/assets/ts/store/store'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import { UserEntity } from '~/assets/ts/entity/UserEntity'
import RequestService from '~/assets/ts/service/RequestService'

const requestService = container.resolve(RequestService)

@Module({ dynamic: true, name: 'author', store, namespaced: true })
class UserModule extends VuexModule implements EntityModuleInterface<UserEntity> {
    protected baseUrl: string = '/users';
    protected baseUser: UserEntity = {};

    user: UserEntity = this.baseUser;

    @Action({ rawError: true }) get (id: number): Promise<UserEntity | undefined> {
      const request = requestService.createRequest(this.baseUrl + '/' + id)
      return requestService.execute(request)
        .then((result) => {
          this.set(result)
          return Promise.resolve(result)
        })
    }

    @Action save (): Promise<boolean | UserEntity> {
      const method = typeof this.user.id === 'undefined' ? 'POST' : 'PUT'
      const url = this.baseUrl + (method === 'PUT' ? '/' + this.user.id : '')
      const request = requestService.createRequest(url, method)
        .setBody(this.user)
        .addHeader('Content-Type', 'application/json')

      return requestService.execute(request)
        .then((user: UserEntity) => {
          this.set(user)
          return Promise.resolve(user)
        })
        .catch((error) => {
          console.error(error)
          return Promise.resolve(false)
        })
    }

    @Action({ rawError: true }) getLoggedIn (): Promise<UserEntity | undefined> {
      const request = requestService.createRequest(this.baseUrl + '/loggedIn')
      return requestService.execute(request)
        .then((result) => {
          this.set(result)
          return Promise.resolve(result)
        })
    }

    @Action({ rawError: true }) setPassword (newPassword: string) {
      const request = requestService.createRequest(this.baseUrl + '/' + this.user.id, 'PUT')
        .setBody({
          plainPassword: newPassword
        })
        .addHeader('Content-Type', 'application/json')
      return requestService.execute(request)
    }

    @Mutation set (entity: UserEntity): void {
      this.user = entity
    }
}

export default getModule(UserModule)

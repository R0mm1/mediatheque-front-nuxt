import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import type { UserEntity } from '~/assets/ts/entity/UserEntity'
import RequestService from '~/assets/ts/service/RequestService'

interface UserState {
  user: UserEntity
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {} as UserEntity
  }),

  getters: {
    currentUser: (state) => state.user
  },

  actions: {
    async get(id: number): Promise<UserEntity | undefined> {
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(`/users/${id}`)

      const result = await requestService.execute<UserEntity>(request)
      this.set(result)
      return result
    },

    async save(): Promise<boolean | UserEntity> {
      const method = typeof this.user.id === 'undefined' ? 'POST' : 'PUT'
      const url = `/users${method === 'PUT' ? '/' + this.user.id : ''}`
      const requestService = container.resolve(RequestService)

      const request = requestService.createRequest(url, method)
        .setBody(this.user)
        .addHeader('Content-Type', 'application/json')

      try {
        const user = await requestService.execute<UserEntity>(request)
        this.set(user)
        return user
      } catch (error) {
        console.error(error)
        return false
      }
    },

    async getLoggedIn(): Promise<UserEntity | undefined> {
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest('/users/loggedIn')

      const result = await requestService.execute<UserEntity>(request)
      this.set(result)
      return result
    },

    async setPassword(newPassword: string) {
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(`/users/${this.user.id}`, 'PUT')
        .setBody({
          plainPassword: newPassword
        })
        .addHeader('Content-Type', 'application/json')

      return requestService.execute(request)
    },

    set(entity: UserEntity): void {
      this.user = entity
    }
  }
})

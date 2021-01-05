import Vue from 'vue'
import { container } from 'tsyringe'
import RequestService from '../../../ts/service/RequestService'
import UserCommon from './common'

const requestService = container.resolve(RequestService)

const LoggedInModule = {
  namespaced: true,
  state () {
    return {
      ...UserCommon.state()
    }
  },
  getters: {
    ...UserCommon.getters
  },
  mutations: {
    ...UserCommon.mutations
  },
  actions: {
    load (context) {
      const request = requestService.createRequest('/users/loggedIn')
      return requestService.execute(request)
        .then((user) => {
          Vue.set(context.state, 'user', user)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    ...UserCommon.actions
  }
}

export default LoggedInModule

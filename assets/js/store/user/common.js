import { container } from 'tsyringe'
import RequestService from '../../../ts/service/RequestService'

const requestService = container.resolve(RequestService)

const UserCommon = {
  state () {
    return {
      user: null
    }
  },
  getters: {
    getProperty: state => (propertyName) => {
      if (state.user !== null && state.user[propertyName]) {
        return state.user[propertyName]
      }
      return ''
    }
  },
  mutations: {
    setUser: state => (user) => {
      state.user = user
    }
  },
  actions: {
    setPassword (context, newPassword) {
      if (!context.state.user.id) { throw new Error('User not loaded') }

      const request = requestService.createRequest('/users/' + context.state.user.id, 'PUT')
        .addHeader('Content-Type', 'application/json')
        .setBody({
          plainPassword: newPassword
        })
      return requestService.execute(request)
    }
  }
}

export default UserCommon

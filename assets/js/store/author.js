import { container } from 'tsyringe'
import RequestService from '../../ts/service/RequestService'

const requestService = container.resolve(RequestService)

const AuthorModule = {
  namespaced: true,
  state () {
    return {
      author: {},
      flags: {
        isModified: false
      },
      defaultData: {}
    }
  },
  mutations: {
    init (state) {
      state.author = state.defaultData
    },
    setAuthor (state, author) {
      state.author = author
    },
    setProperty (state, { propertyName, value }) {
      state.author[propertyName] = value
      state.flags.isModified = true
    }
  },
  getters: {
    getProperty: state => (propertyName) => {
      if (state.author !== null && state.author[propertyName]) {
        return state.author[propertyName]
      }
      return ''
    },
    getFlag: state => (flagName) => {
      if (state.flags[flagName]) {
        return state.flags[flagName]
      }
      return null
    }
  },
  actions: {
    load (context, authorId) {
      const request = requestService.createRequest('authors/' + authorId)

      return requestService.execute(request)
        .then((data) => {
          context.commit('setAuthor', data)
          return Promise.resolve()
        })
    },
    save (context) {
      const authorId = context.getters.getProperty('id')

      const method = (typeof authorId === 'number') ? 'PUT' : 'POST'
      const url = '/authors' + (method === 'PUT' ? '/' + authorId : '')

      const request = requestService.createRequest(url, method)
        .setBody(context.state.author)
        .addHeader('Content-Type', 'application/json')

      return requestService.execute(request)
    }
  }
}

export default AuthorModule

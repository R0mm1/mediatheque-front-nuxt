import { container } from 'tsyringe'
import RequestService from '../../ts/service/RequestService'

const requestService = container.resolve(RequestService)

const BookNotationModule = {
  namespaced: true,
  state () {
    return {
      endpoint: '/book_notations',
      item: null
    }
  },
  getters: {
    get (state) {
      return state.item
    },
    getProperty: state => (property) => {
      if (state.item === null ||
                typeof state.item === 'undefined' ||
                typeof state.item[property] === 'undefined') {
        return null
      }
      return state.item[property]
    }
  },
  mutations: {
    set (state, bookNotation) {
      state.item = bookNotation
    },
    setProperty (state, { property, value }) {
      if (typeof state.item[property] !== 'undefined') {
        state.item[property] = value
      }
    },
    create (state, { bookId, note }) {
      state.item = {
        book: '/books/' + bookId,
        note
      }
    }
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    load ({ state, commit }, { params, method }) {
      const request = requestService.createRequest(state.endpoint, method)
      return requestService.execute(request)
        .then((bookNotation) => {
          commit('set', bookNotation['hydra:member'][0])
        })
    },
    findById ({ dispatch }, id) {
      return dispatch('load', { params: { id }, method: 'GET' })
    },
    findByBook ({ dispatch }, bookId) {
      return dispatch('load', { params: { 'book.id': bookId }, method: 'GET' })
    },
    save ({ state, commit }) {
      const isCreation = typeof state.item.id === 'undefined'
      const method = isCreation ? 'POST' : 'PUT'
      const url = state.endpoint + (isCreation ? '' : '/' + state.item.id)
      const request = requestService.createRequest(url, method)
        .addHeader('Content-Type', 'application/json')
        .setBody(state.item)

      return requestService.execute(request)
        .then((response) => {
          commit('set', response)
        })
    }
  }
}

export default BookNotationModule

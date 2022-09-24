import { autoInjectable, singleton, container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import Person from '~/assets/ts/models/Person'
import { Author, AuthorCollection, AuthorItem } from '~/assets/ts/models/Author'

@autoInjectable()
@singleton()
export default class AuthorService {
  /**
   * Retrieve an author matching a Person. If there is no author matching the person, it is created.
   */
  getAuthorFromPerson (person: Person): Promise<AuthorItem> {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('/authors?person=' + person.id, 'GET')
    return requestService.execute<AuthorCollection>(request)
      .then((authors) => {
        const author = authors['hydra:member'].pop()
        if (typeof author === 'undefined') {
          const createAuthorRequest = requestService.createRequest('/authors', 'POST')
          createAuthorRequest.setBody({
            person: 'people/' + person.id
          })
          return requestService.execute<AuthorItem>(createAuthorRequest)
        }
        return Promise.resolve(author)
      })
  }

  isAuthor (entity: Author|Person):entity is Author {
    return 'person' in entity
  }
}

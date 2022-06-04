import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import store from '~/assets/ts/store/store'
import FlagService from '~/assets/ts/service/FlagService'
import EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import HistoryService from '~/assets/ts/service/HistoryService'
import RequestService from '~/assets/ts/service/RequestService'
import { Editor, EditorItem } from '~/assets/ts/models/Editor'

@Module({ dynamic: true, name: 'editor', store, namespaced: true })
class EditorModule extends VuexModule implements EntityModuleInterface<Editor> {
  protected baseUrl = '/editors'

  editor: Editor = {}

  flagService = new FlagService<EntityModuleFlagInterface>({
    isModified: false,
    readyToSave: true
  })

  proxy = new EntityProxyService(this.flagService, new HistoryService())

  @Mutation new () {
    this.editor = new Proxy<Editor>({}, this.proxy)
    this.flagService.reset()
  }

  @Mutation set (entity: Editor): void {
    this.editor = new Proxy<Editor>(entity, this.proxy)
  }

  @Mutation setName (name: string) {
    this.editor.name = name
  }

  @Action({ rawError: true }) get (id: number): Promise<EditorItem | undefined> {
    const request = container.resolve(RequestService).createRequest(this.baseUrl + '/' + id)
    const requestService = container.resolve(RequestService)
    return requestService.execute<EditorItem>(request)
      .then((result) => {
        this.set(result)
        return Promise.resolve(this.editor)
      })
  }

  @Action save (): Promise<EditorItem | boolean> {
    const method = typeof this.editor.id === 'undefined' ? 'POST' : 'PUT'
    const url = this.baseUrl + (method === 'PUT' ? '/' + this.editor.id : '')
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(url, method)
      .setBody(this.editor)
      .addHeader('Content-Type', 'application/json')

    return requestService.execute<EditorItem>(request)
      .then((editor: EditorItem) => {
        this.set(editor)
        return Promise.resolve(editor)
      })
      .catch((error) => {
        console.error(error)
        return Promise.resolve(false)
      })
  }
}

export default getModule(EditorModule)

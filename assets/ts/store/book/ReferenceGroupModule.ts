import { Action, Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import { Vue } from 'vue-property-decorator'
import store from '~/assets/ts/store/store'
import ReferenceGroupService from '~/assets/ts/service/book/ReferenceGroupService'
import { ReferenceGroup, ReferenceGroupItem } from '~/assets/ts/models/book/ReferenceGroup'

@Module({
  dynamic: true,
  name: 'bookReferenceGroup',
  store,
  namespaced: true
})
class ReferenceGroupModule extends VuexModule {
  referenceGroup: Partial<ReferenceGroup> = {}

  @Mutation setComment (comment: string) {
    Vue.set(this.referenceGroup, 'comment', comment)
  }

  @Mutation init () {
    this.referenceGroup = {}
  }

  @Mutation set (referenceGroup: Partial<ReferenceGroup>) {
    this.referenceGroup = referenceGroup
  }

  @Action({ rawError: true }) get (id: number): Promise<ReferenceGroupItem> {
    return container.resolve(ReferenceGroupService).get(id).then((referenceGroup) => {
      this.set(referenceGroup)
      return Promise.resolve(referenceGroup)
    })
  }

  @Action({ rawError: true }) save () {
    const group = JSON.parse(JSON.stringify(this.referenceGroup))
    return container.resolve(ReferenceGroupService).save(group)
  }
}

export default getModule(ReferenceGroupModule)

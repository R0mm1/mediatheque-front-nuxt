import { Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators'
import store from '~/assets/ts/store/store'
import { ReferenceGroup } from '~/assets/ts/models/book/ReferenceGroup'

@Module({
  dynamic: true,
  name: 'groupList',
  store,
  namespaced: true
})
class GroupListModule extends VuexModule {
  groupToDelete: ReferenceGroup | null = null

  @Mutation
  setGroupToDelete (group: ReferenceGroup | null) {
    this.groupToDelete = group
  }
}

export default getModule(GroupListModule)

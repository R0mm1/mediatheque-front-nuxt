import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import FlagService from '~/assets/ts/service/FlagService'
import { ReferenceGroupBook } from '~/assets/ts/models/book/referenceGroup/Book'
import store from '~/assets/ts/store/store'
import ReferenceGroupBookService from '~/assets/ts/service/book/referenceGroup/ReferenceGroupBookService'
import ReferenceGroupService from '~/assets/ts/service/book/ReferenceGroupService'

@Module({
  dynamic: true,
  name: 'bookGroupMembership',
  store,
  namespaced: true
})
export class BookGroupMembershipModule extends VuexModule {
  flagService: FlagService<{ isModified: boolean }> = new FlagService({
    isModified: false
  })

  newGroupMemberships: Partial<ReferenceGroupBook>[] = []
  resortedGroupsIds: Record<number, [string, number][]> = {}

  @Mutation reset () {
    this.newGroupMemberships = []
    this.resortedGroupsIds = []
    this.flagService.flags.isModified = false
  }

  @Mutation addResortedGroup (
    {
      referenceGroupId,
      referenceGroupBookIds
    }: { referenceGroupId: number, referenceGroupBookIds: [string, number][] }) {
    if (!this.resortedGroupsIds[referenceGroupId]) {
      this.resortedGroupsIds[referenceGroupId] = referenceGroupBookIds
      this.flagService.flags.isModified = true
    }
  }

  @Mutation addNewGroupMembership (referenceGroupBook: Partial<ReferenceGroupBook>) {
    this.newGroupMemberships.push(referenceGroupBook)
    this.flagService.flags.isModified = true
  }

  @Action({ rawError: true }) save () {
    const referenceGroupBookService = container.resolve(ReferenceGroupBookService)
    const referenceGroupService = container.resolve(ReferenceGroupService)
    const newGroupMembershipSaveRequests = this.newGroupMemberships.map((referenceGroupBook) => {
      if (!referenceGroupBook.referenceGroup) {
        throw new Error('ReferenceGroup must be defined')
      }

      // If the referenceGroup linked is not a string (IRI) and does not have an id, we create it.
      const referenceGroupPromise =
        typeof referenceGroupBook.referenceGroup !== 'string' && !referenceGroupBook.referenceGroup.id
          ? referenceGroupService.save(referenceGroupBook.referenceGroup)
            .then((referenceGroup) => {
              referenceGroupBook.referenceGroup = referenceGroup
              return Promise.resolve(referenceGroupBook)
            })
          : Promise.resolve(referenceGroupBook)

      return referenceGroupPromise.then((referenceGroupBook) => {
        delete referenceGroupBook.id
        return referenceGroupBookService.save(referenceGroupBook)
      })
    })
    const resortedGroupSaveRequests = Object.entries(this.resortedGroupsIds).map((referenceGroupBookIds) => {
      return referenceGroupService.sort(
        parseInt(referenceGroupBookIds[0]),
        referenceGroupBookIds[1]
          .sort((a, b) => a[1] - b[1])
          .map(el => el[0])
      )
    })

    return Promise.all([
      ...newGroupMembershipSaveRequests,
      ...resortedGroupSaveRequests
    ])
  }
}

export default getModule(BookGroupMembershipModule)

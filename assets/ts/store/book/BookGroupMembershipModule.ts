import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import FlagService from '~/assets/ts/service/FlagService'
import { ReferenceGroupBook, ReferenceGroupBookItem } from '~/assets/ts/models/book/referenceGroup/Book'
import store from '~/assets/ts/store/store'
import ReferenceGroupBookService from '~/assets/ts/service/book/referenceGroup/ReferenceGroupBookService'
import ReferenceGroupService from '~/assets/ts/service/book/ReferenceGroupService'
import { BookItem } from '~/assets/ts/models/Book'

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

  @Mutation updateBook (book: Partial<BookItem>) {
    this.newGroupMemberships.forEach((newGroupMembership) => {
      newGroupMembership.book = book
    })
  }

  @Action({ rawError: true }) save () {
    const referenceGroupBookService = container.resolve(ReferenceGroupBookService)
    const referenceGroupService = container.resolve(ReferenceGroupService)
    const newGroupMembershipsPerGroup: Record<string, ReferenceGroupBookItem> = {}

    const newGroupMembershipSaveRequests = Promise.all(
      this.newGroupMemberships.map((referenceGroupBook) => {
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

        return referenceGroupPromise
          .then((referenceGroupBook) => {
            delete referenceGroupBook.id
            return referenceGroupBookService.save(referenceGroupBook)
          })
          .then((referenceGroupBook: ReferenceGroupBookItem) => {
            const referenceGroupId = typeof referenceGroupBook.referenceGroup === 'string' ? referenceGroupBook.referenceGroup : referenceGroupBook.referenceGroup.id?.toString()
            if (!referenceGroupId) {
              throw new Error('Could not determine reference group id')
            }
            newGroupMembershipsPerGroup[referenceGroupId] = referenceGroupBook

            return Promise.resolve(referenceGroupBook)
          })
      })
    )

    return newGroupMembershipSaveRequests.then(() => Promise.all(
      Object.entries(this.resortedGroupsIds).map((referenceGroupBookIds) => {
        return referenceGroupService.sort(
          parseInt(referenceGroupBookIds[0]),
          referenceGroupBookIds[1]
            .sort((a, b) => a[1] - b[1])
            .map((el) => {
              if (!el[0]) {
                if (!newGroupMembershipsPerGroup[referenceGroupBookIds[0]]) {
                  throw new Error('A reference group being sorted doesn\'t exist and hasn\'t been created')
                }
                el[0] = newGroupMembershipsPerGroup[referenceGroupBookIds[0]].id
              }
              return el[0]
            })
        )
      })
    ))
  }
}

export default getModule(BookGroupMembershipModule)

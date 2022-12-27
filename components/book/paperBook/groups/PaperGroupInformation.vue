<template>
  <GroupInformation :book-module="bookPaperModule" :edit-mode-on="editModeOn">
    <template #specific-fields>
      <MedSelect v-model="ownerId" :med-select-descriptor="formSelectOwnerDescriptor" />
    </template>
  </GroupInformation>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { container } from 'tsyringe'
import GroupInformation from '@/components/book/groups/mainTab/GroupInformation.vue'
import MedSelect from '@/components/form/elements/MedSelect.vue'
import bookPaperModule from '@/assets/ts/store/book/BookPaperModule'
import { UserEntity } from '~/assets/ts/entity/UserEntity'
import RequestService from '~/assets/ts/service/RequestService'
import MedSelectDescriptor, { SelectValue } from '~/assets/ts/form/MedSelectDescriptor'

@Component({
  components: {
    MedSelect,
    GroupInformation
  }
})
export default class PaperGroupInformation extends Vue {
  @Prop({ type: Boolean, required: true }) editModeOn!:boolean

  bookPaperModule = bookPaperModule

  users: SelectValue[] = []

  get ownerId () {
    const owner = bookPaperModule.book.owner

    const ownerId = (() => {
      if (typeof owner === 'string') {
        return owner
      } else if (typeof owner === 'object' && owner !== null) {
        return owner['@id']
      }
      return undefined
    })()

    if (ownerId) {
      return this.users.find(user => user.value === ownerId)
    }

    return undefined
  }

  set ownerId (ownerId: SelectValue | undefined) {
    if (typeof ownerId !== 'undefined') {
      bookPaperModule.setOwner(ownerId.value)
      return
    }
    bookPaperModule.setOwner(ownerId)
  }

  get formSelectOwnerDescriptor () {
    const selectDescriptor = new MedSelectDescriptor('owner')
    selectDescriptor.label = 'Propriétaire'
    selectDescriptor.options = this.getUserListPromise()
    selectDescriptor.editModeOn = this.editModeOn
    return selectDescriptor
  }

  getUserListPromise () {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('/users')

    if (this.users.length > 0) {
      // Switching between view mode and edition mode will recreate the medSelectDescriptor (because of the reactivity on
      // this.editModeOn) and call this method again, and we want to avoid over-calling the server
      return Promise.resolve(this.users)
    }

    return requestService.execute<any>(request)
      .then((response) => {
        response['hydra:member'].forEach((user: UserEntity) => {
          if (typeof user['@id'] === 'undefined') {
            return
          }

          this.users.push({
            label: (user.firstname ?? '') + ' ' + (user.lastname ?? ''),
            key: user['@id'],
            value: user['@id'],
            default: user['@id'] === this.ownerId?.value
          })
        })
        return Promise.resolve(this.users)
      })
  }
}
</script>

<style scoped>

</style>

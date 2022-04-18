<template>
  <GroupInformation :book-module="bookPaperModule" :edit-mode-on="editModeOn">
    <template #specific-fields>
      <MedInputSelect v-model="ownerId" :select-descriptor="formSelectOwnerDescriptor" />
    </template>
  </GroupInformation>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { container } from 'tsyringe'
import GroupInformation from '@/components/book/groups/mainTab/GroupInformation.vue'
import MedInputSelect from '@/components/form/elements/MedInputSelect.vue'
import SelectDescriptor from '@/assets/ts/form/SelectDescriptor'
import bookPaperModule from '@/assets/ts/store/book/BookPaperModule'
import { UserEntity } from '~/assets/ts/entity/UserEntity'
import RequestService from '~/assets/ts/service/RequestService'

@Component({
  components: {
    MedInputSelect,
    GroupInformation
  }
})
export default class PaperGroupInformation extends Vue {
  @Prop({ type: Boolean, required: true }) editModeOn!:boolean

  bookPaperModule = bookPaperModule

  get ownerId () {
    const owner = bookPaperModule.book.owner

    if (typeof owner === 'string') {
      return owner
    } else if (typeof owner === 'object' && owner !== null) {
      return owner['@id']
    }
    return undefined
  }

  set ownerId (ownerId: string|undefined) {
    bookPaperModule.setOwner(ownerId)
  }

  get formSelectOwnerDescriptor () {
    const selectDescriptor = new SelectDescriptor('owner')
    selectDescriptor.label = 'Propriétaire'
    selectDescriptor.optionsSource = this.getUserListPromise()
    selectDescriptor.editModeOn = this.editModeOn
    return selectDescriptor
  }

  getUserListPromise () {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('/users')
    return requestService.execute<any>(request)
      .then((response) => {
        const users: { [index: string]: string } = {}
        response['hydra:member'].forEach((user: UserEntity) => {
          if (typeof user['@id'] === 'undefined') {
            return
          }
          users[user['@id']] = (user.firstname ?? '') + ' ' + (user.lastname ?? '')
        })
        return Promise.resolve(users)
      })
  }
}
</script>

<style scoped>

</style>

<template>
  <GroupInformation :book-module="bookPaperModule">
    <template #specific-fields>
      <MedInputSelect v-model="ownerId" :select-descriptor="formSelectOwnerDescriptor" />
    </template>
  </GroupInformation>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GroupInformation from '@/components/book/groups/mainTab/GroupInformation.vue'
import MedInputSelect from '@/components/form/elements/MedInputSelect.vue'
import SelectDescriptor from '@/assets/ts/form/SelectDescriptor'
import bookPaperModule from '@/assets/ts/store/book/BookPaperModule'
import { container } from 'tsyringe'
import { UserEntity } from '~/assets/ts/entity/UserEntity'
import RequestService from '~/assets/ts/service/RequestService'

const requestService = container.resolve(RequestService)

@Component({
  components: {
    MedInputSelect,
    GroupInformation
  }
})
export default class PaperGroupInformation extends Vue {
  bookPaperModule = bookPaperModule;

  get ownerId () {
    const owner = bookPaperModule.book.owner

    if (typeof owner === 'string') {
      return owner.split('/').pop()?.split('=').pop()
    } else if (typeof owner === 'object' && owner !== null) {
      return owner.id
    }
    return undefined
  };

  set ownerId (ownerId: (string|number|undefined)) {
    bookPaperModule.setOwner(
      typeof ownerId === 'string' ? parseInt(ownerId) : ownerId
    )
  }

  get formSelectOwnerDescriptor () {
    const selectDescriptor = new SelectDescriptor('owner')
    selectDescriptor.label = 'Propriétaire'
    selectDescriptor.optionsSource = this.getUserListPromise()
    return selectDescriptor
  }

  getUserListPromise () {
    const request = requestService.createRequest('/users')
    return requestService.execute(request)
      .then((response) => {
        const users: { [index: number]: string } = {}
        response['hydra:member'].forEach((user: UserEntity) => {
          if (typeof user.id === 'undefined') {
            return
          }
          users[user.id] = user.username ?? ''
        })
        return Promise.resolve(users)
      })
  }
}
</script>

<style scoped>

</style>

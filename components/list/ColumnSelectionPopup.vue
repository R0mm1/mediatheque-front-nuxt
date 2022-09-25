<template>
  <Popup :is-displayed="true">
    <template #popup_header>
      Sélection des colonnes
    </template>
    <template #popup_body>
      <MedInputCheckbox
        v-for="checkboxDescriptor in checkboxDescriptors"
        :key="checkboxDescriptor.name"
        v-model="columns[checkboxDescriptor.name].isDisplayed"
        :checkbox-descriptor="checkboxDescriptor"
        @change.native="columnChanged(checkboxDescriptor.name, $event)"
      />
    </template>
    <template #popup_footer>
      <MedInputButton :button-descriptor="selectButtonDescriptor" @click.native="validateSelection" />
    </template>
  </Popup>
</template>

<script lang="ts">

import { Component, Emit, Vue } from 'vue-property-decorator'
import { container } from 'tsyringe'
import Popup from '@/components/widgets/Popup.vue'
import MedInputButton from '@/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from 'assets/ts/form/ButtonDescriptor'
import listModule from 'assets/ts/store/ListModule'
import MedInputCheckbox from '~/components/form/elements/MedInputCheckbox.vue'
import CheckboxDescriptor from '~/assets/ts/form/CheckboxDescriptor'
import { UserColumnConfig } from '~/assets/ts/list/UserConfig'
import ListService from '~/assets/ts/service/ListService'

@Component({
  components: {
    MedInputCheckbox,
    Popup,
    MedInputButton
  }
})
export default class ColumnSelectionPopup extends Vue {
  listService = container.resolve(ListService)

  selectButtonDescriptor = new ButtonDescriptor('select', 'Sélectionner')
  cancelButtonDescriptor = new ButtonDescriptor('cancel', 'Annuler')

  backup: UserColumnConfig[] = []

  get checkboxDescriptors (): CheckboxDescriptor[] {
    return Object.values(listModule.columns).map((column) => {
      return new CheckboxDescriptor(column.uid, column.label)
    })
  }

  get columns (): {[index: string]: UserColumnConfig} {
    return Object.fromEntries(Object.values(listModule.columns).map((column) => {
      return [
        column.uid,
        {
          uid: column.uid,
          isDisplayed: this.listService.isColumnDisplayed(column)
        }
      ]
    }))
  }

  columnChanged (column: string, e: Event) {
    if (typeof listModule.userConfig?.value === 'undefined') {
      return
    }

    let userColumnConfig = listModule.userConfig.value.columns.find((ucc) => {
      return ucc.uid === column
    })

    if (typeof userColumnConfig === 'undefined') {
      userColumnConfig = {
        uid: column,
        isDisplayed: (e.target as HTMLInputElement).checked
      }
      listModule.userConfig.value.columns.push(userColumnConfig)
    } else {
      Vue.set(userColumnConfig, 'isDisplayed', (e.target as HTMLInputElement).checked)
    }
  }

  @Emit('popup-wanna-close')
  validateSelection () {
    listModule.saveUserConfig()
  }

  created () {
    if (typeof listModule.userConfig?.value?.columns === 'undefined') {
      throw new TypeError('User configuration should be loaded')
    }
    this.backup = listModule.userConfig.value.columns
  }
}
</script>

<style scoped>

</style>

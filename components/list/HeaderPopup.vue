<template>
  <transition name="headerPopup">
    <div v-if="isDisplayed" class="listHeaderPopup">
      <div v-if="column.isSearchable" class="headerPopupSearch">
        <MedInputTextWithButton
          v-model="searchString"
          :text-with-button-descriptor="textWithButtonDescriptor"
          @click="search"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import Column from '~/assets/ts/list/Column'
import MedInputText from '~/components/form/elements/MedInputText.vue'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputTextWithButton from '~/components/form/elements/MedInputTextWithButton.vue'
import TextWithButtonDescriptor from '~/assets/ts/form/TextWithButtonDescriptor'
import listModule from '~/assets/ts/store/ListModule'

@Component({
  components: { MedInputTextWithButton, MedInputButton, MedInputText }
})
export default class HeaderPopup extends Vue {
  @Prop(Object) column!: Column
  @Prop({ type: Boolean, default: false }) isDisplayed!: boolean

  textWithButtonDescriptor!: TextWithButtonDescriptor

  searchString: string = ''

  @Emit('list-header-search')
  search () {
    this.column.searchString = this.searchString
    listModule.setColumn(this.column)
    return this.column
  }

  created () {
    const textDescriptor = new TextDescriptor('search')
      .setNoDefaultStyle(true)
      .setPlaceholder('Rechercher...')
      .setName('search_' + this.column.searchParameterName)

    const buttonDescriptor = new ButtonDescriptor('triggerSearch')
      .setNoDefaultStyle(true)
      .setFaIcon('fas fa-search')
      .setName('submitSearch_' + this.column.searchParameterName)

    this.textWithButtonDescriptor = new TextWithButtonDescriptor(textDescriptor).setButtonDescriptor(buttonDescriptor)
    this.searchString = this.column.searchString + ''
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/colors";

.headerPopup-enter, .headerPopup-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.headerPopup-enter-active, .headerPopup-leave-active {
  transition: all .3s;
}

.listHeaderPopup {
  position: absolute;
  width: 100%;
  min-width: 250px;
  margin-left: -5px;
  z-index: 1;
}
</style>

<style lang="scss">
.listHeaderPopup .headerPopupSearch {
  display: flex;

  .med-input-text-with-button {
    border-radius: unset;
    flex: 1;
  }
}
</style>

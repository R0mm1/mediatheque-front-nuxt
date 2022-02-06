<template>
  <div id="leftActionBar">
    <div id="labColorBar" />
    <div id="labElements">
      <div
        v-for="(labElement) in labElements"
        :key="labElement.formElementDescriptor.name"
        class="leftActionBarElement"
        :class="getClass(labElement)"
      >
        <div class="leftActionBarElementIcon" :class="labElement.formElementDescriptor.faIcon" />

        <div class="leftActionBarElementText">
          <MedInputButton
            v-if="isButton(labElement)"
            :button-descriptor="labElement.formElementDescriptor"
            @click.native="eventOccurred(labElement)"
          />

          <MedInputSelect
            v-if="isSelect(labElement)"
            :ref="labElement.formElementDescriptor.name"
            :select-descriptor="labElement.formElementDescriptor"
            @change.native="eventOccurred(labElement, $event.target.value)"
          />

          <div v-if="isSeparator(labElement)" class="leftActionBarSeparatorText">
            {{ labElement.formElementDescriptor.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import LeftActionBarProperties from '../../assets/ts/list/LeftActionBarProperties'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import listModule from '~/assets/ts/store/ListModule'
import LeftActionBarFormSelectDescriptor from '~/assets/ts/list/LeftActionBarFormSelectDescriptor'
import Filter from '~/assets/ts/list/Filter'
import MedInputSelect from '~/components/form/elements/MedInputSelect.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'

@Component({
  components: { MedInputSelect, MedInputButton }
})
export default class LeftActionBar extends Vue {
  @Prop(Object) leftActionBarProperties!: LeftActionBarProperties

  get labElements () {
    const elements = []

    if (this.leftActionBarProperties.hasAddButton) {
      elements.push(new LeftActionBarElement(
        'element',
        () => {
          this.$parent.$emit('list-action-add')
          return null
        },
        new ButtonDescriptor('add', 'Ajouter').setFaIcon('fas fa-plus').setNoDefaultStyle(true)
      ))
    }

    elements.push(...this.leftActionBarProperties.customElements)
    return elements
  }

  isButton (element: LeftActionBarElement) {
    return element.formElementDescriptor.descriptorType === 'ButtonDescriptor'
  }

  isSelect (element: LeftActionBarElement) {
    return element.formElementDescriptor.descriptorType === 'LeftActionBarFormSelectDescriptor'
  }

  isSeparator (element: LeftActionBarElement) {
    return element.formElementDescriptor.descriptorType === 'LeftActionBarSeparatorDescriptor'
  }

  getClass (element: LeftActionBarElement) {
    const descriptorBasedClass = element.formElementDescriptor.descriptorType.split('Descriptor').shift()
    if (typeof descriptorBasedClass === 'string') {
      return 'labe-' + descriptorBasedClass[0].toLowerCase() + descriptorBasedClass.substr(1)
    }
    return 'labe-unknown'
  }

  // This boolean will be used to prevent the watcher to update the forms elements after the filters have been updated
  // if the modification is coming from those same forms elements
  preventAutoFilterUpdate: boolean = false

  get customFilters () {
    return listModule._customFilters
  }

  @Watch('customFilters')
  customFiltersChanged () {
    if (!this.preventAutoFilterUpdate) {
      this.handleCustomFilters()
    }
    this.preventAutoFilterUpdate = false
  }

  eventOccurred (element: LeftActionBarElement, value?: any) {
    if (element.type === 'filter') {
      switch (element.formElementDescriptor.descriptorType) {
        case LeftActionBarFormSelectDescriptor.descriptorType:
          this.preventAutoFilterUpdate = true
          listModule.setCustomFilter(new Filter(element.formElementDescriptor.name, value))
          break
        case ButtonDescriptor.descriptorType:
          this.preventAutoFilterUpdate = true
          listModule.setCustomFilter(new Filter(element.formElementDescriptor.name, element.callback()))
          break
      }
    } else {
      element.callback()
    }
  }

  handleCustomFilters () {
    this.customFilters.forEach((filter: Filter) => {
      const componentInstances = this.$refs[filter.property] as (MedInputSelect)[]

      if (typeof componentInstances?.[0]?.setValue === 'function') {
        componentInstances[0].setValue(filter.value ?? '')
      }
    })
  }

  mounted () {
    this.handleCustomFilters()
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/breakpoints";

@include phone-portrait {
  #leftActionBar {
    display: none;
  }
}

#labColorBar {
  height: 100%;
  width: 30px;
  position: fixed;
  background-color: #e4dccc;
}

#labElements {
  position: relative;
  overflow: hidden;
  height: 100%;
}
</style>

<style lang="scss">
@import "assets/scss/colors";

.leftActionBarElement {
  line-height: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 1;
  display: flex;

  .leftActionBarElementIcon {
    width: 30px;
    min-width: 30px;
    text-align: center;
    display: inline-block;
    transition: background-color .3s, color .3s;
    font-size: 1rem;
    height: 30px;
    line-height: 30px;
  }

  .leftActionBarElementText {
    transition: background-color .3s;
    width: 100%;
    padding-left: 3px;

    .formulate-input, .formulate-input-wrapper, .formulate-input-element {
      height: 100%;

      button {
        border: 0;
        width: 100%;
        height: 100%;
        text-align: left;
        display: block;
        background-color: transparent;

        i {
          display: none;
        }
      }

      .formulate-input-element--select {
        position: relative;

        &::before {
          content: "";
          width: 0;
          height: 0;
          border-color: black transparent transparent;
          border-style: solid;
          border-width: .3em .3em 0;
          right: 1em;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 100%;
          border: none;
          height: 100%;
          background: top;
        }
      }

    }
  }

  &:not(.labe-leftActionBarSeparator):hover .leftActionBarElementIcon {
    background-color: #bbaf99;
  }

  &:not(.labe-leftActionBarSeparator):hover .leftActionBarElementText {
    background-color: #e4dccc;
  }

  &.labe-leftActionBarSeparator {
    cursor: default;
    overflow: hidden;
    color: $textDisabled;

    .leftActionBarSeparatorIcon {
      background-color: #eeeae1;
    }

    .leftActionBarSeparatorText {
      flex: 1;
      line-height: 30px;
      padding-left: 5px;
    }
  }
}
</style>

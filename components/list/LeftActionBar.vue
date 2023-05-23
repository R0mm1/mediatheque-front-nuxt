<template>
  <div id="leftActionBar">
    <div id="labColorBar" />
    <div id="labElements">
      <div
        v-for="(labElement) in labElements"
        :key="labElement.formElementDescriptor.name"
        class="leftActionBarElement"
        :class="getClass(labElement)"
        data-cy="leftActionBarElement"
      >
        <template v-if="isButton(labElement)">
          <div
            class="leftActionBarElementIcon"
            :class="labElement.formElementDescriptor.faIcon"
            @click="customFilterChangeHandler(labElement)"
          />
          <div class="leftActionBarElementText">
            <MedInputButton
              :button-descriptor="labElement.formElementDescriptor"
              @click.native="customFilterChangeHandler(labElement)"
            />
          </div>
        </template>

        <template v-if="isSelect(labElement)">
          <label
            class="leftActionBarElementIcon"
            :class="labElement.formElementDescriptor.faIcon"
            :for="labElement.formElementDescriptor.name"
          />
          <div class="leftActionBarElementText">
            <MedSelect
              v-model="customFiltersValues[labElement.formElementDescriptor.name]"
              :med-select-descriptor="labElement.formElementDescriptor"
            />
          </div>
        </template>

        <NuxtLink
          v-if="isLink(labElement)"
          :to="labElement.formElementDescriptor.to"
          :aria-label="labElement.formElementDescriptor.label"
        >
          <div
            class="leftActionBarElementIcon"
            :class="labElement.formElementDescriptor.faIcon"
          />
          <div class="leftActionBarElementText">
            {{ labElement.formElementDescriptor.label }}
          </div>
        </NuxtLink>

        <template v-if="isSeparator(labElement)">
          <div
            class="leftActionBarElementIcon"
            :class="labElement.formElementDescriptor.faIcon"
          />
          <div class="leftActionBarSeparatorText">
            {{ labElement.formElementDescriptor.label }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueRouter from 'vue-router'
import { container } from 'tsyringe'
import LeftActionBarProperties from '../../assets/ts/list/LeftActionBarProperties'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import LeftActionBarLinkDescriptor from '~/assets/ts/list/LeftActionBarLinkDescriptor'
import ListService from '~/assets/ts/service/ListService'
import MedSelect from '~/components/form/elements/MedSelect.vue'
import MedSelectDescriptor, { SelectValue } from '~/assets/ts/form/MedSelectDescriptor'

const listService = container.resolve(ListService)

const customFilterChangeHandler = function (router: VueRouter, element: LeftActionBarElement, value?: any) {
  if (element.type === 'filter') {
    let filterValue = value
    switch (element.formElementDescriptor.descriptorType) {
      case ButtonDescriptor.descriptorType:
        filterValue = element.callback()
        break
    }

    if (typeof filterValue !== 'undefined') {
      listService.setQueryFilter('lcf-', element.formElementDescriptor.name, value, router)
    }
  } else {
    element.callback()
  }
}

@Component({
  components: {
    MedSelect,
    MedInputButton
  }
})
export default class LeftActionBar extends Vue {
  @Prop(Object) leftActionBarProperties!: LeftActionBarProperties

  get labElements () {
    const elements = []

    if (this.leftActionBarProperties.hasAddButton) {
      elements.push(new LeftActionBarElement(
        'element',
        () => {
          this.$parent?.$emit('list-action-add')
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
    return element.formElementDescriptor.descriptorType === 'MedSelectDescriptor'
  }

  isSeparator (element: LeftActionBarElement) {
    return element.formElementDescriptor.descriptorType === 'LeftActionBarSeparatorDescriptor'
  }

  isLink (element: LeftActionBarElement) {
    return element.formElementDescriptor.descriptorType === LeftActionBarLinkDescriptor.descriptorType
  }

  getClass (element: LeftActionBarElement) {
    const descriptorBasedClass = element.formElementDescriptor.descriptorType.split('Descriptor').shift()
    if (typeof descriptorBasedClass === 'string') {
      return 'labe-' + descriptorBasedClass[0].toLowerCase() + descriptorBasedClass.substr(1)
    }
    return 'labe-unknown'
  }

  /**
   * This property represent all the custom filters available, indexed by the filter name. It makes it usable with v-model.
   * The value is wrapped in a proxy so:
   * - The values are retrieved from the query string. If the filter is not defined in the query string, the default
   * value from the descriptor is returned, or null if there is no default value
   * - When the filter is modified, the query string is updated
   */
  get customFiltersValues () {
    const router = this.$router

    const handler = {
      get (obj: { [key: string]: LeftActionBarElement }, prop: string) {
        const lfb = obj[prop] ?? undefined
        if (typeof lfb !== 'undefined') {
          let paramFromQuery: string | undefined | null = listService.getQueryFilter('lcf-', lfb.formElementDescriptor.name, router)
          if (typeof paramFromQuery !== 'undefined') {
            if (lfb.formElementDescriptor.descriptorType === 'MedSelectDescriptor') {
              if ((paramFromQuery?.length ?? 0) === 0) {
                paramFromQuery = null
              }
              return (lfb.formElementDescriptor as MedSelectDescriptor)
                .getOptions()
                .then((options: SelectValue[] | undefined) => options?.find((option: SelectValue) => option.value === paramFromQuery) ?? null)
            }
            return paramFromQuery
          }
        }
        return null
      },
      set (obj: { [key: string]: LeftActionBarElement }, prop: string, value: any) {
        const lfb = obj[prop] ?? undefined

        if (typeof lfb !== 'undefined') {
          if (lfb.formElementDescriptor.descriptorType === 'MedSelectDescriptor' && typeof value !== 'undefined') {
            value = (value as SelectValue).value
          }
          customFilterChangeHandler(router, lfb, value)
        }

        return true
      }
    }

    const indexedCustomElements: { [key: string]: LeftActionBarElement } = {}
    this.leftActionBarProperties.customElements.forEach((element) => {
      indexedCustomElements[element.formElementDescriptor.name] = element
    })

    return new Proxy<{ [key: string]: LeftActionBarElement }>(indexedCustomElements, handler)
  }

  customFilterChangeHandler (element: LeftActionBarElement, value?: any) {
    customFilterChangeHandler(this.$router, element, value)
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/breakpoints";

@include phone-portrait {
  #leftActionBar:not(.forceOpen) {
    display: none;
  }
}

#labColorBar {
  height: 100%;
  width: 30px;
  position: fixed;
  background-color: #e4dccc;

  @include phone-portrait {
    width: 35px;
  }
}

#labElements {
  position: relative;
  overflow: hidden;
  height: 100%;
}
</style>

<style lang="scss">
@import "assets/scss/colors";
@import "assets/scss/breakpoints";
@import "assets/scss/list";

.leftActionBarElement {
  line-height: $left-action-bar-element-height;
  height: $left-action-bar-element-height;
  cursor: pointer;
  z-index: 1;
  display: flex;

  a {
    display: flex;
    font-size: .9rem;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    width: 100%;

    .leftActionBarElementText {
      width: calc(100% - $icon-min-width);
      padding-left: $left-action-bar-element-text-padding-left;

      @include phone-portrait {
        width: calc(100% - $mobile-portrait-icon-min-width);
      }
    }
  }

  .leftActionBarElementIcon {
    min-width: $icon-min-width;
    text-align: center;
    display: inline-block;
    transition: background-color .3s, color .3s;
    font-size: 1rem;
    height: $left-action-bar-element-height;
    line-height: $left-action-bar-element-height;

    @include phone-portrait {
      min-width: $mobile-portrait-icon-min-width;
    }
  }

  .leftActionBarElementText {
    transition: background-color .3s;
    flex-grow: 1;
    padding-left: $left-action-bar-element-text-padding-left;

    .formulate-input, .formulate-input-wrapper, .formulate-input-element {
      height: 100%;

      button {
        border: 0;
        width: 100%;
        height: 100%;
        text-align: left;
        display: block;
        background-color: transparent;
        padding-left: 0;

        i {
          display: none;
        }
      }

      .formulate-input-element--medselect {
        position: relative;

        li{
          line-height: initial;
        }

        .formulate-input-wrapper {
          margin: 0 !important;
          height: $left-action-bar-element-height !important;

          .formulate-input[data-type="void"] {
            margin-right: 0 !important;
          }

          .formulate-input-element--void {
            border: none !important;
            padding-left: 0 !important;
            background: transparent !important;
            color: $text !important;
            font-size: .9rem !important;
            width: calc($left-action-bar-width-extent - $left-action-bar-width-shrunk - $left-action-bar-element-text-padding-left);
          }
        }
      }
    }

    button, select {
      font-size: .9rem;
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
      line-height: $left-action-bar-element-height;
      padding-left: 5px;
    }
  }
}
</style>

<template>
  <div class="leftActionBarElement">
    <div class="leftActionBarElementIcon" :class="element.elementDescriptor.faIcon" />

    <div class="leftActionBarElementText">
      <MedInputButton
        v-if="isButton"
        :button-descriptor="element.elementDescriptor"
        @click.native="executeCallback"
      />

      <MedInputSelect
        v-if="isSelect"
        :select-descriptor="element.elementDescriptor"
        @change.native="executeCallback($event.target.value)"
      />

      <!--      <Button-->
      <!--        v-if="isButton"-->
      <!--        :button-descriptor="element.elementDescriptor"-->
      <!--        @click.native="element.callback"-->
      <!--      />-->
      <!--      <Select2 v-if="isSelect" :select-descriptor="element.elementDescriptor" @change="executeCallback" />-->
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import MedInputSelect from '~/components/form/elements/MedInputSelect.vue'
// import Button from '~/components/form/elements/Button'

@Component({
  components: {
    MedInputSelect,
    MedInputButton
    // Select2: () => import('~/components/form/elements/Select2.vue'),
    // Button
  }
})
export default class BarElement extends Vue {
  @Prop(Object) element!: LeftActionBarElement;

  get isButton () {
    return this.element.elementDescriptor.descriptorType === 'ButtonDescriptor'
  }

  get isSelect () {
    return this.element.elementDescriptor.descriptorType === 'LeftActionBarFormSelectDescriptor'
  }

  executeCallback (e: any) {
    this.element.callback(e, this.element)
  }
}
</script>

<style lang="scss">
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

  &:hover .leftActionBarElementIcon {
    background-color: #bbaf99;
  }

  &:hover .leftActionBarElementText {
    background-color: #e4dccc;
  }
}
</style>

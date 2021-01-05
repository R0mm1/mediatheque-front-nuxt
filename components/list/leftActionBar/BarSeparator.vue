<template>
  <div class="leftActionBarSeparator">
    <div class="leftActionBarSeparatorIcon" :class="separator.faIcon" />

    <div class="leftActionBarSeparatorText">
      {{ separator.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LeftActionBarSeparator from '../../../assets/ts/list/LeftActionBarSeparator'

@Component
export default class BarSeparator extends Vue {
    @Prop(Object) separator!: LeftActionBarSeparator;
}
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/colors";

    .leftActionBarSeparator {
        z-index: 1;
        display: flex;
        overflow: hidden;
        height: 30px;
        color: $textDisabled;

        .leftActionBarSeparatorIcon {
            width: 30px;
            min-width: 30px;
            text-align: center;
            display: inline-block;
            font-size: 1rem;
            height: 30px;
            line-height: 30px;
            background-color: #eeeae1;
        }

        .leftActionBarSeparatorText {
            flex: 1;
            line-height: 30px;
            padding-left: 5px;
        }
    }
</style>

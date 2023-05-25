<template>
  <div class="widget_popup" :class="{displayed: isDisplayed}">
    <div>
      <div class="popup_header" data-cy="popupHeader">
        <slot name="popup_header" />
      </div>
      <div class="popup_body" data-cy="popupBody">
        <slot name="popup_body" />
      </div>
      <div class="popup_footer" data-cy="popupFooter">
        <slot name="popup_footer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Popup extends Vue {
  @Prop({
    type: Boolean,
    default: false
  }) isDisplayed!: boolean
}

</script>

<style scoped lang="scss">
@import "~assets/scss/colors.scss";

.widget_popup{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  justify-content: center;
  align-items: start;

  &:not(.displayed) {
    display: none;
  }

  > div{
    padding: 15px;
    background-color: white;
    border: 1px solid $shade0;
    border-radius: 5px;
  }

  .popup_header {
    border-left: 3px solid $shade0;
    padding-left: 5px;
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .popup_body{
    margin: 15px 0;
  }

  .popup_footer{
    display: flex;
    justify-content: end;

    .formulate-input:not(:last-of-type){
      margin-right: 5px;
    }
  }
}
</style>

<template>
  <div class="med_popup_group" :class="builtCustomClass">
    <div :class="{builtCustomClass: hasCustomClass}" />
    <div class="group_header">
      <h2 class="group_name">
        <slot name="group_name" />
      </h2>

      <div class="group_customActions">
        <slot name="group_customActions" />
      </div>
    </div>

    <div class="group_content">
      <slot name="group_content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Group',
  props: {
    customClass: { type: String, required: false, default: null }
  },
  computed: {
    hasCustomClass () {
      return this.customClass !== null && this.customClass.length > 0
    },
    builtCustomClass () {
      const builtClass = {}
      builtClass['group_' + this.customClass] = this.hasCustomClass
      return builtClass
    }
  }
}
</script>

<style scoped lang="scss">
    $headerHeight: 1.7rem;

    .med_popup_group {
        margin: 10px;
        display: flex;
        flex-direction: column;
    }

    .group_header {
        display: flex;
        height: $headerHeight;
        margin-bottom: 7px;

        .group_name {
            flex: 1;
            line-height: $headerHeight;
        }

        .group_customActions .form_element_button {
            height: 1.7rem;
            margin: 0;
            padding: 0;
            width: $headerHeight;
            text-align: center;
        }
    }

    .group_name {
        border-left: 3px solid #e4dccc;
        padding-left: 5px;
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
    }

    .group_content {
        position: relative;
        flex: 1;
    }
</style>

<style lang="scss">
    $headerHeight: 1.7rem;

    .med_popup_group {
        .group_header .group_customActions .form_element_button label {
            line-height: $headerHeight;
        }
    }
</style>

<template>
  <div class="med_popup_column">
    <slot name="column_content" />
  </div>
</template>

<script>
export default {
  name: 'Column'
}
</script>

<style scoped lang="scss">
    .med_popup_column {
        .med_popup_group:nth-child(1n+2) {
            margin-top: 30px;
        }
    }
</style>

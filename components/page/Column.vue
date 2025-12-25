<template>
  <div class="med_popup_column">
    <slot name="column_content" />
  </div>
</template>

<script setup lang="ts">
// Simple layout component with slot
</script>

<style scoped lang="scss">
    .med_popup_column {
        .med_popup_group:nth-child(1n+2) {
            margin-top: 30px;
        }
    }
</style>

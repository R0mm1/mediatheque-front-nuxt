<template>
  <Group :group-id="groupId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Group from "~/components/groups/Group.vue";

const route = useRoute();
const groupId = computed(() => parseInt(route.params.id as string));
</script>

<style scoped></style>

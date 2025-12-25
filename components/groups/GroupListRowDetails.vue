<template>
  <div class="group-list-row-details">
    <MedInputButton :button-descriptor="openGroupPageButtonDescriptor" />
    <MedInputButton
      :button-descriptor="deleteGroupButtonDescriptor"
      @click.stop="setGroupForDeletion"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MedInputButton from "~/components/form/elements/MedInputButton.vue";
import ButtonDescriptor from "~/assets/ts/form/ButtonDescriptor";
import { ReferenceGroupItem } from "~/assets/ts/models/book/ReferenceGroup";
import groupListModule from "~/assets/ts/store/list/GroupListModule";

interface Props {
  data: ReferenceGroupItem;
}

const props = defineProps<Props>();

const openGroupPageButtonDescriptor = computed(() =>
  new ButtonDescriptor("openGroupPage", "Ouvrir la page du groupe")
    .setFaIcon("fas fa-arrow-right")
    .setStyle("icon-round")
);

const deleteGroupButtonDescriptor = computed(() =>
  new ButtonDescriptor("deleteGroup", "Supprimer le groupe")
    .setFaIcon("far fa-trash-alt")
    .setStyle("icon-round")
);

const setGroupForDeletion = () => {
  groupListModule.setGroupToDelete(props.data);
};
</script>

<style scoped lang="scss">
.group-list-row-details {
  display: flex;
  margin: 5px;

  &::v-deep button {
    margin: 7px;
  }
}
</style>

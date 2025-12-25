<template>
  <Popup :is-displayed="true" data-cy="popupBookDelete">
    <template #popup_header>
      {{ t("reference_groups.remove_element.popup.header") }}
    </template>
    <template #popup_body>
      {{
        t("reference_groups.remove_element.popup.body", {
          bookTitle,
          groupComment,
        })
      }}
    </template>
    <template #popup_footer>
      <MedInputButton
        :button-descriptor="cancelButtonDescriptor"
        @click="emit('group-book-delete-cancel')"
      />
      <MedInputButton
        :button-descriptor="deleteButtonDescriptor"
        @click="emit('group-book-delete-trigger')"
      />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Popup from "~/components/widgets/Popup.vue";
import MedInputButton from "~/components/form/elements/MedInputButton.vue";
import ButtonDescriptor from "~/assets/ts/form/ButtonDescriptor";

interface Props {
  groupComment?: string;
  bookTitle?: string;
}

withDefaults(defineProps<Props>(), {
  groupComment: "",
  bookTitle: "",
});

const emit = defineEmits<{
  "group-book-delete-cancel": [];
  "group-book-delete-trigger": [];
}>();

const { t } = useI18n();

const deleteButtonDescriptor = new ButtonDescriptor(
  "remove",
  t("reference_groups.remove_element.popup.action.remove")
).setDataCy("buttonRemove");

const cancelButtonDescriptor = new ButtonDescriptor(
  "cancel",
  t("reference_groups.remove_element.popup.action.cancel")
).setDataCy("buttonCancel");
</script>

<style scoped lang="scss">
.widget_popup {
  z-index: 1;
  max-width: 500px;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

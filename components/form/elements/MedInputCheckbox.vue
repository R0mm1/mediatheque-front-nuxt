<template>
  <div class="med_input_checkbox">
    <label :for="checkboxDescriptor.name" class="checkbox-label">
      <input
        :id="checkboxDescriptor.name"
        v-model="bindValue"
        type="checkbox"
        class="checkbox-input"
        @change="emitChange"
      />
      <span class="checkbox-text">{{ checkboxDescriptor.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import type CheckboxDescriptor from "~/assets/ts/form/CheckboxDescriptor";

interface Props {
  checkboxDescriptor: CheckboxDescriptor;
  modelValue?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<Emits>();

const bindValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const emitChange = () => {
  emit("update:modelValue", bindValue.value);
};

watch(
  () => props.modelValue,
  (newVal) => {
    bindValue.value = newVal;
  }
);
</script>

<style lang="scss" scoped>
.med_input_checkbox {
  display: flex;
  align-items: center;

  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;
  }

  .checkbox-input {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    accent-color: #1976d2;
  }

  .checkbox-text {
    user-select: none;
  }
}
</style>

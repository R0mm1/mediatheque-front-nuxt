<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <div v-if="title" class="form-title">
      {{ title }}
    </div>

    <FormField
      v-for="field in fields"
      :key="field.name"
      v-model="formData[field.name]"
      :type="field.type"
      :label="field.label"
      :placeholder="field.placeholder"
      :required="field.required"
      :disabled="field.disabled"
      :options="field.options"
      :error="fieldErrors[field.name]"
      :name="field.name"
    />

    <slot name="body" />

    <div class="form-actions">
      <button
        v-if="showSubmitButton"
        type="submit"
        class="btn btn-primary"
        :disabled="isSubmitting"
      >
        {{ submitButtonLabel }}
      </button>
      <button
        v-if="showCancelButton"
        type="button"
        class="btn btn-secondary"
        @click="handleCancel"
      >
        {{ cancelButtonLabel }}
      </button>
      <slot name="actions" />
    </div>

    <div v-if="submitError" class="form-error-message">
      {{ submitError }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { FormFieldConfig } from "~/assets/ts/composables/useForm";
import { validateForm } from "~/assets/ts/composables/useForm";
import FormField from "~/components/Form/FormField.vue";

interface Props {
  fields: FormFieldConfig[];
  initialData?: Record<string, any>;
  title?: string;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
}

interface Emits {
  (e: "submit", data: Record<string, any>): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  submitButtonLabel: "Submit",
  cancelButtonLabel: "Cancel",
  showSubmitButton: true,
  showCancelButton: true,
});

const emit = defineEmits<Emits>();

const formData = reactive(
  props.fields.reduce((acc, field) => {
    acc[field.name] = props.initialData[field.name] ?? field.value ?? "";
    return acc;
  }, {} as Record<string, any>)
);

const fieldErrors = reactive<Record<string, string>>({});
const submitError = ref<string>("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);
  submitError.value = "";

  // Validate form
  const errors = validateForm(formData, props.fields);
  if (Object.keys(errors).length > 0) {
    Object.assign(fieldErrors, errors);
    return;
  }

  try {
    isSubmitting.value = true;
    emit("submit", formData);
  } catch (error) {
    submitError.value =
      error instanceof Error ? error.message : "An error occurred";
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit("cancel");
};

defineExpose({
  formData,
  fieldErrors,
  submitError,
  isSubmitting,
});
</script>

<style scoped lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 600px;

  .form-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.btn-primary {
        background-color: #1976d2;
        color: white;

        &:hover:not(:disabled) {
          background-color: #1565c0;
        }
      }

      &.btn-secondary {
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;

        &:hover:not(:disabled) {
          background-color: #eeeeee;
        }
      }
    }
  }

  .form-error-message {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 1rem;
    border-radius: 4px;
    border-left: 4px solid #d32f2f;
  }
}
</style>

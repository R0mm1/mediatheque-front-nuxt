<template>
  <div :class="['form-field', `form-field-${type}`]">
    <label v-if="label" :for="fieldId" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <template v-if="type === 'text'">
      <input
        :id="fieldId"
        v-model="modelValue"
        type="text"
        class="form-input"
        :required="required"
        :disabled="disabled"
        @input="emitUpdate"
      />
    </template>

    <template v-else-if="type === 'textarea'">
      <textarea
        :id="fieldId"
        v-model="modelValue"
        class="form-textarea"
        :required="required"
        :disabled="disabled"
        @input="emitUpdate"
      />
    </template>

    <template v-else-if="type === 'select'">
      <select
        :id="fieldId"
        v-model="modelValue"
        class="form-select"
        :required="required"
        :disabled="disabled"
        @change="emitUpdate"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>

    <template v-else-if="type === 'checkbox'">
      <input
        :id="fieldId"
        v-model="modelValue"
        type="checkbox"
        class="form-checkbox"
        :disabled="disabled"
        @change="emitUpdate"
      />
    </template>

    <template v-else-if="type === 'radio'">
      <fieldset class="form-radio-group">
        <label
          v-for="option in options"
          :key="option.value"
          class="form-radio-label"
        >
          <input
            v-model="modelValue"
            type="radio"
            :value="option.value"
            :disabled="disabled"
            @change="emitUpdate"
          />
          {{ option.label }}
        </label>
      </fieldset>
    </template>

    <div v-if="error" class="form-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Option {
  value: string | number | boolean;
  label: string;
}

interface Props {
  modelValue?: string | number | boolean | string[];
  type?: "text" | "textarea" | "select" | "checkbox" | "radio";
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Option[];
  error?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  disabled: false,
  options: () => [],
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean | string[]];
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const fieldId = computed(() => props.name || `field-${Math.random()}`);

const emitUpdate = () => {
  emit("update:modelValue", modelValue.value);
};
</script>

<style scoped lang="scss">
.form-field {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;

  .form-label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;

    .required {
      color: #d32f2f;
      margin-left: 0.25rem;
    }
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    background-color: #fff;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-checkbox {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .form-radio-group {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: normal;

    input {
      width: 1.2rem;
      height: 1.2rem;
      cursor: pointer;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }

  .form-error {
    color: #d32f2f;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
}
</style>

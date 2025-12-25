# Vue 2 → Vue 3 & Nuxt 2 → Nuxt 4 Migration Guide

## Overview

This document outlines the migration from Vue 2 + Nuxt 2 to Vue 3 + Nuxt 4, including:

- Dependency updates
- Component API conversion (vue-property-decorator → Composition API)
- Vue Formulate removal (replaced with native form components)
- Incompatible dependency replacements

## Changes Made

### 1. Dependencies Updated

**Removed (Vue 2/Nuxt 2 only):**

- `vue-property-decorator` → Use native Composition API
- `vue-class-component` → Use native Composition API
- `@braid/vue-formulate` → Use native form components
- `@nuxtjs/axios` → Use native fetch or axios directly
- `@nuxtjs/toast` → Use native notifications or lightweight alternative
- `ckeditor4-vue` → Replaced with `@ckeditor/ckeditor5-vue`
- `vuedraggable` → Use `draggable-plus`
- `vue-click-outside` → Use native `@click-outside` or custom directive
- `v-tooltip` → Use `floating-vue`
- `vuex-module-decorators` → Migrate to Pinia
- `vuejs-paginate` → Use custom pagination or Headless UI

**Updated:**

- `nuxt`: 2.15.8 → 4.0.0
- `vue`: 2 → 3.3.0
- `typescript`: 4.8.4 → 5.3.0
- `@ckeditor/ckeditor5-*`: Updated to v40+
- `chart.js`: 3.9.1 → 4.4.0
- `tesseract.js`: 3.0.3 → 4.1.0
- `@nuxtjs/i18n`: 7.3.0 → 8.0.0

**Kept Compatible:**

- `axios`, `animejs`, `tsyringe`, `reflect-metadata`

### 2. Component Conversion Pattern

#### Before (Vue 2 + vue-property-decorator):

```vue
<template>
  <FormulateInput
    v-model="bindValue"
    :label="checkboxDescriptor.label"
    type="checkbox"
  />
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import CheckboxDescriptor from "assets/ts/form/CheckboxDescriptor";

@Component({})
export default class MedInputCheckbox extends Vue {
  @Prop(Object) checkboxDescriptor!: CheckboxDescriptor;
  @Prop(Boolean) value!: boolean;
  bindValue = false;

  @Watch("value")
  updateBindValue(newVal: boolean) {
    this.bindValue = newVal;
  }

  @Watch("bindValue")
  @Emit("input")
  bindValueChanged(newVal: boolean) {
    return newVal;
  }

  created() {
    this.bindValue = this.value;
  }
}
</script>
```

#### After (Vue 3 + Composition API):

```vue
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

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const bindValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(
  () => props.modelValue,
  (newVal) => {
    bindValue.value = newVal;
  }
);
</script>
```

### 3. Key Conversions

#### Props

- `@Prop()` → `defineProps()`
- Usage: `this.prop` → `props.prop`

#### Emits

- `@Emit()` → `defineEmits()`
- Usage: `this.$emit('event', value)` → `emit('event', value)`

#### Lifecycle Hooks

- `created()` → `onMounted()`
- `mounted()` → `onMounted()`
- `beforeDestroy()` → `onBeforeUnmount()`
- Import from `vue`

#### Watchers

- `@Watch()` → `watch()` from `vue`
- Usage: `watch(() => props.value, (newVal) => { ... })`

#### Computed Properties

- `@Computed()` → `computed()` from `vue`

### 4. Vue Formulate → Native Forms

Replace `<FormulateForm>` and `<FormulateInput>` with new `<FormField>` component:

```vue
<!-- Before -->
<FormulateForm v-model="formData" :schema="formSchema" />

<!-- After -->
<form>
  <FormField
    v-for="field in formSchema"
    :key="field.name"
    v-model="formData[field.name]"
    :type="field.type"
    :label="field.label"
    :options="field.options"
    :required="field.required"
  />
  <button type="submit">Submit</button>
</form>
```

### 5. Nuxt 4 Configuration

See `nuxt.config.ts` for the new configuration format:

- Module imports changed
- Plugins structure updated
- Runtime config simplified
- No more `target` or `ssr` properties needed

### 6. Migration Checklist

- [ ] Update `package.json` dependencies
- [ ] Create new `nuxt.config.ts`
- [ ] Convert component scripts to Composition API
- [ ] Replace Vue Formulate with native forms
- [ ] Update store (Vuex → Pinia)
- [ ] Update middleware
- [ ] Update plugins
- [ ] Test routing and layouts
- [ ] Test forms and validation
- [ ] Run E2E tests with Cypress
- [ ] Performance testing

### 7. Testing the Application

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Navigate to `https://localhost:3000`
4. Login with credentials: `test` / `test`
5. Test key features:
   - User login/logout
   - Book list view and filtering
   - Create/edit books
   - Form submissions
   - Search functionality
   - i18n language switching

## Resources

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Nuxt 3/4 Documentation](https://nuxt.com)
- [Composition API](https://vuejs.org/guide/introduction.html#what-is-vue)
- [Pinia Documentation](https://pinia.vuejs.org/)

## Common Issues & Solutions

### Issue: `$t` is not defined

**Solution:** Ensure `@nuxtjs/i18n` v8 is installed and properly configured in `nuxt.config.ts`

### Issue: Components not rendering

**Solution:** Check that component names follow PascalCase and are properly registered

### Issue: Form data not updating

**Solution:** Use `v-model="modelValue"` with `@update:modelValue` event

## Next Steps

1. Run the migration script: `node scripts/migrate-to-composition-api.js`
2. Manually review and test migrated components
3. Update forms from Formulate syntax
4. Run full test suite
5. Deploy to staging for QA

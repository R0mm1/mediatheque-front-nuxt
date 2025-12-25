# Vue 3 & Nuxt 4 Migration - Quick Start Guide

## ✅ What's Been Done

### 1. **Dependencies Updated** (`package.json`)

- Upgraded to Nuxt 4.0.0 and Vue 3.3.0
- Removed: `vue-property-decorator`, `@braid/vue-formulate`, `@nuxtjs/axios`, etc.
- Added: Pinia, proper Vue 3 ecosystem packages

### 2. **Nuxt Config Updated** → `nuxt.config.ts`

- Modern TypeScript configuration
- i18n v8 support
- Pinia integration
- Proper runtime config setup

### 3. **TypeScript Config Updated** → `tsconfig.json`

- ES2020 target
- Vue 3 types support
- Vitest for testing

### 4. **Sample Components Converted**

- `MedInputCheckbox.vue` → Composition API with `<script setup>`
- `Popup.vue` → Simplified with defineProps

### 5. **New Form System**

- `FormField.vue` - Generic form field component (replaces FormulateInput)
- `FormContainer.vue` - Form wrapper with validation
- `useForm.ts` - Composable for form handling and validation

### 6. **Documentation**

- `MIGRATION_VUE3_NUXT4.md` - Complete migration guide
- `scripts/migrate-to-composition-api.js` - Batch conversion script
- `scripts/cleanup-plugins.sh` - Plugin cleanup

---

## 🚀 Next Steps

### Step 1: Install Dependencies

```bash
cd /home/romain3/Documents/www/VPS/mediatheque-front-nuxt
rm -rf node_modules yarn.lock
npm install
# or yarn install
```

### Step 2: Run Component Migration Script

```bash
node scripts/migrate-to-composition-api.js
```

This will:

- Convert class-based components to Composition API
- Remove vue-property-decorator imports
- Keep already-migrated components unchanged

### Step 3: Manual Fixes (Still Needed)

#### A. Update Vue Formulate Components

Location: `components/form/elements/formulate/*.vue` (Select.vue, Chips.vue, Files.vue, Void.vue)

**Convert from:**

```vue
<FormulateForm v-model="data" :schema="schema" />
<FormulateInput type="text" v-model="value" />
```

**Convert to:**

```vue
<FormField v-model="value" type="text" label="Field Label" required />
```

**Action:** Create replacement components using FormField

#### B. Update Store (Vuex → Pinia)

Location: `store/` directory

**Migration steps:**

1. Create `stores/` directory (new Nuxt 4 convention)
2. Convert Vuex modules to Pinia stores
3. Example:

```typescript
// Old: store/BookModule.ts (Vuex)
import { VuexModule } from "vuex-module-decorators";

// New: stores/books.ts (Pinia)
import { defineStore } from "pinia";

export const useBooksStore = defineStore("books", () => {
  const books = ref([]);
  const getBooks = async () => {
    /* ... */
  };
  return { books, getBooks };
});
```

#### C. Update Middleware

Location: `middleware/` directory

- Ensure middleware uses Nuxt 4 syntax
- No major changes usually needed

#### D. Update Plugins

Location: `plugins/` directory

Remove/cleanup:

- `vueFormulate.js` - No longer needed
- `vueTooltip.client.js` - floating-vue auto-registers
- `vuePaginate.client.js` - Use custom pagination

Update:

- `tsyringe.ts` - Already done ✅
- `vueChartjs.client.js` - Update if needed
- `wysiwyg.client.js` - Already compatible

### Step 4: File Cleanup

```bash
# Remove obsolete Vue Formulate components
rm -f components/form/elements/formulate/Select.vue
rm -f components/form/elements/formulate/Chips.vue
rm -f components/form/elements/formulate/Files.vue
rm -f components/form/elements/formulate/Void.vue

# Remove obsolete plugins
rm -f plugins/vueFormulate.js
rm -f plugins/vueTooltip.client.js
rm -f plugins/vuePaginate.client.js
rm -f plugins/vueStarRating.client.js
```

### Step 5: Test Build

```bash
npm run build
```

Look for TypeScript errors and fix them

### Step 6: Start Dev Server

```bash
npm run dev
```

The server will run on `http://localhost:3000` (or your configured port)

### Step 7: Test the Application

1. **Open:** https://localhost:3000
2. **Login** with credentials:
   - Username: `test`
   - Password: `test`
3. **Test features:**
   - ✓ Login/logout flow
   - ✓ Book list loading
   - ✓ Filter functionality
   - ✓ Create/edit book forms
   - ✓ File uploads
   - ✓ Search
   - ✓ Language switching (i18n)

---

## 📋 Conversion Patterns Reference

### Props in Composition API

```typescript
// Old
@Prop() title!: string
this.title

// New
const props = defineProps<{ title: string }>()
props.title
```

### Emits

```typescript
// Old
@Emit('close') close() { this.$emit('close') }

// New
const emit = defineEmits<{ close: [] }>()
emit('close')
```

### Watchers

```typescript
// Old
@Watch('value') onValueChange(newVal) { ... }

// New
watch(() => props.value, (newVal) => { ... })
```

### Computed

```typescript
// Old
@Computed() fullName() { return this.first + ' ' + this.last }

// New
const fullName = computed(() => props.first + ' ' + props.last)
```

### Lifecycle Hooks

```typescript
// Old → New
created() → onMounted()
mounted() → onMounted()
beforeDestroy() → onBeforeUnmount()
destroyed() → onUnmounted()
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module X"

- Check that import paths use `~` for root aliases
- Verify file extensions in imports

### Issue: "Component not rendering"

- Check component names are PascalCase
- Verify auto-import is working in `components/`
- Check defineProps/emit syntax

### Issue: "v-model not updating"

- Use `v-model="modelValue"` in template
- Use `defineProps`, `defineEmits` with proper types
- Emit `update:modelValue` event

### Issue: Form validation not working

- Import and use `useForm()` composable
- Call `validateForm()` before submit
- Check field `required` properties

### Issue: "Route not found"

- Check `pages/` directory structure matches routes
- Use `<NuxtLink>` instead of `<router-link>`
- Verify file names don't have underscores for dynamic routes

---

## 📚 Resources

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Nuxt 4 Documentation](https://nuxt.com)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Store](https://pinia.vuejs.org/)

---

## ⏰ Estimated Timeline

- **Component Migration:** 4-6 hours
- **Store Migration:** 2-3 hours
- **Form Updates:** 3-4 hours
- **Testing & QA:** 2-3 hours
- **Total:** ~12-16 hours

---

## 📝 Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Build passes (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] Components converted to Composition API
- [ ] Stores migrated to Pinia
- [ ] Forms updated to use FormField
- [ ] Plugins cleaned up
- [ ] Manual tests pass
- [ ] E2E tests pass (Cypress)
- [ ] Deploy to staging
- [ ] Production deployment

---

**Questions?** Check the main `MIGRATION_VUE3_NUXT4.md` file for detailed documentation.

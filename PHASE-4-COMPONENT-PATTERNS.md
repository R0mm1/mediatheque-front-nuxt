# Phase 4: Patterns de Transformation des Composants

## Vue d'ensemble

Transformation de 57 composants Vue 2 avec decorators vers Vue 3 Composition API.

## Patterns de Transformation

### 1. Props Simples

**Avant (Vue 2 + decorators):**
```vue
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Column extends Vue {
  @Prop({ type: String, default: '' }) customClass!: string
  @Prop({ type: Boolean, default: false }) isActive!: boolean
}
</script>
```

**Après (Vue 3 Composition API):**
```vue
<script setup lang="ts">
interface Props {
  customClass?: string
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  isActive: false
})
</script>
```

### 2. Props + Emits

**Avant:**
```vue
<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'

@Component
export default class Button extends Vue {
  @Prop({ type: String }) label!: string

  @Emit('click')
  handleClick(event: MouseEvent) {
    return { event, timestamp: Date.now() }
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
interface Props {
  label: string
}

interface Emits {
  (e: 'click', payload: { event: MouseEvent; timestamp: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  emit('click', { event, timestamp: Date.now() })
}
</script>
```

### 3. Watch

**Avant:**
```vue
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component
export default class EditableField extends Vue {
  @Prop({ type: Boolean }) editModeOn!: boolean

  @Watch('editModeOn')
  onEditModeChanged(newValue: boolean, oldValue: boolean) {
    if (newValue) {
      this.focusInput()
    }
  }

  focusInput() {
    // ...
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
interface Props {
  editModeOn: boolean
}

const props = defineProps<Props>()

const focusInput = () => {
  // ...
}

watch(() => props.editModeOn, (newValue, oldValue) => {
  if (newValue) {
    focusInput()
  }
})
</script>
```

### 4. Computed Getter/Setter

**Avant:**
```vue
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  @Prop({ type: String }) value!: string

  get inputValue() {
    return this.value
  }

  set inputValue(newValue: string) {
    this.$emit('input', newValue)
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
interface Props {
  value: string
}

interface Emits {
  (e: 'input', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = computed({
  get: () => props.value,
  set: (value: string) => emit('input', value)
})
</script>
```

### 5. Lifecycle Hooks

**Avant:**
```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DataLoader extends Vue {
  data: any[] = []
  loading: boolean = false

  created() {
    this.loadData()
  }

  mounted() {
    console.log('Component mounted')
  }

  async loadData() {
    this.loading = true
    this.data = await fetchData()
    this.loading = false
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
const data = ref<any[]>([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  data.value = await fetchData()
  loading.value = false
}

// created() → top-level dans setup
loadData()

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### 6. Refs et Template Refs

**Avant:**
```vue
<template>
  <input ref="inputElement" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  $refs!: {
    inputElement: HTMLInputElement
  }

  focusInput() {
    this.$refs.inputElement.focus()
  }
}
</script>
```

**Après:**
```vue
<template>
  <input ref="inputElement" />
</template>

<script setup lang="ts">
const inputElement = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  inputElement.value?.focus()
}
</script>
```

### 7. Imports de Stores (Vuex → Pinia)

**Avant:**
```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import bookModule from '~/assets/ts/store/book/BookModule'

@Component
export default class BookForm extends Vue {
  get book() {
    return bookModule.book
  }

  get isModified() {
    return bookModule.flagService.flags.isModified
  }

  saveBook() {
    bookModule.save()
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
import { useBookStore } from '~/stores/book'

const bookStore = useBookStore()

const book = computed(() => bookStore.book)
const isModified = computed(() => bookStore.isModified)

const saveBook = () => {
  bookStore.save()
}
</script>
```

### 8. Composables (pour remplacer click-outside)

**Avant:**
```vue
<template>
  <div v-click-outside="handleClickOutside">
    Content
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Popup extends Vue {
  handleClickOutside() {
    this.$emit('close')
  }
}
</script>
```

**Après:**
```vue
<template>
  <div ref="popupRef">
    Content
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

const popupRef = ref<HTMLElement | null>(null)

useClickOutside(popupRef, () => {
  emit('close')
})
</script>
```

### 9. $route et $router

**Avant:**
```vue
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class List extends Vue {
  @Watch('$route.query')
  onQueryChanged() {
    this.loadData()
  }

  navigateToBook(id: number) {
    this.$router.push(`/book/${id}`)
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

watch(() => route.query, () => {
  loadData()
})

const navigateToBook = (id: number) => {
  router.push(`/book/${id}`)
}
</script>
```

### 10. Component Registration

**Avant:**
```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Column from '~/components/page/Column.vue'
import Row from '~/components/page/Row.vue'

@Component({
  components: {
    Column,
    Row
  }
})
export default class Page extends Vue {
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
// Auto-imports dans Nuxt 3 - pas besoin d'importer les composants
// Column et Row sont automatiquement disponibles
</script>
```

### 11. $nuxtApp et Plugins

**Avant:**
```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Notification extends Vue {
  showSuccess(message: string) {
    this.$toasted.show(message)
  }

  get isMobile() {
    return this.$device.isMobile
  }
}
</script>
```

**Après:**
```vue
<script setup lang="ts">
const { $toasted, $device } = useNuxtApp()

const showSuccess = (message: string) => {
  $toasted.show(message)
}

const isMobile = computed(() => $device.isMobile)
</script>
```

## Ordre de Migration

### Semaine 1: Composants Simples (20)

**Widgets (5):**
- `/components/widgets/SimpleList.vue`
- `/components/widgets/Loader.vue`
- `/components/widgets/Popup.vue`
- `/components/widgets/Tabs.vue`
- `/components/widgets/DeleteButton.vue`

**Layout (2):**
- `/components/page/Column.vue`
- `/components/page/Container.vue`

**Form Elements Simples (8):**
- `/components/form/elements/MedInputButton.vue`
- `/components/form/elements/MedInputCheckbox.vue`
- `/components/form/elements/MedInputRadio.vue`
- `/components/form/elements/MedInputHidden.vue`
- `/components/form/elements/MedLabel.vue`
- `/components/form/FormRow.vue`
- `/components/form/FormSection.vue`
- `/components/form/FormTitle.vue`

**Autres (5):**
- `/components/book/elements/Cover.vue`
- `/components/book/elements/CoverDropZone.vue`
- `/components/book/elements/Rating.vue`
- `/components/editor/EditorList.vue`
- `/components/author/AuthorList.vue`

### Semaine 2: Composants Moyens (25)

**Form Elements Complexes (10):**
- `/components/form/elements/MedInputText.vue`
- `/components/form/elements/MedInputTextarea.vue`
- `/components/form/elements/MedInputDate.vue`
- `/components/form/elements/MedInputNumber.vue`
- `/components/form/elements/MedInputTextWithButton.vue`
- `/components/form/elements/MedChips.vue`
- `/components/form/elements/MedSelect.vue`
- `/components/form/elements/MedFiles.vue`
- `/components/form/elements/MedWysiwyg.vue`
- `/components/form/FormElement.vue`

**Book Elements (8):**
- `/components/book/elements/Information.vue`
- `/components/book/elements/CoverInformation.vue`
- `/components/book/elements/BookFile.vue`
- `/components/book/elements/Authors.vue`
- `/components/book/elements/Notes.vue`
- `/components/book/tabs/InformationTab.vue`
- `/components/book/tabs/NotesTab.vue`
- `/components/book/tabs/FileTab.vue`

**Autres (7):**
- `/components/form/FormContainer.vue`
- `/components/author/AuthorForm.vue`
- `/components/editor/EditorForm.vue`
- `/components/list/ColumnSelectionPopup.vue`
- `/components/list/LeftActionBar.vue`
- `/components/group/GroupList.vue`
- `/components/group/GroupForm.vue`

### Semaine 3: Composants Complexes (12)

**Liste (5) - Les plus complexes:**
- `/components/list/List.vue` ⚠️ CRITIQUE
- `/components/list/Row.vue`
- `/components/list/Header.vue`
- `/components/list/Cell.vue`
- `/components/list/Pagination.vue`

**Books (4):**
- `/components/book/Book.vue` ⚠️ CRITIQUE
- `/components/book/PaperBook.vue`
- `/components/book/ElectronicBook.vue`
- `/components/book/AudioBook.vue`

**Groups (3):**
- `/components/book/groups/mainTab/GroupInformation.vue`
- `/components/book/groups/mainTab/GroupElements.vue`
- `/components/book/groups/mainTab/ElementsInGroup.vue`

## Checklist par Composant

Pour chaque composant:
- [ ] Lire le fichier source
- [ ] Identifier les decorators (@Prop, @Watch, @Emit, etc.)
- [ ] Identifier les computed, lifecycle hooks
- [ ] Identifier les imports de stores Vuex
- [ ] Créer le nouveau composant avec `<script setup lang="ts">`
- [ ] Transformer props → defineProps
- [ ] Transformer emits → defineEmits
- [ ] Transformer watch → watch()
- [ ] Transformer computed → computed()
- [ ] Transformer lifecycle → onMounted, etc.
- [ ] Remplacer imports Vuex → Pinia
- [ ] Tester le composant (visuel si possible)

## Points d'Attention

### TypeScript Strict
- Typer toutes les Props interfaces
- Typer toutes les Emits interfaces
- Utiliser `Ref<Type>` pour les refs

### Auto-imports Nuxt 3
- Ne pas importer: ref, computed, watch, onMounted, etc.
- Ne pas importer les composants dans `/components`
- Ne pas importer les composables dans `/composables`

### Breaking Changes
- `this.$emit('input', value)` → `emit('update:modelValue', value)` pour v-model
- `v-model` devient `v-model` (pas de changement syntaxe template)
- Event names: préférer 'update:*' pour v-model

### Validation
- Vérifier que le template n'utilise plus `this.`
- Vérifier les event handlers: `@click="method"` (pas `@click="method()"` sauf si args)
- Vérifier que tous les refs sont `.value`

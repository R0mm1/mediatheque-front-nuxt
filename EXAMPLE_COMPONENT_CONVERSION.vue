<!-- Example: Converting a Vue 2 class component with Formulate to Vue 3 Composition API -->

<template>
  <div class="book-form-container">
    <h2>Create/Edit Book</h2>

    <FormContainer
      :fields="formFields"
      :initial-data="book"
      title="Book Information"
      submit-button-label="Save Book"
      @submit="saveBook"
      @cancel="goBack"
    >
      <template #body>
        <!-- Additional complex UI that doesn't fit in FormField -->
        <div v-if="showAdvancedOptions" class="advanced-options">
          <label class="checkbox-label">
            <input v-model="advanced.setCustomCover" type="checkbox" />
            Use custom cover image
          </label>
        </div>
      </template>

      <template #actions>
        <button type="button" class="btn btn-tertiary" @click="toggleAdvanced">
          {{ showAdvancedOptions ? "Hide" : "Show" }} Advanced Options
        </button>
      </template>
    </FormContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "#app";
import FormContainer from "~/components/Form/FormContainer.vue";
import type { FormFieldConfig } from "~/assets/ts/composables/useForm";
import type { BookPaper } from "~/assets/ts/models/BookPaper";

// Router for navigation
const router = useRouter();

// Component state
const showAdvancedOptions = ref(false);
const isLoading = ref(false);
const advanced = reactive({
  setCustomCover: false,
});

// Form fields configuration
// These replace the old Formulate schema
const formFields = computed<FormFieldConfig[]>(() => [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter book title",
    required: true,
    validation: ["required", "minLength:3"],
  },
  {
    name: "author",
    type: "select",
    label: "Author",
    placeholder: "Select or create author",
    required: true,
    options: authorOptions.value,
  },
  {
    name: "isbn",
    type: "text",
    label: "ISBN",
    placeholder: "978-3-16-148410-0",
    validation: ["isbn"],
  },
  {
    name: "year",
    type: "number",
    label: "Publication Year",
    placeholder: new Date().getFullYear().toString(),
  },
  {
    name: "summary",
    type: "textarea",
    label: "Summary",
    placeholder: "Brief description of the book",
  },
  {
    name: "language",
    type: "select",
    label: "Language",
    options: [
      { value: "en", label: "English" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
    ],
  },
]);

// Placeholder book data
// In real app, this would come from route params or API
const book = reactive<Partial<BookPaper>>({
  title: "",
  year: new Date().getFullYear().toString(),
  language: "en",
});

// Mock authors data
// Replace with actual API call
const authorOptions = computed(() => [
  { value: "1", label: "Author One" },
  { value: "2", label: "Author Two" },
]);

// Methods
const toggleAdvanced = () => {
  showAdvancedOptions.value = !showAdvancedOptions.value;
};

const saveBook = async (formData: Record<string, any>) => {
  try {
    isLoading.value = true;
    console.log("Saving book:", formData);

    // API call would go here
    // const response = await bookService.saveBook(formData)

    // Show success message (using notifications)
    // this.$notify.success('Book saved successfully!')

    // Redirect to book list
    await router.push("/book");
  } catch (error) {
    console.error("Error saving book:", error);
    // this.$notify.error('Failed to save book')
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.book-form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 2rem;
    color: #333;
  }

  .advanced-options {
    padding: 1.5rem;
    background-color: #f5f5f5;
    border-left: 4px solid #1976d2;
    border-radius: 4px;
    margin-bottom: 1rem;

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;

      input {
        cursor: pointer;
      }
    }
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &.btn-tertiary {
      background-color: #757575;
      color: white;

      &:hover {
        background-color: #616161;
      }
    }
  }
}
</style>

<!-- 
CONVERSION NOTES:
================

1. REMOVED:
   - @Component decorator
   - vue-property-decorator imports
   - vue-property-decorator decorators (@Prop, @Emit, etc)
   - this. context (all properties are now destructured)
   - FormulateForm and FormulateInput components

2. ADDED:
   - <script setup lang="ts"> (new Composition API)
   - defineProps(), defineEmits()
   - ref(), reactive(), computed() from vue
   - useRouter() from nuxt
   - FormContainer component for form management

3. KEY CHANGES:
   - Form schema is now a computed array of FormFieldConfig
   - Form submission is handled by FormContainer (not custom code)
   - Form validation is built into FormContainer and useForm composable
   - State management is simpler with ref/reactive
   - Navigation uses useRouter() instead of this.$router

4. MIGRATION STEPS:
   - Identify all @Prop properties → convert to defineProps
   - Identify all @Emit methods → convert to defineEmits
   - Identify all data() properties → convert to ref/reactive
   - Identify all methods → convert to regular functions
   - Identify all watchers → convert to watch()
   - Identify all computed → convert to computed()
   - Replace Formulate form with FormContainer + FormFieldConfig array
   - Update lifecycle hooks (created → onMounted, etc)
   - Update this.xxx → props.xxx or state.xxx

5. TESTING:
   - Test form submission
   - Test form validation
   - Test navigation
   - Test computed properties update
   - Test reactive state updates
-->

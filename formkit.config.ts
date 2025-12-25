import { defaultConfig } from '@formkit/vue'
import { fr } from '@formkit/i18n'

/**
 * FormKit Configuration
 *
 * Custom inputs will be registered here once migrated from Vue Formulate:
 * - chips: Multi-entity selection with search
 * - files: File upload/management
 * - medselect: Enhanced select with form creation
 * - void: Empty placeholder component
 *
 * Note: Custom components will be added in Phase 4 (component migration)
 */
export default defaultConfig({
  locales: { fr },
  locale: 'fr',

  // Custom inputs will be registered here in Phase 4
  inputs: {
    // TODO Phase 4: Register custom FormKit inputs
    // chips: createInput(ChipsInput),
    // files: createInput(FilesInput),
    // medselect: createInput(SelectInput),
    // void: createInput(VoidInput)
  }
})

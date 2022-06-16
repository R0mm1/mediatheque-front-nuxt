import Vue from 'vue'

import VueFormulate from '@braid/vue-formulate'
import Chips from '../components/form/elements/formulate/Chips'
import Files from '../components/form/elements/formulate/Files'
import Select from '../components/form/elements/formulate/Select'
import Void from '../components/form/elements/formulate/Void'

Vue.component('Chips', Chips)
Vue.component('Files', Files)
Vue.component('Select', Select)
Vue.component('Void', Void)

Vue.use(VueFormulate, {
  library: {
    chips: {
      classification: 'chips',
      component: Chips,
      slotProps: {
        component: ['entities', 'entityFields', 'fieldsSeparator', 'formCreationValidationAction', 'formCreationTitle', 'searchFieldPlaceholder', 'searchParam', 'entityURI', 'formCreationSchema', 'editModeOn']
      }
    },
    files: {
      classification: 'files',
      component: Files,
      slotProps: {
        component: ['name', 'maxFiles', 'downloadAction', 'files', 'onFileAdded', 'onFileRemoved']
      }
    },
    medselect: {
      classification: 'select',
      component: Select,
      slotProps: {
        component: ['editModeOn', 'selectOptions', 'formCreationValidationAction', 'formCreationTitle', 'formCreationSchema']
      }
    },
    void: {
      component: Void
    }
  }
})

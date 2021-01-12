import Vue from 'vue'

import VueFormulate from '@braid/vue-formulate'
import Chips from '../components/form/elements/formulate/Chips'
import Files from '../components/form/elements/formulate/Files'

Vue.component('Chips', Chips)
Vue.component('Files', Files)

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
    }
  }
})

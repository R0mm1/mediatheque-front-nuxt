<template>
  <client-only>
    <Group id="groupBookSummary">
      <template v-slot:group_name>
        Résumé
      </template>

      <template v-slot:group_content>
        <MedWysiwyg
          id="wysiwygSummary"
          name="summary"
          :no-label="true"
          :content="summary"
          :edit-mode-on="editModeOn"
          @content-changed="summaryChanged"
        />
      </template>
    </Group>
  </client-only>
</template>

<script>
import Group from '@/components/page/Group'
import MedWysiwyg from '~/components/form/elements/MedWysiwyg'

export default {
  name: 'GroupSummary',
  components: { MedWysiwyg, Group },
  props: { bookModule: { type: Object, required: true }, editModeOn: { type: Boolean, required: false, default: true } },
  computed: {
    summary () {
      let summary = this.bookModule.book.summary
      if (summary === null) {
        summary = ''
      }
      return summary
    }
  },
  methods: {
    summaryChanged (newContent) {
      this.bookModule.setSummary(newContent)
    }
  }
}
</script>

<style lang="scss">
    #groupBookSummary {
        #wysiwygSummary {
            .ck.ck-editor {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .ck.ck-editor__main {
                flex: 1;
            }

            .ck.ck-content {
                height: 100%;
            }
        }
    }
</style>

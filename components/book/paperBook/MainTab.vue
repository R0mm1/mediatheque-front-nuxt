<template>
  <div id="book-main-tab">
    <GroupPicture :book-module="bookModule" :edit-mode-on="editModeOn" />
    <GroupSummary :book-module="bookModule" :edit-mode-on="editModeOn" class="groupSummary">
      <template #summary_customActions>
        <MedInputButton v-if="editModeOn" :button-descriptor="displayOcrPopupButtonDescriptor" @click.native="isOcrPopupStateOpened = !isOcrPopupStateOpened" />
      </template>
    </GroupSummary>
    <Column class="third-col">
      <template #column_content>
        <PaperGroupInformation :edit-mode-on="editModeOn" />
        <GroupReferences :book-module="bookModule" :edit-mode-on="editModeOn" @group-wanna-open-book="onGroupWannaOpenBook" />
      </template>
    </Column>
    <BookEditPopupOcrSummary
      :is-displayed="isOcrPopupDisplayed"
      @summary-updated="isOcrPopupStateOpened = false"
      @cancel="isOcrPopupStateOpened = false"
    />
  </div>
</template>

<script>
import GroupPicture from '../groups/mainTab/GroupPicture'
import GroupSummary from '../groups/mainTab/GroupSummary'
import GroupReferences from '../groups/mainTab/GroupReferences'
import Column from '@/components/page/Column'
import PaperGroupInformation from '~/components/book/paperBook/groups/PaperGroupInformation'
import BookEditPopupOcrSummary from '~/components/book/paperBook/BookEditPopupOcrSummary'
import MedInputButton from '~/components/form/elements/MedInputButton'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

export default {
  name: 'MainTab',
  components: {
    PaperGroupInformation,
    Column,
    GroupReferences,
    GroupSummary,
    GroupPicture,
    BookEditPopupOcrSummary,
    MedInputButton
  },
  props: {
    bookModule: {
      type: Object,
      required: true
    },
    editModeOn: {
      type: Boolean,
      required: true
    }
  },
  data: () => {
    return {
      isOcrPopupStateOpened: false
    }
  },
  computed: {
    isOcrPopupDisplayed () {
      return this.editModeOn && this.isOcrPopupStateOpened
    },
    displayOcrPopupButtonDescriptor () {
      return new ButtonDescriptor('displayOcrPopup').setFaIcon('far fa-eye')
    }
  },
  methods: {
    onGroupWannaOpenBook (bookId) {
      this.$emit('tab-wanna-open-book', bookId)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/breakpoints";

#book-main-tab{
  display: flex;
  position: relative;
}

.group_picture {
  width: 160px;

  @include phone-portrait {
    width: initial;
  }
}

.groupSummary {
  flex: 1;
}

.groupInformation {
  max-width: 500px;
}

.third-col{
  width: 550px;
}
</style>

<style lang="scss">
.book_main_tab .groupInformation {
  .group_content > .form_element > label {
    width: 50% !important;
    max-width: 150px !important;
  }

  .form_element_files {
    flex-direction: column;
  }
}
</style>

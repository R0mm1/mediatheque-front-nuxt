<template>
  <div id="book-main-tab">
    <GroupPicture :book-module="bookModule" />
    <GroupSummary :book-module="bookModule" :edit-mode-on="editModeOn" class="groupSummary" />
    <Column class="third-col">
      <template v-slot:column_content>
        <PaperGroupInformation :edit-mode-on="editModeOn" />
        <GroupReferences :book-module="bookModule" @group-wanna-open-book="onGroupWannaOpenBook" />
      </template>
    </Column>
  </div>
</template>

<script>
import Column from '@/components/page/Column'
import GroupPicture from '../groups/mainTab/GroupPicture'
import GroupSummary from '../groups/mainTab/GroupSummary'
import GroupReferences from '../groups/mainTab/GroupReferences'
import PaperGroupInformation from '~/components/book/paperBook/groups/PaperGroupInformation'

export default {
  name: 'MainTab',
  components: {
    PaperGroupInformation,
    Column,
    GroupReferences,
    GroupSummary,
    GroupPicture
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

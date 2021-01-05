<template>
  <div class="widget_accordion">
    <div v-for="bloc in blocs" :key="bloc.slotId">
      <div class="bloc_title">
        <div
          class="bloc_toggle"
          :class="{bloc_closed: isClosed(bloc.slotId)}"
          @click="toggleBloc(bloc.slotId)"
        >
          <i class="fas fa-caret-up" />
        </div>

        {{ bloc.title }}
      </div>
      <div class="bloc_content" :class="{bloc_closed: isClosed(bloc.slotId)}">
        <slot :name="bloc.slotId" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  props: {
    blocs: { type: Array, default: () => [] }
  },
  data: () => {
    return {
      closedBlocs: {}
    }
  },
  methods: {
    toggleBloc (slotId) {
      let isClosed = this.closedBlocs[slotId]
      if (typeof isClosed === 'undefined') { isClosed = false }
      this.$set(this.closedBlocs, slotId, !isClosed)
    },
    isClosed (slotId) {
      if (typeof this.closedBlocs[slotId] === 'undefined') { return false }
      return this.closedBlocs[slotId]
    }
  }
}

/**
     * Object representing a bloc of the accordion
     * @param title string
     * @param slotId string
     */
const AccordionBloc = function (title, slotId) {
  this.title = title
  this.slotId = slotId
}

export { AccordionBloc }
</script>

<style scoped lang="scss">
    .bloc_title {
        position: relative;
        background-color: #e4dccc;
        padding: 3px;
        margin-bottom: 3px;

        &:nth-child(n+1) {
            margin-top: 3px;
        }

        .bloc_toggle {
            position: absolute;
            right: 10px;
            transition: transform .3s;

            &.bloc_closed {
                transform: rotate(180deg);
            }
        }
    }

    .bloc_content{
        max-height: 500px;
        transition: max-height .3s;
        overflow: hidden;

        &.bloc_closed {
            max-height: 0;
        }
    }
</style>

<template>
  <div class="widget_accordion">
    <div v-for="(bloc, index) in blocs" :key="bloc.slotId" class="accordion_bloc">
      <div class="bloc_title" :class="{bloc_closed: isClosed(index)}">
        <div class="title_label">
          {{ bloc.title }}
        </div>

        <div class="title_buttons">
          <MedInputButton :button-descriptor="getToggleButtonDescriptor(index)" @click.native="toggleBloc(index)" />
        </div>
      </div>
      <div class="bloc_content" :class="{bloc_closed: isClosed(index)}">
        <slot :name="bloc.slotId" />
      </div>
    </div>
  </div>
</template>

<script>
import MedInputButton from '~/components/form/elements/MedInputButton'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
export default {
  name: 'Accordion',
  components: { MedInputButton },
  props: {
    blocs: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    return {
      closedBlocs: {},
      blocsData: {}
    }
  },
  watch: {
    blocs () {
      this.blocsData = this.blocs
    }
  },
  created () {
    this.blocsData = this.blocs
  },
  methods: {
    getToggleButtonDescriptor (index) {
      const bloc = this.blocsData[index]
      const direction = bloc.opened ? 'down' : 'up'
      return new ButtonDescriptor('toggle_' + index).setFaIcon('fas fa-caret-' + direction)
    },
    toggleBloc (index) {
      const bloc = this.blocsData[index]
      bloc.opened = !bloc.opened
      this.$set(this.blocsData, index, bloc)
      const event = 'bloc-' + (bloc.opened ? 'opened' : 'closed')
      this.$emit(event, bloc)
    },
    isClosed (index) {
      return !this.blocsData[index].opened
    }
  }
}

/**
 * Object representing a bloc of the accordion
 * @param title string
 * @param slotId string
 * @param opened boolean|undefined
 */
const AccordionBloc = function (title, slotId, opened) {
  this.title = title
  this.slotId = slotId
  this.opened = typeof opened === 'undefined' ? true : opened
}

export { AccordionBloc }
</script>

<style scoped lang="scss">
@import "assets/scss/colors";

.accordion_bloc{
  border: 1px solid $shade0;
  border-radius: 5px;
  padding: 5px 3px;
  margin-bottom: 3px;

  &:nth-child(n+1) {
    margin-top: 3px;
  }

  .bloc_title {
    position: relative;
    font-size: 1.2rem;
    height: 1.4rem;
    line-height: 1.4rem;
    transition: font-size .3s;
    display: flex;

    &.bloc_closed{
      font-size: 1rem;
    }

    .title_label{
      flex-grow: 1;
    }

    &:deep(.formulate-input) {
      margin: auto;

      button {
        height: 1.4rem;
        width: 1.4rem;
        line-height: 1.4rem;
        font-size: .8rem !important;
        padding: initial !important;
      }
    }
  }

  .bloc_content {
    max-height: 500px;
    transition: all .3s;
    overflow: hidden;
    padding-left: 5px;
    margin-top: 10px;

    img{
      width: 24px;
    }

    &.bloc_closed {
      max-height: 0;
      margin-top: 0;
    }
  }
}
</style>

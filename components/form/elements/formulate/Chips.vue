<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <template v-if="!editModeOn">
      <div v-for="(entity) in entities" :key="entity.id" class="entity-readonly">
        {{ getEntityLabel(entity) }}
      </div>
    </template>

    <template v-if="editModeOn">
      <div class="entities">
        <div v-for="(entity, index) in entities" :key="entity.id" class="entity">
          <div class="entity_label">
            {{ getEntityLabel(entity) }}
          </div>
          <div class="entity_delete" @click="removeEntity(index)">
            <div class="fas fa-times" />
          </div>
        </div>
      </div>

      <div v-click-outside="closeProposalsList" class="search_container" :class="{search_active: isProposalsDisplayed}">
        <div class="search_inputs">
          <MedInputText v-model="searchString" :text-descriptor="searchFieldDescriptor" @click.native="openProposalsList" />
          <MedInputButton v-if="isCreationAvailable" :button-descriptor="buttonAddDescriptor" @click.native="openFormCreation" />
        </div>

        <div v-if="isProposalsDisplayed" class="search_results">
          <div v-if="searchString.length < 3 && !isFormCreationDisplayed" class="search_notice">
            Entrez au moins trois caractères
          </div>
          <div v-if="searching === true" class="search_loading">
            <Loader type="s" />
          </div>

          <div v-if="searchString.length >= 3 && searching === false">
            <ul>
              <li v-for="(proposal) in proposals" :key="proposal.id" @click="addEntity(proposal)">
                {{ getEntityLabel(proposal) }}
              </li>
            </ul>
            <div class="count_results">
              {{ countProposals }} résultat(s)
            </div>
          </div>

          <div v-if="isFormCreationDisplayed" class="creation_container">
            <FormContainer :validate-action="formCreationSubmit" :cancel-action="closeFormCreation">
              <template v-slot:form_title>
                {{ formCreationTitle }}
              </template>
              <template v-slot:form_body>
                <FormulateForm v-model="formCreationData" :schema="formCreationSchema" />
                <slot name="form_creation_body" />
              </template>
            </FormContainer>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ClickOutside from 'vue-click-outside'
import RequestService from '@/assets/ts/service/RequestService'
import { container } from 'tsyringe'
import MedInputText from '~/components/form/elements/MedInputText.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import Loader from '~/components/widgets/Loader.vue'
import FormContainer from '~/components/form/FormContainer.vue'

const requestService = container.resolve(RequestService)

@Component({
  components: { FormContainer, Loader, MedInputButton, MedInputText },
  directives: { 'click-outside': ClickOutside }
})
export default class Chips extends Vue {
  @Prop({ type: Object, required: true }) context!: any;

  @Prop({ type: Array, required: true }) entities!:any[];

  @Prop({ type: Array, required: true }) entityFields!:string[];

  @Prop({ type: String, required: false, default: ' ' }) fieldsSeparator!:string;

  @Prop({ type: Boolean, required: false, default: true }) editModeOn!:boolean;

  getEntityLabel (entity: any) {
    const elements:any[] = []
    this.entityFields.forEach((field: string) => {
      if (entity[field]) {
        elements.push(entity[field])
      }
    })
    return elements.join(this.fieldsSeparator)
  }

  // --- Stuff for creation of a new entity --- //

  isFormCreationDisplayed= false;
  formCreationData: {[index: string]: any} = {};

  @Prop({ type: Function, required: false, default: null })formCreationValidationAction!:null|((formCreationData:any)=>Promise<any>);
  @Prop({ type: String, required: false, default: '' })formCreationTitle!:string;
  @Prop({ type: Array, required: false, default: () => [] })formCreationSchema!:any[];

  get isCreationAvailable () {
    return (typeof this.formCreationValidationAction === 'function')
  }

  get buttonAddDescriptor () {
    const descriptor = new ButtonDescriptor('searchCreate')
    return descriptor
      .setFaIcon('fas fa-plus')
      .addCustomClass('btnSearchCreate')
  }

  openFormCreation () {
    this.searchString = ''
    this.isProposalsDisplayed = true
    this.isFormCreationDisplayed = true
  }

  formCreationSubmit () {
    if (typeof this.formCreationValidationAction === 'function') {
      this.formCreationValidationAction(this.formCreationData).then(() => {
        this.formCreationData = {}
      })
    }
    this.closeFormCreation()
  }

  closeFormCreation () {
    this.isFormCreationDisplayed = false
    this.isProposalsDisplayed = false
  }

  // --- Remove an entity from the list --- //

  removeEntity (indexInArray: any) {
    // todo: https://vueformulate.com/guide/inputs/custom-inputs/#custom-events
    this.$parent.$emit('entity-removed', this.entities[indexInArray])
  }

  // --- Search existing entity and add it --- //

  @Prop({ type: String, required: true }) searchFieldPlaceholder!:string;
  @Prop({ type: String, required: true }) searchParam!:string;
  @Prop({ type: String, required: true }) entityURI!:string;

  searching= false;
  searchString: string = '';
  isProposalsDisplayed= false;
  proposals= {};

  get searchFieldDescriptor () {
    return new TextDescriptor('searchValue').setPlaceholder(this.searchFieldPlaceholder)
  }

  get countProposals () {
    return Object.keys(this.proposals).length
  }

  @Watch('searchString')searchStringChanged (newVal:string) {
    if (newVal.length >= 3) {
      this.isFormCreationDisplayed = false
      this.searching = true
      const data: {[index: string]: string} = {}
      data[this.searchParam] = newVal

      const request = requestService.createRequest(this.entityURI)
        .setQueryParams(data)

      return requestService.execute(request)
        .then((response) => {
          this.proposals = {}
          response['hydra:member'].forEach((entity: any) => {
            Vue.set(this.proposals, entity.id, entity)
          })
          this.searching = false
        })
        .catch(() => {
          alert('Une erreur est survenue')
          this.searching = false
        })
    }
  }

  openProposalsList () {
    this.isProposalsDisplayed = true
  }

  closeProposalsList () {
    this.isProposalsDisplayed = false
    this.isFormCreationDisplayed = false
  }

  addEntity (entity: any) {
    this.closeProposalsList()
    this.searchString = ''
    // todo: https://vueformulate.com/guide/inputs/custom-inputs/#custom-events
    this.$parent.$emit('entity-added', entity)
  }
}
</script>

<style scoped>

</style>

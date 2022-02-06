<template>
  <FormElement
    :label="entitiesDescriptor.label"
    :name="entitiesDescriptor.name"
    container-custom-classes="form_element_entities"
    label-custom-classes="entities_label"
  >
    <template #element_content>
      <div v-for="(entity, index) in entitiesDescriptor.entities" :key="entity.id" class="entity">
        <div class="entity_label">
          {{ getEntityLabel(entity) }}
        </div>
        <div class="entity_delete" @click="removeEntity(index)">
          <div class="fas fa-times" />
        </div>
      </div>

      <div class="search_container_placeholder">
        <div class="search_container" :class="{search_active: isProposalsDisplayed}">
          <div class="search_inputs">
            <MedInputText v-model="searchString" :text-descriptor="searchFieldDescriptor" @click.native="openProposalsList" />
            <MedInputButton v-if="isCreationAvailable" :button-descriptor="buttonAddDescriptor" @click.native="openFormCreation" />
          <!--          <InputText-->
          <!--            v-model="searchString"-->
          <!--            name="searchValue"-->
          <!--            :no-label="true"-->
          <!--            :placeholder="searchFieldPlaceholder"-->
          <!--            @click.native="openProposalsList"-->
          <!--          />-->
          <!--          <Button-->
          <!--            v-if="isCreationAvailable"-->
          <!--            :button-descriptor="buttonAddDescriptor"-->
          <!--            @click.native="openFormCreation"-->
          <!--          />-->
          </div>

          <div v-if="isProposalsDisplayed" v-click-outside="closeProposalsList" class="search_results">
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
              <FormContainer :validate-action="formCreationSubmited" :cancel-action="closeFormCreation">
                <template #form_title>
                  {{ entitiesDescriptor.formCreationTitle }}
                </template>
                <template #form_body>
                  <slot name="form_creation_body" />
                </template>
              </FormContainer>
            </div>
          </div>
        </div>
      </div>
    </template>
  </FormElement>
</template>

<script lang="ts">

import { container } from 'tsyringe'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ClickOutside from 'vue-click-outside'
import EntitiesDescriptor from '@/assets/ts/form/EntitiesDescriptor'
import MedInputText from '@/components/form/elements/MedInputText.vue'
import RequestService from '@/assets/ts/service/RequestService'
import Loader from '@/components/widgets/Loader.vue'
import ButtonDescriptor from '@/assets/ts/form/ButtonDescriptor'
import TextDescriptor from '@/assets/ts/form/TextDescriptor'
import MedInputButton from '@/components/form/elements/MedInputButton.vue'
import FormContainer from '@/components/form/FormContainer.vue'

@Component({
  components: { FormContainer, MedInputButton, MedInputText, Loader },
  directives: { 'click-outside': ClickOutside }
})
export default class MedEntities extends Vue {
  @Prop({ type: Object, required: true }) entitiesDescriptor!:EntitiesDescriptor

  proposals = {}
  isProposalsDisplayed = false
  isFormCreationDisplayed = false
  searchString = ''
  searching = false
  entities = []

  get countProposals () {
    return Object.keys(this.proposals).length
  }

  get isCreationAvailable () {
    return (typeof this.entitiesDescriptor.formCreationValidationAction === 'function')
  }

  get searchFieldDescriptor () {
    return new TextDescriptor('searchValue').setPlaceholder(this.entitiesDescriptor.searchFieldPlaceholder)
  }

  get buttonAddDescriptor () {
    const descriptor = new ButtonDescriptor('searchCreate')
    return descriptor
      // .setStyle('negative')
      // .setRoundedCorner(true)
      .setFaIcon('fas fa-plus')
      .addCustomClass('btnSearchCreate')
      // .setIsIconButon(true, 2, 'rem')
  }

  @Watch('searchString')searchStringChanged (newVal: string) {
    if (typeof this.entitiesDescriptor.entityURI === 'undefined') {
      throw new TypeError('Missing entity URI')
    }

    if (typeof this.entitiesDescriptor.searchParam === 'undefined') {
      throw new TypeError('Missing search param')
    }

    if (newVal.length >= 3) {
      this.isFormCreationDisplayed = false
      this.searching = true
      const data: {[index: string]: string} = {}
      data[this.entitiesDescriptor.searchParam] = newVal
      const requestService = container.resolve(RequestService)

      const request = requestService.createRequest(this.entitiesDescriptor.entityURI)
        .setQueryParams(data)

      return requestService.execute<any>(request)
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

  getEntityLabel (entity: any) {
    const elements:any[] = []
    this.entitiesDescriptor.entityFields.forEach((field: string) => {
      if (entity[field]) {
        elements.push(entity[field])
      }
    })
    return elements.join(this.entitiesDescriptor.fieldsSeparator)
  }

  removeEntity (indexInArray: any) {
    this.$emit('entity-removed', this.entitiesDescriptor.entities[indexInArray])
  }

  addEntity (entity: any) {
    this.closeProposalsList()
    this.searchString = ''
    this.$emit('entity-added', entity)
  }

  closeProposalsList () {
    this.isProposalsDisplayed = false
    this.isFormCreationDisplayed = false
  }

  openProposalsList () {
    this.isProposalsDisplayed = true
  }

  formCreationSubmited () {
    if (typeof this.entitiesDescriptor.formCreationValidationAction === 'function') {
      this.entitiesDescriptor.formCreationValidationAction()
    }
    this.closeFormCreation()
  }

  openFormCreation () {
    this.searchString = ''
    this.isProposalsDisplayed = true
    this.isFormCreationDisplayed = true
  }

  closeFormCreation () {
    this.isFormCreationDisplayed = false
    this.isProposalsDisplayed = false
  }
}
</script>

<style lang="scss">

@import "../../../assets/scss/colors";

.form_element_entities {
  .element_content {
    position: relative;
  }

  .entities_label {
    line-height: 2rem;
  }

  .entity {
    display: inline-flex;
    margin-right: 2px;
    transition: all .3s;
    padding: 2px;

    .entity_delete {
      font-size: .9rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 1px 0 3px;
      opacity: 0;
      transition: all .3s;
    }

    &:hover {
      background-color: $shade2;

      .entity_delete {
        opacity: 1;
      }
    }
  }

  .search_container_placeholder {
    height: 2rem;
  }

  .search_container {
    position: absolute;
    width: 100%;

    &.search_active {
      box-shadow: 0 0 15px 5px rgba(0, 0, 0, .1);
    }

    .form_element_text {
      margin: 3px 0 0 0;
    }

    .search_inputs {
      display: flex;

      .form_element_text {
        flex: 1;
      }
    }

    .search_results {

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;

        li {
          padding: 5px;
        }

        li:hover {
          background-color: $shade1;
        }
      }

      .count_results {
        font-size: .8rem;
        font-style: italic;
        text-align: right;
        margin: 3px;
      }
    }

    .search_notice {
      font-size: .9rem;
      text-align: center;
      margin: 5px 0px;
    }

    .search_loading {
      display: flex;
      justify-content: center;

      img {
        width: 25px;
        margin: 5px;
      }
    }
  }

  .creation_container {
    padding: 2px;
  }

}

</style>

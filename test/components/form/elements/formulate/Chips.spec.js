import 'reflect-metadata'
import { shallowMount } from '@vue/test-utils'
import Chips from '@/components/form/elements/formulate/Chips'

describe('Chips', () => {
  // A component with all the props specified
  const wrapperFullProps = shallowMount(Chips, {
    propsData: {
      context: {
        type: 'chips'
      },
      entities: [
        {
          firstname: 'John',
          lastname: 'Doe'
        },
        {
          firstname: 'Jane',
          lastname: 'Doe'
        }
      ],
      entityFields: ['firstname', 'lastname'],
      fieldsSeparator: '-',
      editModeOn: true,
      formCreationValidationAction: () => Promise.resolve('done'),
      formCreationTitle: 'Add new author',
      formCreationSchema: [
        {
          type: 'text',
          label: 'Prénom',
          name: 'firstname'
        },
        {
          type: 'text',
          label: 'Nom',
          name: 'lastname'
        }
      ],
      searchFieldPlaceholder: 'Rechercher un auteur',
      searchParam: 'authorFullname',
      entityURI: '/authors'
    }
  })

  // A component with only the required props specified
  const wrapperRequiredProps = shallowMount(Chips, {
    propsData: {
      context: {
        type: 'chips'
      },
      entities: [
        {
          firstname: 'John',
          lastname: 'Doe'
        },
        {
          firstname: 'Jane',
          lastname: 'Doe'
        }
      ],
      entityFields: ['firstname', 'lastname'],
      searchFieldPlaceholder: 'Rechercher un auteur',
      searchParam: 'authorFullname',
      entityURI: '/authors'
    }
  })

  test('is a Vue instance when specifying all props', () => {
    expect(wrapperFullProps.vm).toBeTruthy()
  })

  test('is a Vue instance when specifying only required props', () => {
    expect(wrapperRequiredProps.vm).toBeTruthy()
  })

  test('is rendering correctly when specifying all props', () => {
    expect(wrapperFullProps.element).toMatchSnapshot()
  })

  test('is rendering correctly when specifying only required props', () => {
    expect(wrapperRequiredProps.element).toMatchSnapshot()
  })
})

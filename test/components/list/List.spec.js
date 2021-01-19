import 'reflect-metadata'
import VueRouter from 'vue-router'
import List from '@/components/list/List'
import { createLocalVue, mount } from '@vue/test-utils'
import '~/plugins/vueFormulate'
import { container } from 'tsyringe'
import Column from '~/assets/ts/list/Column'
import DataSubProperty from '~/assets/ts/list/DataSubProperty'
import LeftActionBarProperties from '~/assets/ts/list/LeftActionBarProperties'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import LeftActionBarSeparatorDescriptor from '~/assets/ts/list/LeftActionBarSeparatorDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import LeftActionBarFormSelectDescriptor from '~/assets/ts/list/LeftActionBarFormSelectDescriptor'
import RowAction from '~/assets/ts/list/RowAction'
import BookService from '~/assets/ts/service/BookService'
import AuthenticationService from '~/assets/ts/service/AuthenticationService'
import RequestService from '~/assets/ts/service/RequestService'

jest.mock('~/assets/ts/objects/Navigator')
jest.mock('~/assets/ts/service/AuthenticationService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      isLoggedIn: jest.fn().mockReturnValue(true),
      getToken: jest.fn().mockReturnValue('123')
    }
  })
})

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const axiosMock = new MockAdapter(axios)

describe('List', () => {
  const authenticationService = container.resolve(AuthenticationService)
  container.registerInstance(AuthenticationService, authenticationService)

  axiosMock.onGet(/.*\/books$/).reply(200, {
    '@context': '/api/contexts/Book',
    '@id': '/api/books',
    '@type': 'hydra:Collection',
    'hydra:member': [
      {
        '@id': '/api/electronic_books/39',
        '@type': 'ElectronicBook',
        id: 39,
        title: 'Sharko',
        year: '2017',
        language: 'Français',
        authors: [
          {
            '@id': '/api/authors/1',
            '@type': 'Author',
            id: 1,
            firstname: 'Franck',
            lastname: 'Thilliez'
          }
        ],
        shortSummary: 'Lorem ipsum'
      },
      {
        '@id': '/api/paper_books/45',
        '@type': 'PaperBook',
        id: 45,
        title: 'Sous les vents de Neptune',
        year: '2004',
        language: 'Français',
        authors: [
          {
            '@id': '/api/authors/5',
            '@type': 'Author',
            id: 5,
            firstname: 'Fred',
            lastname: 'Vargas'
          }
        ],
        shortSummary: 'Bla'
      }
    ]
  })

  const localVue = createLocalVue()
  localVue.use(VueRouter)

  const router = new VueRouter({
    routes: [
      { path: '/current/page', component: { render: () => '-' } }
    ]
  })

  const listWrapper = mount(List, {
    localVue,
    router,
    propsData: {
      apiEndpoint: '/books',
      cols: [
        new Column('title', 'Titre'),
        new Column('year', 'Année'),
        new Column('language', 'Langue'),
        new Column('authors', 'Auteurs')
          .setSearchParameterName('authorFullname')
          .setSubProperties([
            new DataSubProperty('firstname'),
            new DataSubProperty('lastname')
          ])
      ],
      leftActionBarProperties: new LeftActionBarProperties([
        new LeftActionBarElement(
          'separator',
          () => null,
          new LeftActionBarSeparatorDescriptor('add').setLabel('Ajouter').setFaIcon('fas fa-plus')
        ),
        new LeftActionBarElement(
          'element',
          () => null,
          new ButtonDescriptor('addPaper', 'Livre papier').setFaIcon('fas fa-scroll').setNoDefaultStyle(true)
        ),
        new LeftActionBarElement(
          'element',
          () => null,
          new ButtonDescriptor('addElectronic', 'Epub').setFaIcon('fas fa-tablet-alt').setNoDefaultStyle(true)
        ),
        new LeftActionBarElement(
          'separator',
          () => null,
          new LeftActionBarSeparatorDescriptor('filters').setLabel('Filtres').setFaIcon('fas fa-sliders-h')
        ),
        new LeftActionBarElement(
          'filter',
          () => null,
          new LeftActionBarFormSelectDescriptor('bookType', {
            all: 'Tous',
            paper: 'Papier',
            electronic: 'Epub'
          }).setDefaultValue('all').setFaIcon('fas fa-book').setNoDefaultStyle(true)
        )
      ], false),
      rowActions: [
        new RowAction('download', '', 'fas fa-file-download')
          .setIsDisplayed((book) => {
            return typeof book['@type'] === 'string' && book['@type'] === BookService.bookElectronic
          }),
        new RowAction('delete', '', 'far fa-trash-alt')
          .setNeedConfirm(true, 'Re-cliquez pour confirmer la suppression')
      ],
      detailsComponentPath: 'book/BookListRowDetails.vue'
    },
    data: () => {
      return {
        requestService: container.resolve(RequestService)
      }
    }
  })

  test('is a Vue instance', () => {
    expect(listWrapper.vm).toBeTruthy()
  })

  test('is rendered correctly', () => {
    expect(listWrapper.element).toMatchSnapshot()
  })
})

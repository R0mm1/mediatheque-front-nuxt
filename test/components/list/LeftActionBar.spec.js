import 'reflect-metadata'
import { shallowMount } from '@vue/test-utils'
import '~/plugins/vueFormulate'
import LeftActionBar from '~/components/list/LeftActionBar.vue'
import LeftActionBarProperties from '~/assets/ts/list/LeftActionBarProperties'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import LeftActionBarSeparatorDescriptor from '~/assets/ts/list/LeftActionBarSeparatorDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import LeftActionBarFormSelectDescriptor from '~/assets/ts/list/LeftActionBarFormSelectDescriptor'

describe('LeftActionBar', () => {
  const wrapper = shallowMount(LeftActionBar, {
    propsData: {
      leftActionBarProperties: new LeftActionBarProperties([
        new LeftActionBarElement(
          'separator',
          () => null,
          new LeftActionBarSeparatorDescriptor('customAdds').setLabel('Ajouter').setFaIcon('fas fa-plus')
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
      ], true)
    }
  })

  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('is rendered correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})

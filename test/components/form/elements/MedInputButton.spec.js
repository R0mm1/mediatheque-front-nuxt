import 'reflect-metadata'
import '~/plugins/vueFormulate'
import { shallowMount } from '@vue/test-utils'
import MedInputButton from '@/components/form/elements/MedInputButton'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

describe('MedInputButton', () => {
  const wrapper = shallowMount(MedInputButton, {
    propsData: {
      buttonDescriptor: new ButtonDescriptor('testButton')
    }
  })

  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('is rendering correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})

import 'reflect-metadata'
import { shallowMount } from '@vue/test-utils'
import Files from '@/components/form/elements/formulate/Files'
// import sinon from 'sinon'
import MedFile from '~/assets/ts/objects/MedFile'

describe('Files', () => {
  const wrapperFullProps = shallowMount(Files, {
    propsData: {
      context: {
        type: 'files'
      },
      name: 'electronicBook',
      maxFiles: 1,
      downloadAction: () => null,
      files: [
        new MedFile().setFile('myAwesomeBook.epub').setName('My Awesome Book').setId('123')
      ],
      onFileAdded: () => null,
      onFileRemoved: () => null
    }
  })
  const wrapperRequiredProps = shallowMount(Files, {
    propsData: {
      context: {
        type: 'files'
      },
      files: [
        new MedFile().setFile('myAwesomeBook.epub').setName('My Awesome Book').setId('123')
      ],
      onFileAdded: () => null
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

  test('is triggering click on input file when clicking add button', () => {
    const wrapper = shallowMount(Files, {
      propsData: {
        context: {
          type: 'files'
        },
        files: [],
        onFileAdded: () => null
      }
    })

    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.element).toMatchSnapshot()

    const buttonAddWrapper = wrapper.find('.files_buttons medinputbutton-stub')
    expect(buttonAddWrapper.exists()).toBeTruthy()

    const fileInputWrapper = wrapper.find('input[type="file"]')
    expect(fileInputWrapper.exists()).toBeTruthy()
    const clickInputSpy = jest.spyOn(fileInputWrapper.element, 'click')

    buttonAddWrapper.trigger('click')
    expect(clickInputSpy).toHaveBeenCalledTimes(1)
  })

  test('is calling the given onFileAdded callback when a file is added', () => {
    // const onFileAddedSpy = sinon.spy()
    // const wrapper = shallowMount(Files, {
    //   propsData: {
    //     context: {
    //       type: 'files'
    //     },
    //     files: [],
    //     onFileAdded: onFileAddedSpy
    //   }
    // })
    //
    // const fileInputWrapper = wrapper.find('input[type="file"]')
    // expect(fileInputWrapper.exists()).toBeTruthy()
    // console.log(fileInputWrapper.element.files)
    //
    // const file = new File([], 'myFile.epub')
    // const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()
    // dataTransfer.items.add(file)
    //
    // fileInputWrapper.element.files = dataTransfer.files
    // fileInputWrapper.trigger('change')
    // expect(onFileAddedSpy.calledOnce)
  })
})

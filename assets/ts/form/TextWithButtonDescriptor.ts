import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

export default class TextWithButtonDescriptor {
  textDescriptor: TextDescriptor;
  buttonDescriptor?:ButtonDescriptor;

  withCopyContentButton: boolean = false;

  constructor (textDescriptor: TextDescriptor) {
    this.textDescriptor = textDescriptor
  }

  setButtonDescriptor (buttonDescriptor: ButtonDescriptor) {
    this.buttonDescriptor = buttonDescriptor
    return this
  }

  setWithCopyContentButton (withCopyContentButton: boolean) {
    this.withCopyContentButton = withCopyContentButton
    return this
  }
}

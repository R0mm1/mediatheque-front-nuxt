import { autoInjectable, singleton } from 'tsyringe'

@autoInjectable()
@singleton()
export default class FormService {
  /**
   * Api returns errors as human-readable english messages, and they need to be transformed for translation
   * @param error
   */
  getApiErrorTranslationKey (error: string | undefined): string | undefined {
    if (typeof error === 'string') {
      return 'api.errors.' + error
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('.', '')
    }
    return undefined
  }
}

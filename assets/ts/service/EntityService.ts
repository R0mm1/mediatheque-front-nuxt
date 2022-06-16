export default class EntityService {
  getIri (value: any): string | null {
    if (typeof value === 'string') {
      return value
    } else if (typeof value === 'object' && value !== null) {
      return value['@id'] ?? null
    } else {
      return null
    }
  }
}

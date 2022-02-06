export default class MedFile {
  file: false | File | string = false
  name: string = ''
  id: string|null = null
  isNew: boolean = false

  setFile (file: File|string) {
    this.file = file
    return this
  }

  setName (name: string) {
    this.name = name
    return this
  }

  setId (id: string) {
    this.id = id
    return this
  }

  setIsNew (isNew: boolean) {
    this.isNew = isNew
    return this
  }
}

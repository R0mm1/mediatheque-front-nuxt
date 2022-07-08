import MedFile from '~/assets/ts/objects/MedFile'

export default class FilesDescriptor {
  label: string = ''
  name: string = ''
  maxFiles: number | null = null
  downloadAction: null | (() => any) = null
  onFileAdded: ((medFile: MedFile) => any) = () => null
  onFileRemoved: (() => any) | null = null
  addButtonLabel: string = 'Ajouter'

  setLabel (label: string) {
    this.label = label
    return this
  }

  setName (name: string) {
    this.name = name
    return this
  }

  setMaxFiles (maxFiles: number|null) {
    this.maxFiles = maxFiles
    return this
  }

  setDownloadAction (downloadAction: (()=>any)) {
    this.downloadAction = downloadAction
    return this
  }

  setOnFileAdded (onFileAdded: ((medFile: MedFile)=>any)) {
    this.onFileAdded = onFileAdded
    return this
  }

  setOnFileRemoved (onFileRemoved: (()=>any)) {
    this.onFileRemoved = onFileRemoved
    return this
  }

  setAddButtonLabel (label: string) {
    this.addButtonLabel = label
    return this
  }
}

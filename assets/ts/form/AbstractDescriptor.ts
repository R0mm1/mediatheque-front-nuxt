export default abstract class AbstractDescriptor {
  descriptorType?: string = undefined
  name: string
  label?: string = undefined
  faIcon?: string = undefined

  public constructor (name: string) {
    this.name = name
  }

  setFaIcon (faIcon: string) {
    this.faIcon = faIcon
    return this
  }

  setLabel (label: string) {
    this.label = label
    return this
  }

  setName (name: string) {
    this.name = name
    return this
  }
}

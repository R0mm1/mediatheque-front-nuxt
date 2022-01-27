type targetValues = '_self'|'_blank'|'_parent'|'_top'

export default class ButtonHrefDescriptor {
  href: string;
  target:targetValues = '_self';

  constructor (href: string) {
    this.href = href
  }

  setTarget (target: targetValues) {
    this.target = target
    return this
  }
}

/**
 * Object representing a file
 * @param file File
 * @param name string
 * @param id string
 * @param isNew bool
 */
const MedFile = function (file, name, id, isNew) {
  this.file = (typeof file === 'undefined') ? false : file
  this.name = (typeof name === 'undefined') ? '' : name
  this.id = id || +new Date()
  this.isNew = (typeof isNew === 'undefined') ? false : isNew
}

export default MedFile

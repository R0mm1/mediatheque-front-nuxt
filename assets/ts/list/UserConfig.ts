export interface UserColumnConfig{
  dataField: string,
  isDisplayed: boolean
}

export default interface UserConfig{
  columns: UserColumnConfig[]
}

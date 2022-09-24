export interface UserColumnConfig{
  uid: string,
  isDisplayed: boolean
}

export default interface UserConfig{
  columns: UserColumnConfig[]
}

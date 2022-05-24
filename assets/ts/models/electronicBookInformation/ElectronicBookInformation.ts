import { ImageItem } from '~/assets/ts/models/electronicBookInformation/Image'
import { HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface ElectronicBookInformation{
  id?:string
  title?:string
  images?:ImageItem[]
}

export interface ElectronicBookInformationItem extends ElectronicBookInformation, HydraItem{}

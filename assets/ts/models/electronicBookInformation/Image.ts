import { HydraItem } from '~/assets/ts/models/HydraInterfaces'

export type ImageType = 'COVER' | 'IMAGE'

export interface Image {
  id?: string
  name?: string
  type?: ImageType
}

export interface ImageItem extends Image, HydraItem {
}

import { HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface FileDownloadToken {
  token: string
}

export interface FileDownloadTokenItem extends FileDownloadToken, HydraItem {
}

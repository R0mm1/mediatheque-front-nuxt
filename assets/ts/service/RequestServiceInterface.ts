import { Method } from 'axios'
import Request from '~/assets/ts/objects/Request'

export interface ExecuteOptionsInterface {
  requestCredentialsIfUnauthorized?: boolean
  skipAuthentication?: boolean,
  skipCommonUrlBase?: boolean
}

export default interface RequestServiceInterface{
  createRequest (url: string, method: Method) :Request

  execute (request: Request, options: ExecuteOptionsInterface) :any

  sendFile (file: File, url:string, requestCredentialsIfUnauthorized: boolean):any
}

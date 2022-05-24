import { Method } from 'axios'
import Request from '~/assets/ts/objects/Request'

export default interface RequestServiceInterface{
  createRequest (url: string, method: Method) :Request

  execute (request: Request) :any

  sendFile (file: File, url:string, fieldName: string):any
}

import { AxiosResponse } from 'axios'
import { QueryParamsInterface } from '~/assets/ts/objects/Request'

export default interface RequestInterface{

  getMethod():string

  getUrl():string

  setBody(body: any):this

  getBody():any

  setQueryParams(queryParams: QueryParamsInterface):this

  addHeader(name: string, value: string, replaceIfExists: boolean):this

  removeHeader (name: string): this

  getHeaders(): { [index: string]:string }

  setSkipUrlBuilding (skipUrlBuilding: boolean): this

  trigger<ExpectedResponseType>():Promise<AxiosResponse<ExpectedResponseType>>
}

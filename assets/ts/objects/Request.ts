import axios, { Method, AxiosRequestConfig, ResponseType } from 'axios'
import RequestInterface from '~/assets/ts/objects/RequestInterface'

export interface QueryParamsInterface {
  [index: string]: string | number | QueryParamsInterface;
}

export default class Request implements RequestInterface {
  protected headers: { [index: string]: string } = { 'Content-Type': 'application/json' };

  protected method: Method;

  protected body: any;

  protected skipUrlBuilding = false;

  protected url: string;

  protected queryParams: QueryParamsInterface = {};

  protected baseUrl: string | undefined;

  protected responseType: ResponseType = 'json'

  constructor (url: string, method: Method = 'GET') {
    this.url = url
    this.method = method
  }

  getMethod () {
    return this.method
  }

  getUrl () {
    return this.url
  }

  setBody (body: any) {
    this.body = body
    return this
  }

  getBody () {
    return this.body
  }

  setQueryParams (queryParams: QueryParamsInterface) {
    this.queryParams = queryParams
    return this
  }

  addHeader (name: string, value: string) {
    this.headers[name] = value
    return this
  }

  removeHeader (name: string) {
    delete this.headers[name]
    return this
  }

  getHeaders () {
    return this.headers
  }

  setSkipUrlBuilding (skipUrlBuilding: boolean) {
    this.skipUrlBuilding = skipUrlBuilding
    return this
  }

  setBaseUrl (baseUrl: string) {
    this.baseUrl = baseUrl
    return this
  }

  setResponseType (responseType: ResponseType) {
    this.responseType = responseType
    return this
  }

  trigger<ExpectedReturnType> () {
    const axiosOptions: AxiosRequestConfig = {
      url: this.url,
      method: this.method,
      data: this.body,
      params: this.queryParams,
      headers: this.headers,
      responseType: this.responseType
    }

    if (typeof this.baseUrl !== 'undefined') {
      axiosOptions.baseURL = this.baseUrl
    }

    return axios.request<ExpectedReturnType>(axiosOptions)
  }
}

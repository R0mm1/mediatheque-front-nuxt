const config = require('../../../mediatheque.json')

export default class UrlBuilder {
    protected queryParams: UrlBuilderQueryParamInterface = {};

    protected url: string;

    protected skipCommonUrlBase: boolean = false;

    constructor (url: string) {
      this.url = url
    }

    setSkipCommonUrlBase (skipCommonUrlBase: boolean) {
      this.skipCommonUrlBase = skipCommonUrlBase
      return this
    }

    setQueryParams (queryParams: UrlBuilderQueryParamInterface) {
      this.queryParams = queryParams
    }

    getUrl () {
      return this.url
    }

    buildUrl () {
      const oUrl = new URL(
        (this.skipCommonUrlBase ? '' : config.api.commonUrlBase) + this.url,
        'http://' + config.api.endpoint
      )

      Object.keys(this.queryParams).forEach((paramName) => {
        const value = this.queryParams[paramName]

        if (typeof value === 'object') {
          Object.keys(value).forEach((propertyName) => {
            oUrl.searchParams.append(paramName + '[' + propertyName + ']', (value as any)[propertyName])
          })
        } else {
          const formattedValue: string = (typeof value === 'number') ? value.toString() : value
          oUrl.searchParams.append(paramName, formattedValue)
        }
      })

      return oUrl.toString()
    }
}

const PaginationHelper = {
  rawResponse: [],

  setRawResponse (rawResponse) {
    this.rawResponse = rawResponse
  },

  getPageNumber () {
    try {
      return Number(this.rawResponse['hydra:view']['hydra:last'].split('page=')[1].split('&')[0])
    } catch (e) {
      console.error(e)
      throw new Error('An error occurred when trying to extract page number from the response')
    }
  },

  hasPagination () {
    return (
      typeof this.rawResponse['hydra:view'] !== 'undefined' &&
            typeof this.rawResponse['hydra:view']['hydra:last'] !== 'undefined'
    )
  }
}

export default PaginationHelper

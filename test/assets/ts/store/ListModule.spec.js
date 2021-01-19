import 'reflect-metadata'
import listModule from '~/assets/ts/store/ListModule'
import Column from '~/assets/ts/list/Column'
import DataSubProperty from '~/assets/ts/list/DataSubProperty'
import Filter from '~/assets/ts/list/Filter'

describe('ListModule', function () {
  const columns = [
    new Column('title', 'Titre'),
    new Column('year', 'Année'),
    new Column('language', 'Langue'),
    new Column('authors', 'Auteurs')
      .setSearchParameterName('authorFullname')
      .setSubProperties([
        new DataSubProperty('firstname'),
        new DataSubProperty('lastname')
      ])
  ]

  const customFilters = [
    new Filter('bookType', 'electronic'),
    new Filter('otherCustomFilter', 'customFilterValue')
  ]

  test('is handling new columns', () => {
    // Check the module is clean to start the test
    expect(Object.keys(listModule.columns)).toHaveLength(0)

    // Check the columns are correctly added
    columns.forEach((column) => {
      listModule.setColumn(column)
    })

    expect(Object.keys(listModule.columns)).toHaveLength(columns.length)
    Object.entries(listModule.columns).forEach(([columnDataField, column]) => {
      const initialColumn = columns.find(columnFromArray => columnFromArray.dataField === columnDataField)
      expect(initialColumn).not.toBeUndefined()
      expect(initialColumn).toEqual(column)
    })

    // Check column modification is correctly handled
    columns[0].dataField = 'theTitle'
    listModule.setColumn(columns[0])
    expect(listModule.columns[columns[0].dataField]).toBeDefined()
    expect(listModule.columns[columns[0].dataField]).toEqual(columns[0])
  })

  test('is handling sort state changes', () => {
    const dataField = columns[0].dataField

    // Check the column exists
    expect(listModule.columns[dataField]).toBeDefined()

    // Check modifications to the sort state are handled
    listModule.handleSortState({
      dataField,
      sortState: 'DESC'
    })
    expect(listModule.columns[dataField].sortState).toEqual('DESC')
    listModule.handleSortState({
      dataField,
      sortState: 'ASC'
    })
    expect(listModule.columns[dataField].sortState).toEqual('ASC')

    // Check an error is thrown when changing the sort state of an non-existent data field
    expect(() => listModule.handleSortState({
      dataField: 'thisDataFieldDoesNotExist',
      sortState: 'ASC'
    })).toThrow()

    // Check that using an invalid sort state is not affecting the column
    const previousState = listModule.columns[dataField].sortState
    listModule.handleSortState({
      dataField,
      sortState: '123'
    })
    expect(listModule.columns[dataField].sortState).toEqual(previousState)
  })

  test('is handling custom filters', () => {
    // Check the custom filters are correctly handled
    listModule.setCustomFilters(customFilters)
    expect(listModule._customFilters).toEqual(customFilters)
    expect(listModule._customFilters).toHaveLength(2)

    // Check the unique filter change also works
    listModule.setCustomFilter(new Filter('anotherCustomFilter', 'Another custom filter'))
    expect(listModule._customFilters).toHaveLength(3)

    // Check the unique filter method doesn't make duplicates
    const newFilterBookType = new Filter('bookType', 'paper')
    listModule.setCustomFilter(newFilterBookType)
    expect(listModule._customFilters).toHaveLength(3)
    const bookTypeFilter = listModule._customFilters.find(customFilter => customFilter.property === 'bookType')
    expect(bookTypeFilter).toBeDefined()
    expect(bookTypeFilter).toEqual(newFilterBookType)
  })

  test('is well generating the query params', () => {
    const dataField = columns[0].dataField
    expect(listModule.columns[dataField]).toBeDefined()
    listModule.columns[dataField].searchString = 'this is a search string'

    listModule.computeQueryParams({
      getFromCache: false
    })

    // Check it contains orders
    expect(listModule.queryParams.order).toBeDefined()
    expect(listModule.queryParams.order.theTitle).toBeDefined()
    expect(listModule.queryParams.order.theTitle).toEqual('ASC')

    // Check it contains custom filters
    expect(listModule.queryParams.otherCustomFilter).toBeDefined()
    expect(listModule.queryParams.otherCustomFilter).toEqual('customFilterValue')

    expect(listModule.queryParams.anotherCustomFilter).toBeDefined()
    expect(listModule.queryParams.anotherCustomFilter).toEqual('Another custom filter')

    expect(listModule.queryParams.bookType).toBeDefined()
    expect(listModule.queryParams.bookType).toEqual('paper')

    // Check it contains search string
    expect(listModule.queryParams[listModule.columns[dataField].searchParameterName]).toBeDefined()
    expect(listModule.queryParams[listModule.columns[dataField].searchParameterName]).toEqual('this is a search string')
  })
})

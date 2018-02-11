const flyd = require('../utilities/flyd')
const R = require('ramda')
const names = require('../json/congressNames.json')
const dict = require('../json/congressDictionary.json')
const data = require('../json/congressData.json')
const search = require('../utilities/search')(names)

module.exports = function SearchCongress () {
  // Initialize empty streams for autocomplete component.
  const query$ = flyd.stream()
  const selectionIndex$ = flyd.stream()
  const selected$ = flyd.stream()

  const bioguide$ = flyd.filter(
    R.identity,
    flyd.map(name => dict[name], selected$)
  )

  const results$ = flyd.merge(
    flyd.stream([]),
    flyd.map(q => search(q), query$)
  )

  const member$ = flyd.mergeAll([
    flyd.stream({}),
    flyd.map(b => data[b], bioguide$)
  ])

  return {
    query$,
    placeholder: 'Search for congress member',
    results$,
    selected$,
    selectionIndex$,
    member$
  }
}

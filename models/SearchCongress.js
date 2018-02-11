const flyd = require('../utilities/flyd')
const R = require('ramda')
const names = require('../json/congressNames.json')
const dict = require('../json/congressDictionary.json')
const data = require('../json/congressData.json')
const search = require('../utilities/search')(names)

module.exports = function SearchCongress (reset$, preSelected$) {
  const query$ = flyd.stream()
  const selectionIndex$ = flyd.stream()
  const selected$ = flyd.stream()
  const preSelectedBioguide$ = flyd.map(p => p.bioguide, preSelected$)
  const bioguide$ = flyd.filter(
    R.identity, 
    flyd.merge(
      preSelectedBioguide$, 
      flyd.map(name => dict[name], selected$)
    )
  )

  const results$ = flyd.merge(flyd.stream([]), flyd.map(q => search(q), query$))
  const member$ = flyd.mergeAll([
    flyd.stream({}),
    flyd.map(b => data[b], bioguide$),
    flyd.map(() => ({name: ' '}), reset$)
  ])
  return {
    query$,
    results$,
    selected$,
    reset$,
    selectionIndex$,
    member$
  }
}

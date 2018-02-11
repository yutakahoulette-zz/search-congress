const render = require('flimflam')
const h = require('snabbdom/h').default

const flyd = require('./utilities/flyd')
const Congress = require('./models/SearchCongress')
const autocomplete = require('./views/autocomplete')
const table = require('./views/congressTable')

const init = () => Congress(flyd.stream(), flyd.stream())

const view = (congress) => h('div', [
  autocomplete(congress),
  table(congress.member$())
])

const container = document.querySelector('#root')

render(view, init(), container)

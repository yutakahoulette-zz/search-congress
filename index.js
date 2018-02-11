const render = require('flimflam')
const h = require('snabbdom/h').default

const SearchCongress = require('./models/SearchCongress')
const autocomplete = require('./views/autocomplete')
const table = require('./views/congressTable')

// The SearchCongress 'model' gets initialized.
const init = () => SearchCongress()

// The view gets passed the initialized searchCongress 'model' through the render function.
// Anytime any of the streams in the 'model' get updated, the view will rerender.
const view = (searchCongress) => h('div.container', [
  h('h1', 'Search congress demo'),
  h('p', 'Use the autocomplete component to search for a member of congress.'),
  h('p', 'You can use your keyboard or click to select from the autocomplete options.'),
  h('p', 'Details of the selected member will be displayed in the table below.'),
  h('br'),
  autocomplete(searchCongress),
  h('br'),
  table(searchCongress.member$())
])

const container = document.querySelector('#root')

render(view, init(), container)

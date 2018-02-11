const h = require('snabbdom/h').default
const searchCongressView = require('js/views/searchCongress')
const table = require('js/views/congressTable')

const demo = congress => h('div', [
  h('p.m-0', 'Features:'),
  h('ul.mt-1.pb-2', [
    h('li', 'Up, down and enter key navigation'),
    h('li', 'Click selection'),
    h('li', 'Debouncing')
  ]),
  searchCongressView(congress),
  h('div.mt-2', [table(congress.member$())])
])

module.exports

const h = require('snabbdom/h').default
const R = require('ramda')

const row = (label, data, prefix = '') =>
  h('tr', [h('td.bold', label), h('td', (data && (prefix + data)) || '')])

const congressTable = (member = {name: ''}) => {
  const fade = !(member.name) || !(member.name.trim())
  return h('table.width-full', {class: {'opacity-05': fade}}, [
    row('Name', member.name),
    row('State', member.state),
    row('Type', member.type),
    row('Party', member.party),
    row('District', member.district),
    row('Phone', member.phone && member.phone.replace(/\D/g, ' ')),
    row('Twitter', R.path(['social', 'twitter'], member), '@')
  ])
}

module.exports = congressTable

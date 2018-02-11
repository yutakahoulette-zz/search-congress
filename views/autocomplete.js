const h = require('snabbdom/h').default
const debounce = require('throttle-debounce/debounce')

const upDownOrEnter = ev => {
  switch (ev.keyCode) {
    case 38: return 'up'
    case 40: return 'down'
    case 13: return 'enter'
    default: return null
  }
}

const setSelected = (obj, i) => obj.selected$(obj.results$()[i])

const selectWithKeyboard = obj => ev => {
  const len = obj.results$().length
  if (!len) return
  const keypress = upDownOrEnter(ev)
  if (keypress) { ev.preventDefault() }
  const index = obj.selectionIndex$()
  if (keypress === 'down') {
    const i = index === undefined ? 0 : (index + 1) % len
    obj.selectionIndex$(i)
    setSelected(obj, i)
  }
  if (keypress === 'up') {
    const i = index === 0 ? (len - 1) : (index - 1) % len
    obj.selectionIndex$(i)
    setSelected(obj, i)
  }
  if (keypress === 'enter') { obj.results$([]) }
}

const query = obj => ev => {
  const value = ev.target.value
  obj.selectionIndex$(undefined)
  if (!value) { obj.selected$('') }
  obj.query$(value)
}

const handleClick = (obj, i) => ev => {
  obj.selectionIndex$(i)
  setSelected(obj, i)
  obj.results$([])
}

const positionMenu = vnode => {
  const elm = vnode.elm
  const top = elm.parentElement.querySelector('input').offsetHeight
  elm.style.top = top + 'px'
}

const menu = obj => {
  const index = obj.selectionIndex$()
  return h('div.sh-1.absolute.left-0.bg-white.z-1', {
    style: {'max-height': `${16 * 20}px`, 'overflow-y': 'auto'},
    hook: {insert: positionMenu}
  }
  , obj.results$().map((r, i) =>
    h('div.p-1.sub.hover-bg-grey-light.cursor-pointer', {
      on: {click: handleClick(obj, i)},
      class: {'bg-grey-light': i === index}
    }, r))
  )
}


// Params:
// obj {
//   name: String (name of input)
// , keyup: Function (should call a search function based on input value)
// , debounce: Boolean (use for limiting ajax calls)
// , results$: Stream containing an array
// , field: Function (validated form field to wrap input)
// , selected$: Stream
// }
module.exports = (obj) => {
  return h('div.relative', [
    h('input', {
      props: {
        type: 'text',
        name: obj.name || '',
        value: obj.value || obj.selected$() || '',
        placeholder: obj.placeholder
      },
      on: {
        input: obj.debounce ? debounce(500, query(obj)) : query(obj),
        keydown: selectWithKeyboard(obj)
      }
    }),
    obj.results$() && obj.results$().length ? menu(obj) : ''
  ])
}

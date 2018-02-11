const clean = st => st.replace(/\W/g, '')

const search = arr => (search = '') => {
  if (!search) return []
  const regex = new RegExp(clean(search), 'im')
  return arr.reduce((acc, st) => {
    if (clean(st).match(regex)) { acc = acc.concat([st]) }
    return acc
  }, [])
}

module.exports = search

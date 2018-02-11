const clean = st => st.replace(/\W/g, '')

// Curried function that first takes an array to search in
// and then takes a search string.
// Returns and arry of matches.
// Example:
//   const fruitSearch = search(['apple', 'apricot', 'banana', 'pear'])
//   fruitSearch('pea') // returns ['pear']
//   fruitSearch('ap')  // returns ['apple', 'apricot']
const search = arr => (search = '') => {
  if (!search) return []
  const regex = new RegExp(clean(search), 'im')
  return arr.reduce((acc, st) => {
    if (clean(st).match(regex)) { acc = acc.concat([st]) }
    return acc
  }, [])
}

module.exports = search

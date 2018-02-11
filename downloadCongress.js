const download = require('download-file')
const yaml = require('yamljs')
const R = require('ramda')
const fs = require('fs')

const url = (path) =>
  `https://raw.githubusercontent.com/unitedstates/congress-legislators/master/${path}.yaml`

const log = (verb, noun) => console.log(verb + ' ' + noun)

const remove = paths =>
  R.map(p => {
    log('Removing', p)
    fs.unlinkSync(p)
  }, paths)

const write = objs =>
  R.map(o => {
    fs.writeFile(o.path, JSON.stringify(o.data), (err) => {
      if (err) throw err
      log('Writing', o.path)
    })
  }, objs)

const uniqueName = member => member.name + ' (' + member.type + ' ' + member.state + ')'

const processData = (file1) => (err, file2) => {
  if (err) throw err
  log('Downloaded', file2)
  log('Formatting', file1)
  const currentData = R.reduce(
    (acc, obj) => {
      const term = R.last(obj.terms) || {}
      const bioguide = R.path(['id', 'bioguide'], obj)
      acc[bioguide] = {
        name: R.path(['name', 'official_full'], obj),
        type: R.toUpper(term.type),
        state: term.state,
        party: term.party,
        district: term.district,
        phone: term.phone,
        bioguide: bioguide
      }
      return acc
    }, {}, yaml.load(file1))

  const socialData = R.reduce(
    (acc, obj) => {
      const social = obj.social
      acc[R.path(['id', 'bioguide'], obj)] = {
        facebook: social.facebook,
        twitter: social.twitter
      }
      return acc
    }, {}, yaml.load(file2))

  const mergedData = R.reduce(
    (acc, id) => {
      if (acc[id]) {
        acc[id].social = socialData[id]
      }
      return acc
    }, currentData, R.keys(socialData))

  const dictionary = R.reduce(
    (acc, id) => {
      const member = currentData[id]
      const name = uniqueName(member)
      acc[name] = id
      return acc
    }, {}, R.keys(currentData))

  const senatorsByState = R.reduce(
    (acc, id) => {
      const member = currentData[id]
      if (member.type === 'SEN') {
        const state = member.state
        acc[state] = R.concat((acc[state] || []), [id])
      }
      return acc
    }, {}, R.keys(currentData))

  const repsByStateAndDistrict = R.reduce(
    (acc, id) => {
      const member = currentData[id]
      if (member.type === 'REP') {
        const stateAndDistrict = member.state + member.district
        acc[stateAndDistrict] = id
      }
      return acc
    }, {}, R.keys(currentData))

  remove([file1, file2])

  write([
    {path: 'src/json/congressData.json', data: mergedData},
    {path: 'src/json/congressNames.json', data: R.keys(dictionary)},
    {path: 'src/json/congressDictionary.json', data: dictionary},
    {path: 'src/json/senatorsByState.json', data: senatorsByState},
    {path: 'src/json/repsByStateAndDistrict.json', data: repsByStateAndDistrict}
  ])
}

const downloadSocials = (err, file1) => {
  if (err) throw err
  log('Downloaded', file1)
  download(url('legislators-social-media'), {}, processData(file1))
}

console.log('Begin downloading...')
download(url('legislators-current'), {}, downloadSocials)

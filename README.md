# Search Congress

This is a feature of Rally Starter (RS) that I extracted and simplified to just work in the client.

### Running the app locally
- `npm install`
- `npm run download` (downloads the latest congressional legislator data - optional)
- `npm run start` (this should spin up a dev server and open your browser to the demo page)

This feature is comprised of two parts:
- a node script for downloading congressional legislator data and formatting it
- UI for searching and displaying the congressional legislator data

### Downloading congressional legislator data
- in RS, this data is downloaded daily with a cron job so that it stays current
- the code for downloading and formatting the data lives in `downloadCongress.js`
- the downloaded files are in `yaml` format but get formatted to `json`

### UI
- the frontend 'framework' that RS uses is a combination of flyd (model) snabbdom (view)
- [flyd](https://github.com/paldepind/flyd) is a functional reactive library
- [snabbdom](https://github.com/snabbdom/snabbdom) is virtual DOM library
- RS uses an additional library called [flimflam](https://github.com/flimflamjs/flimflam#cyclone-flimflam-flyd--snabbdom-cyclone) (sorry for all of these inscrutable names) that combines snabbdom and flyd so that whenever there is a state change in the model, the view rerenders
- additionally, RS uses [ramda](http://ramdajs.com/) pretty heavily


import * as L from 'partial.lenses'
import * as React from 'karet'
import * as U from 'karet.util'
import p2re from 'path-to-regexp'

const Location = React.createContext({path: '', search: '', hash: ''})

const hold = held =>
  L.reader(focus => {
    if (undefined === focus) {
      return held
    } else {
      return (held = focus)
    }
  })

export const Route = ({path: pattern, Component}) => {
  const formals = []
  const pathRE = p2re(pattern, formals)
  const toPath = p2re.compile(pattern)
  const fromPath = path => {
    const match = pathRE.exec(path)
    if (null !== match) {
      const values = {}
      for (let i = 0, n = formals.length; i < n; ++i) {
        // XXX Handle optional and repeat parameters?
        const value = match[i + 1]
        const {name} = formals[i]
        values[name] = undefined === value ? value : decodeURIComponent(value)
      }
      return values
    }
  }
  const pathValuesIso = L.iso(fromPath, toPath)

  return (
    <Location.Consumer>
      {({path, search, hash}) => {
        const match = U.view([pathValuesIso, hold()], path)
        const props = {}
        for (let i = 0, n = formals.length; i < n; ++i) {
          const {name} = formals[i]
          props[name] = U.view([name], match)
        }
        return (
          <React.Fragment>
            {U.when(
              match,
              <Component {...{path, search, hash, match}} {...props} />
            )}
          </React.Fragment>
        )
      }}
    </Location.Consumer>
  )
}

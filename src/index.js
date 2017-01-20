import mitt from 'mitt'

function warn (msg) {
  (console.error || console.log)(msg)
}

export function createStore (initialState) {
  let state = initialState
  let events = mitt()

  return {
    emit: events.emit,
    on: events.on,
    off: events.off,
    addReducer (reducer) {
      for (let type in reducer) {
        if (reducer.hasOwnProperty(type)) {
          events.on(type, (e) => {
            let result = reducer[type](this.state, e)
            if (!result) {
              warn(`You forgot to return something from your reducer! Check: "${type}" on reducer with keys: ${Object.keys(reducer)}`);
            }
            this.state = result
          })
        }
      }
    },
    get state () { return state },
    set state (nextState) { state = nextState }
  }
}

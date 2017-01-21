import mitt from 'mitt'

export function createStore (initialState) {
  let state = initialState
  let events = mitt()

  return {
    on: events.on,
    off: events.off,
    emit (type, payload) {
      if (typeof type === 'function') return type(events.emit, this.state)

      events.emit(type, payload)
    },
    addReducer (reducer) {
      for (let type in reducer) {
        events.on(type, (e) => {
          let result = reducer[type](this.state, e)
          if (!result) {
            throw new Error(`You forgot to return something from your reducer function! Check: "${type}" on reducer with keys: ${Object.keys(reducer)}`)
          }
          this.state = result
        })
      }
    },
    get state () { return state },
    set state (nextState) { state = nextState }
  }
}

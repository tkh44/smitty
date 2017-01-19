import mitt from 'mitt'

export function createStore (initialState) {
  let state = Object.assign({}, initialState)
  let events = mitt()

  return {
    emit: events.emit,
    on: events.on,
    off: events.off,
    addReducer (reducer) {
      Object.keys(reducer).forEach((type) => {
        events.on(type, (e) => {
          this.state = reducer[type](this.state, e)
        })
      })
    },
    get state () { return state },
    set state (nextState) { state = nextState }
  }
}

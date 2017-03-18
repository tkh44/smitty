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
        let handler
        if (type === '*') {
          handler = (eventType, e) => {
            this.state = reducer[type](this.state, e, eventType) || this.state
          }
        } else {
          handler = e => {
            this.state = reducer[type](this.state, e, type) || this.state
          }
        }

        events.on(type, handler)
      }
    },
    get state () {
      return state
    },
    set state (nextState) {
      state = nextState
    }
  }
}

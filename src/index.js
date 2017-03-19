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
        handler = (eventType, e) => {
          if (eventType.substring(0, 6) === 'store:') return
          this.state = reducer[type](this.state, e, eventType) || this.state
          events.emit('store:change', this.state)
        }
        if (type !== '*') {
          handler = handler.bind(null, type)
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

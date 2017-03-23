import mitt from 'mitt'

class Store {
  constructor (initialState) {
    this._state = initialState
    this.events = mitt()
    this.on = this.events.on
    this.off = this.events.off
    this.emit = this.emit.bind(this)
    this.addReducer = this.addReducer.bind(this)
  }

  get state () {
    return this._state
  }

  set state (nextState) {
    this._state = nextState
  }

  emit (type, payload) {
    if (typeof type === 'function') return type(this.emit, this.state)
    this.events.emit(type, payload)
  }

  addReducer (reducer) {
    for (let type in reducer) {
      let handler
      handler = (eventType, e) => {
        if (eventType.substring(0, 6) === 'store:') return
        this.state = reducer[type](this.state, e, eventType) || this.state
        this.events.emit('store:change', this.state)
      }
      if (type !== '*') {
        handler = handler.bind(null, type)
      }
      this.events.on(type, handler)
    }
  }
}

export function createStore (initialState) {
  return new Store(initialState)
}

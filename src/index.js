import mitt from 'mitt'

class Store {
  constructor (initialState) {
    this._state = initialState
    this.actions = {}
    this.events = mitt()
    this.on = this.events.on
    this.off = this.events.off
    this.emit = this.emit.bind(this)
    this.handleActions = this.handleActions.bind(this)
  }

  get state () {
    return this._state
  }

  set state (nextState) {
    this._state = nextState
  }

  emit (type, payload) {
    console.log(type)
    if (typeof type === 'function') return type(this)
    this.events.emit(type, payload)
  }

  createAction (type) {
    if (typeof type === 'function') {
      return payload => this.emit(type(payload))
    }

    const actionCreator = payload => this.emit(type, payload)
    actionCreator.toString = () => type.toString()
    return actionCreator
  }

  createActions (actionMap) {
    for (let creatorName in actionMap) {
      this.actions[creatorName] = this.createAction(actionMap[creatorName])
    }
  }

  handleActions (handlerMap) {
    for (let type in handlerMap) {
      let handler = (eventType, e) => {
        if (eventType.substring(0, 6) === 'store:') return
        this.state = handlerMap[type](this.state, e, eventType) || this.state
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

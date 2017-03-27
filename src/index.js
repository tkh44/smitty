import mitt from 'mitt'

function Store (initialState) {
  let _state = initialState
  this.actions = {}
  this.events = mitt()
  this.on = this.events.on
  this.off = this.events.off
  this.emit = this.emit.bind(this)
  this.handleActions = this.handleActions.bind(this)

  Object.defineProperty(this, 'state', {
    get: function () {
      return _state
    },
    set: function (value) {
      _state = value
    }
  })
}

Object.assign(Store.prototype, {
  emit (type, payload) {
    if (typeof type === 'function') return type(this)
    this.events.emit(type, payload)
  },

  createActions (actionMap) {
    for (let creatorName in actionMap) {
      const type = actionMap[creatorName]
      let actionCreator
      if (typeof type === 'function') {
        actionCreator = payload => this.emit(type(payload))
      } else {
        actionCreator = payload => this.emit(type, payload)
        actionCreator.toString = () => type.toString()
      }
      this.actions[creatorName] = actionCreator
    }
  },

  handleActions (handlerMap) {
    for (let type in handlerMap) {
      let handler = (eventType, e) => {
        if (eventType.substring(0, 6) === 'store:') return
        const nextState = handlerMap[type](this.state, e, eventType) || this.state
        if (this.state !== nextState) {
          this.events.emit('store:state:change', this.state)
        }
      }
      if (type !== '*') {
        handler = handler.bind(null, type)
      }
      this.events.on(type, handler)
    }
  }
})

export function createStore (initialState) {
  return new Store(initialState)
}

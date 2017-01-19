import mitt from 'mitt'

export default function createStore (initialState) {
  let state = initialState
  let events = mitt()

  return {
    emit: events.emit,
    addReducer (reducer) {
      Object.keys(reducer).forEach((type) => {
        events.on(type, (e) => {
          this.state = reducer[type](this.state, e)
        })
      })
    },
    get state () {
      return state
    },
    set state (nextState) {
      state = nextState
    }
  }
}

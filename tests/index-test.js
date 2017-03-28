/* eslint-env mocha */
import expect from 'expect'
import mitt from 'mitt'
import { createStore } from '../src/index'

describe('smitty', () => {
  it('store is created', () => {
    expect(createStore({})).toExist()
  })

  it('store has a state', () => {
    expect(createStore({ foo: 5 }).state).toEqual({ foo: 5 })
  })

  it('exposes the events api', () => {
    expect(createStore()).toIncludeKeys(Object.keys(mitt()))
  })

  it('reducer is called with prev state and event data', done => {
    const store = createStore({ foo: 5 })
    store.handleActions({
      'foo/ADD': (state, e, type) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        expect(type).toEqual('foo/ADD')
        return state
      },
      '*': () => {} // Test '*' event branch with no state returned
    })

    store.emit('foo/ADD', { foo: 'bar' })
    done()
  })

  it('handles * event type', done => {
    const store = createStore({ foo: 5 })
    store.handleActions({
      'foo/ADD': (state, e, type) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 5 })
        expect(type).toEqual('foo/ADD')
        return { foo: state.foo + e.foo }
      },
      '*': (state, e, type) => {
        expect(state.foo).toBe(10)
        expect(e).toEqual({ foo: 5 })
        expect(type).toEqual('foo/ADD')
        return { foo: state.foo + e.foo }
      }
    })

    store.emit('foo/ADD', { foo: 5 })
    done()
  })

  it('no return from reducer is acceptable', done => {
    const store = createStore({ foo: 5 })
    store.handleActions({
      'foo/ADD': (state, e) => {
        state.foo += 5
      }
    })

    store.emit('foo/ADD', { foo: 'bar' })
    expect(store.state.foo).toBe(10)
    done()
  })

  it('reducers are called in order with updated state', done => {
    const store = createStore({ foo: 5 })
    store.handleActions({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        return { foo: state.foo + 1 }
      }
    })

    store.handleActions({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(6)
        expect(e).toEqual({ foo: 'bar' })
        return { foo: state.foo + 2 }
      }
    })

    store.emit('foo/ADD', { foo: 'bar' })
    expect(store.state.foo).toBe(8)
    done()
  })

  it('emit accepts a function argument and calls it with store', done => {
    const store = createStore({ foo: 5 })
    store.handleActions({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual(5)
        return { foo: state.foo + e }
      }
    })

    const action = amount =>
      (storeArg) => {
        expect(storeArg).toBe(store)
        storeArg.emit('foo/ADD', amount)
        expect(store.state.foo).toBe(10)
        done()
      }

    store.emit(action(5))
  })

  it('accepts class as reducer', done => {
    const store = createStore({ foo: 5 })

    class HistoryReducer {
      constructor (initialHistory = []) {
        this.history = createStore(initialHistory)
        this.history.handleActions({
          update: (state, e) => {
            state.push(e)
          }
        })
      }

      onUpdate (state, events, type) {
        this.history.emit('update', { state, events, type })
      }
    }

    HistoryReducer.prototype['foo/ADD'] = function (state, e, type) {
      state.foo += e.foo
      this.onUpdate(state, e, type)
    }

    const historyReducer = new HistoryReducer([])
    store.handleActions(historyReducer)

    store.emit('foo/ADD', { foo: 5 })
    expect(store.state.foo).toBe(10)
    expect(historyReducer.history.state).toEqual([
      {
        state: {
          foo: 10
        },
        events: {
          foo: 5
        },
        type: 'foo/ADD'
      }
    ])
    done()
  })

  it('createActions', done => {
    const store = createStore({ foo: 5 })

    store.createActions({
      start: () => (store) => {
        store.emit(store.actions.add(5))
      },
      add: 'foo/ADD'
    })

    store.handleActions({
      [store.actions.add]: (state, e) => {
        expect(state.foo).toBe(5)
        state.foo += e
        expect(state.foo).toEqual(10)
        done()
      }
    })

    store.actions.start()
  })

  it('`$$store:state:change` event is fired after action handler is called', done => {
    const store = createStore({ foo: 5 })

    store.createActions({
      start: () => (store) => {
        store.emit(store.actions.add(5))
      },
      add: 'foo/ADD'
    })

    store.handleActions({
      [store.actions.add]: (state, e) => {
        expect(state.foo).toBe(5)
        state.foo += e
      }
    })

    store.events.on('$$store:state:change', (state) => {
      expect(state.foo).toEqual(10)
      done()
    })

    store.actions.start()
  })
})

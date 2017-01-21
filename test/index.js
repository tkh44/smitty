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

  it('exposes the mitt api', () => {
    expect(createStore()).toIncludeKeys(Object.keys(mitt()))
  })

  it('reducer is called with prev state and event data', (done) => {
    const store = createStore({ foo: 5 })
    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        return state
      }
    })

    store.emit('foo/ADD', { foo: 'bar' })
    done()
  })

  it('warn when nothing is returned from reducer function', (done) => {
    const store = createStore({ foo: 5 })

    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        return null
      }
    })

    expect(function () { store.emit('foo/ADD', { foo: 'bar' }) })
      .toThrow(/You forgot to return something from your reducer function! Check: "foo\/ADD" on reducer with keys: foo\/ADD/)
    done()
  })

  it('reducers are called in order with updated state', (done) => {
    const store = createStore({ foo: 5 })
    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual({ foo: 'bar' })
        return { foo: state.foo + 1 }
      }
    })

    store.addReducer({
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

  it('emit accepts a function argument and calls it with state and emit', (done) => {
    const store = createStore({ foo: 5 })
    store.addReducer({
      'foo/ADD': (state, e) => {
        expect(state.foo).toBe(5)
        expect(e).toEqual(5)
        return { foo: state.foo + e }
      }
    })

    const action = (amount) => (emit, state) => {
      expect(emit).toExist()
      expect(state).toExist()

      emit('foo/ADD', amount)
      expect(store.state.foo).toBe(10)
      done()
    }

    store.emit(action(5))
  })
})

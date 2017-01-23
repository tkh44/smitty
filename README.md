# smitty

[![npm version](https://badge.fury.io/js/smitty.svg)](https://badge.fury.io/js/smitty)
[![Build Status](https://travis-ci.org/tkh44/smitty.svg?branch=master)](https://travis-ci.org/tkh44/smitty)
[![codecov](https://codecov.io/gh/tkh44/smitty/branch/master/graph/badge.svg)](https://codecov.io/gh/tkh44/smitty)



Tiny flux implementation built on [mitt](https://git.io/mitt)

### Demos
[Basic Example with Preact - CodePen](http://codepen.io/tkh44/pen/zNNPPq)

[Fetch Example with Preact - CodePen](http://codepen.io/tkh44/pen/JEWKJX)

[UI State Example with Preact - CodePen](http://codepen.io/tkh44/pen/xgqNqy)

[Scroll Stress Test + connect HoC - CodePen](http://codepen.io/tkh44/pen/pReRVm)

[State as a Map instead of plain object - CodePen](http://codepen.io/tkh44/pen/xgqBmO)

[State as an Immutable Map instead of plain object - CodePen](http://codepen.io/tkh44/pen/MJpREe)

### Basics
```javascript
import { createStore } from 'smitty'

// Create a store with initial state
const initialState = { count: 0 }
const store = createStore(initialState)

// add a reducer
store.addReducer({
  'count/ADD': (state, e) => {
    // increment foos by amount and return NEW state
    return Object.assign({}, state, { count: state.count + e.amount })
  }
})

store.emit('count/ADD', { amount: 5 })

console.log(store.state)  // logs `{ count: 5 }`
```

### Action Creators

You can pass a function to `emit` in order to create an action creator

You can see a running example here: http://codepen.io/tkh44/pen/JEWKJX

```javascript
import { createStore } from 'smitty'

// Create a store with initial state
const initialState = {}
const store = createStore(initialState)

// add our reducer
store.addReducer({
  'REQUEST_ROOM': (state, { id, res }) => {
    return {
      ...state,
      [id]: {
        ...state[id],
        ...res.data
      }
    }
  }
})

// create our action creators
const actions = {
  requestRoom (id) {
    return async (emit, state) => {
      emit('REQUEST_ROOM', { id, res: { data: { id } } })
      const res = await window.fetch(`https://api.mysite.com/${id}`)
      res.data = await res.json()
      emit('REQUEST_ROOM', { id, res })
    }
  }
}

// When calling emit with a function argument, the function will be called with `emit` and `state` as arguments
const result = store.emit(actions.requestRoom('1a'))

// Return whatever you like from your action creator
console.log(result) // logs "Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}"

// After the fetch call, `REQUEST_ROOM` is fired a second time with our response data
result.then(() => console.log(store.state)) // logs `{ 1a: { id: '1a', title: 'My Room' }``

```
### Thanks
Thanks to [developit](https://github.com/developit) for [mitt](https://git.io/mitt) and the project structure.

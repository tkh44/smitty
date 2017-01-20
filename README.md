# smitty

[![npm version](https://badge.fury.io/js/smitty.svg)](https://badge.fury.io/js/smitty)
[![Build Status](https://travis-ci.org/tkh44/smitty.svg?branch=master)](https://travis-ci.org/tkh44/smitty)
[![codecov](https://codecov.io/gh/tkh44/smitty/branch/master/graph/badge.svg)](https://codecov.io/gh/tkh44/smitty)



Tiny flux implementation built on [mitt](https://git.io/mitt)

### Demos
[Basic Example with Preact - CodePen](http://codepen.io/tkh44/pen/zNNPPq)

[Fetch Example with Preact - CodePen](http://codepen.io/tkh44/pen/JEWKJX)

[Scroll Stress Test + connect HoC - CodePen](http://codepen.io/tkh44/pen/pReRVm)

[State as a Map instead of plain object - CodePen](http://codepen.io/tkh44/pen/xgqBmO)

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

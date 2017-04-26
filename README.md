<h1 align="center" style="color: #343a40">
  <img src="https://cdn.rawgit.com/tkh44/smitty/master/smitty.png" alt="smitty" width="200">
  <br>
  smitty
  <br>
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Tiny flux implementation built on <a style="color: #9B86FF;" href="https://git.io/mitt">mitt</a></p>

# smitty

[![npm version](https://badge.fury.io/js/smitty.svg)](https://badge.fury.io/js/smitty)
[![Build Status](https://travis-ci.org/tkh44/smitty.svg?branch=master)](https://travis-ci.org/tkh44/smitty)
[![codecov](https://codecov.io/gh/tkh44/smitty/branch/master/graph/badge.svg)](https://codecov.io/gh/tkh44/smitty)

-   [Install](#install)
-   [Basic Usage](#basic-usage)
-   [Demos](#demos-v2)
-   [Usage with Preact and React](#usage-with-preact-and-react)
-   [API](#api)
-   [Store](#store)
-   [Action Creator Detailed Example](#action-creator-detailed-example)
-   [Class As Reducer](#class-as-reducer)

## Install

```bash
npm install -S smitty
```

## Basic Usage
```javascript
import { createStore } from 'smitty'

// Create a store with initial state
const initialState = { count: 0 }
const store = createStore(initialState)

store.createActions({
  add: 'count/ADD'
})

// add a reducer
store.handleActions({
  [store.actions.add]: (state, e, type) => {
    // increment foos by amount
    return Object.assign({}, state, { count: state.count + e.amount })
  },
  '*': (state, e, type) => {
    // '*' can be used for all kinds of fun stuff
    console.log(e, type)
    if (type === 'count/ADD') {
      //...do something
    }
    return state
  }
})

store.actions.add({ amount: 5 })

console.log(store.state)  // logs `{ count: 5 }`
```
---

## Demos (v2)
- [Photo Booth](https://tkh44.github.io/smitty/)
  Demonstrates async api and saving parts of the store with [localforage](https://github.com/localForage/localForage)
  - [source](https://github.com/tkh44/smitty/blob/master/demo/src)
  
## Demos (v1)
- Basic
  - [Object as state](http://codepen.io/tkh44/pen/zNNPPq)
  - [Map as state](http://codepen.io/tkh44/pen/xgqBmO)
  - [Immutable.Map as state](http://codepen.io/tkh44/pen/MJpREe)
  - [Preact Router Example](http://codepen.io/seveves/pen/ryyNYz)
- Async
  - [Fetch api with Immutable.Map as state](http://codepen.io/tkh44/pen/JEWKJX)
- Fun
  - [UI colors with Immutable.Map as state](http://codepen.io/tkh44/pen/xgqNqy)
  - [UI colors with custom class as state](http://codepen.io/tkh44/pen/OWmqBz)
  - [Scroll sync](http://codepen.io/tkh44/pen/pReRVm)
  - [Preact Component as state](http://codepen.io/tkh44/pen/bqabGX)

---

## Usage with Preact and React
- Preact bindings - [preact-smitty](https://github.com/tkh44/preact-smitty)
  
  ```bash
  npm install preact-smitty
  ```

- React bindings - [react-smitty](https://github.com/tkh44/react-smitty)
  
  ```bash
  npm install react-smitty
  ```

---

## API

## `createStore(initialState: any)`

#### Arguments 

`initialState: any` **required**: Determines the shape and initial state of your store. Can be of any type that you choose.

#### Returns 

`Store: Store` **[Store](#store)**

---

## Store

### emit: (_function_)

**arguments**
 
**type**: (_string_ | _function_)
 
- [string], `type` determines which reducers are called.
    
    ```js
    const store = createStore(0)
    store.handleActions({
      add: function (state, payload) {
        return state + payload
      }
    })
    console.log(store.state) // logs 0
    store.emit('add', 1)
    console.log(store.state) // logs 1
    ```
 
- [function] `type` becomes an action creator that is passed 1 argument
    
    - **store**: **[Store](#store)**
    
    This is useful to emit multiple actions from a single emit call.
    
    ```js
    const store = createStore(0)
    store.handleActions({
      add: function (state, payload) {
        return state + payload
      }
    })
    function asyncAction (emit, state) {
      emit('add', 1)
      console.log(state) // logs 1
      setTimeout(() => {
        emit('add', 1)
        console.log(state) // logs 3
      }, 100)
      emit('add', 1)
      console.log(state) // logs 2
    }
        ```

**payload**: (_any_) optional

payload to pass to your reducer

```js
const store = createStore({ name: 'Arrow' })
store.handleActions({
  'update/NAME': function (state, payload) {
    // I really don't care if you return a new state
    // Nobody is judging. Do what your ❤️ tells you.
    // Just be consistent
    return Object.assign({}, state, payload)
  }
})
console.log(store.state) // logs { name: 'Arrow' }
store.emit('update/NAME', { name: 'River' })
console.log(store.state) // logs { name: 'River' }
```

### createActions(): (_function_)

**arguments**
 
**actionMap**: (_object_)
    
Object where key is the action creator's name and the value can be of type `string` or `function`.

If the value is a `string`, an action creator is attached to `store.actions` as a function that accepts one argument, `payload`.

```js
store.createActions({
  add: 'count/ADD'
})

// The following are functionally equivalent
store.actions.add(1)

store.emit('count/ADD', 1)

```

Action creators with a string value can be used as the key in your `actionMap` in `handleActions`.

```javascript    
store.createActions({
  add: 'count/ADD'
})

// add a reducer
store.handleActions({
  [store.actions.add]: (state, e, type) => {
    // increment foos by amount
    return Object.assign({}, state, { count: state.count + e.amount })
  }
})

store.actions.add({ amount: 5 })

console.log(store.state)  // logs `{ count: 5 }`
```


If the value is a `function`, it must be a function that returns an action creator. For async action creators.

```js
store.createActions({
  add: (amount) => {
    return (store) => {
      setTimeout(() => {
       store.emit('count/ADD', amount)
      }, 16)
    }
  }
})

store.actions.add(1)

```

### handleActions(): (_function_)

**arguments**
 
**handlerMap**: (_object_)
 
Object with keys that correspond to action types passed to `emit`

When an event is emitted and the key matches the type the reducer is invoked with 3 arguments.

  - **state**: (_any_) the store's state getter
  - **payload** (__any__) the payload that was emitted
  - **type** (__string__) the type that was emitted

```js
const store = createStore({ color: 'blue', hovered: false })
store.handleActions({
  'merge': function (state, payload) {
    return Object.assign({}, state, payload)
  },
  'overwrite': function (state, payload) {
    return payload
  },

  // Could do the same in one
  // If you really miss redux do this and put a switch statement
  '*': function(state, payload, type) {
    return type === 'merge' ? Object.assign({}, state, payload) : payload
  }
})
console.log(store.state) // logs { color: 'blue', hovered: false }
store.emit('merge', { color: 'red' })
console.log(store.state) // { color: 'red', hovered: false }
store.emit('overwrite', { color: 'green', hovered: true, highlighted: false })
console.log(store.state) // { color: 'green', hovered: true, highlighted: false 
```

### actions: (_object_)

Map of all the actions created in `store.createActions`

This is convenient so that you do not have to deal with action imports across your app.

### on: (_function_)

Convenience shortcut for [mitt.on](https://github.com/developit/mitt/#on).

### off: (_function_)
 
Convenience shortcut for [mitt.off](https://github.com/developit/mitt/#off).

---

## Action Creator Detailed Example

You can pass a function to `emit` in order to create an action creator

**[running example](http://codepen.io/tkh44/pen/JEWKJX)**

```javascript
import { createStore } from 'smitty'

// Create a store with initial state
const initialState = {}
const store = createStore(initialState)

// add our reducer
store.handleActions({
  'api/GET_ROOM': (state, { id, res }) => {
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

## Class As Reducer
Reducers are iterated with `for (let type in reducer) {...}` with no `obj.hasOwnProperty` check so this works.

```javascript
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

  onUpdate (state, e, type) {
    this.history.emit('update', { state, e, type })
  }
}

HistoryReducer.prototype['foo/ADD'] = function (state, e, type) {
  state.foo += e.foo
  this.onUpdate(state, e, type)
}

const historyReducer = new HistoryReducer([])
store.handleActions(historyReducer)

store.emit('foo/ADD', { foo: 5 })
console.log(store.state.foo) // logs 10
store.emit('foo/ADD', { foo: 7 })
console.log(store.state.foo) // logs 17
console.log(historyReducer.history.state)
// logs
// [
//   { state: { foo: 10 }, e: { foo: 5 }, type: 'foo/ADD' },
//   { state: { foo: 17 }, e: { foo: 7 }, type: 'foo/ADD' }
// ]

```

### Thanks
Thanks to [developit](https://github.com/developit) for [mitt](https://git.io/mitt) and the project structure.

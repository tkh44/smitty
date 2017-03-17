# smitty

[![npm version](https://badge.fury.io/js/smitty.svg)](https://badge.fury.io/js/smitty)
[![Build Status](https://travis-ci.org/tkh44/smitty.svg?branch=master)](https://travis-ci.org/tkh44/smitty)
[![codecov](https://codecov.io/gh/tkh44/smitty/branch/master/graph/badge.svg)](https://codecov.io/gh/tkh44/smitty)

<h1 align="center" style="color: #343a40">
  <img src="https://cdn.rawgit.com/tkh44/smitty/master/smitty.png" alt="Smitty" width="200">
  <br>
  Smitty
  <br>
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Tiny flux implementation built on <a style="color: #9B86FF;" href="https://git.io/mitt">mitt</a></p>



-   [Install](#install)
-   [Basic Usage](#basic-usage)
-   [Demos](#demos)
-   [Add-ons](#add-ons)
-   [API](#api)
-   [Store](#store)

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
---

## Demos
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

---

## Add-ons
- Preact bindings - [preact-smitty](https://github.com/tkh44/preact-smitty)
  - ```npm install preact-smitty```
- React bindings - [react-smitty](https://github.com/tkh44/react-smitty)
  - ```npm install react-smitty```

---

## API

## `createStore(initialState: any)`

#### Arguments 

`initialState: any` **required**: Determines the shape and initial state of your store. Can be of any type that you choose.

#### Returns 

`Store: Store` **store**: Determines the shape and initial state of your store. Can be of any type that you choose.

---

## Store

### **emit**:

**arguments**
 
 - **type**: _string_ | _function_
 
    - [string], `type` determines which reducers are called.
        
        ```js
        const store = createStore(0)
        store.addReducer({
          add: function (state, payload) {
            return state + payload
          }
        })
        console.log(store.state) // logs 0
        emit('add', 1)
        console.log(store.state) // logs 1
        ```
     
    - [function] `type` becomes an action creator that is passed 2 arguments
        
        - **emit**: `store.emit`
        - **state**: the store's current state
        
             _`state` is a getter property so it will always return the latest version. Short cut for getState()_ 
        
        This is useful to emit multiple actions from a single emit call.
        
        ```js
        const store = createStore(0)
        store.addReducer({
          add: function (state, payload) {
            return state + payload
          }
        })
        function apiAction (emit, state) {
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

 - **payload**: _any_ (optional)

    payload to pass to your reducer
    
    ```js
    const store = createStore({ name: 'Arrow' })
    store.addReducer({
      'update/NAME': function (state, payload) {
        // I really don't care if you return a new state
        // Nobody is judging. Do what your ❤️ tells you.
        // Just be consistent
        return Object.assign({}, state, payload)
      }
    })
    console.log(store.state) // logs { name: 'Arrow' }
    emit('update/NAME', { name: 'River' })
    console.log(store.state) // logs { name: 'River' }
    ```
    
### **addReducer**:

**arguments**
 
 - **reducer**: _object_
 
    Object with keys that correspond to action types passed to `emit`
    
    ```js
    const store = createStore({ color: 'blue', hovered: false })
    store.addReducer({
      'merge': function (state, payload) {
        return Object.assign({}, state, payload)
      },
      'overwrite': function (state, payload) {
        return payload
      }
    })
    console.log(store.state) // logs { color: 'blue', hovered: false }
    emit('merge', { color: 'red' })
    console.log(store.state) // { color: 'red', hovered: false }
    emit('overwrite', { color: 'green', hovered: true, highlighted: false })
    console.log(store.state) // { color: 'green', hovered: true, highlighted: false 
    ```

#### **on**: _function_

Convenience shortcut for [mitt.on](https://github.com/developit/mitt/#on).

#### **off**: _function_
 
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
store.addReducer({
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

### Thanks
Thanks to [developit](https://github.com/developit) for [mitt](https://git.io/mitt) and the project structure.

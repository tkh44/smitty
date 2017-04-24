import {Component, createElement} from 'react'
import {createStore} from '../../src'

const tree = createStore({
  connections: [],
  trackers: []
})

tree.createActions({
  register: 'preact-smitty/REGISTER',
  unregister: 'preact-smitty/UNREGISTER',
  setUserStore: 'preact-smitty/SET_USER_STORE',
  userStoreChange: 'preact-smitty/USER_STORE_CHANGE',
  trackAction: 'preact-smitty/TRACK_ACTION',
  releaseAction: 'preact-smitty/RELEASE_ACTION'
})

const calculateNextState = userStoreState =>
  ({instance, mapStateToProps, getProps}) => {
    if (typeof mapStateToProps !== 'function') {
      return
    }

    const nextState = mapStateToProps(userStoreState, getProps())

    if (instance.state !== nextState) {
      instance.setState(nextState)
    }
  }

tree.handleActions({
  [tree.actions.setUserStore]: (state, payload) => {
    state.userStore = payload
  },
  [tree.actions.register]: (state, payload) => {
    payload.instance.store = state.userStore

    if (payload.mapStateToProps.length === 2) {
      payload.instance.componentWillReceiveProps = function (nextProps) {
        if (this.props !== nextProps) {
          calculateNextState(state.userStore.state)(payload)
        }
      }
    }

    state.connections = state.connections.concat(payload)
    calculateNextState(state.userStore.state)(payload)
  },
  [tree.actions.unregister]: (state, payload) => {
    const index = state.connections.findIndex(inst => inst === payload)
    state.connections.splice(index, 1)
  },
  [tree.actions.userStoreChange]: (state, userStoreState) => {
    const updater = calculateNextState(userStoreState)
    state.connections.forEach(updater)
  },
  [tree.actions.trackAction]: (state, payload) => {
    payload.instance.store = state.userStore

    let cb = data => {
      let props = payload.getProps()
      payload.instance.setState(() => ({
        [payload.key]: payload.tracker(
          state.userStore.state,
          data,
          props,
          payload.type
        )
      }))
    }

    payload.instance.componentWillReceiveProps = function (nextProps) {
      if (this.props !== nextProps) {
        cb()
      }
    }

    state.userStore.on(payload.type, cb)
    state.trackers.push({
      instance: payload.instance,
      type: payload.type,
      cb
    })
  },
  [tree.actions.releaseAction]: (state, payload) => {
    const index = state.connections.findIndex(inst => inst === payload)
    const tracker = state.connections[index]
    state.userStore.off(tracker.type, tracker.cb)
    state.connections.splice(index, 1)
  }
})

export class Provider extends Component {
  constructor (props) {
    super(props)
    tree.actions.setUserStore(props.store)
    this.props.store.on('$$store:state:change', tree.actions.userStoreChange)
  }

  render (props) {
    return props.children[0]
  }
}

export function connect (mapStateToProps) {
  return function wrapComponent (WrappedComponent) {
    return class Connect extends Component {
      constructor (props) {
        super(props)
        tree.actions.register({
          instance: this,
          mapStateToProps,
          getProps: () => this.props
        })
      }

      componentWillUnmount () {
        tree.actions.unregister(this.id)
      }

      render (props, state) {
        return createElement(
          WrappedComponent,
          Object.assign({}, props, state, this.store)
        )
      }
    }
  }
}

export function track (type, statePropertyKey, tracker) {
  return function wrapComponent (WrappedComponent) {
    return class Connect extends Component {
      constructor (props) {
        super(props)

        tree.actions.trackAction({
          instance: this,
          type: type.toString(),
          key: statePropertyKey,
          tracker,
          getProps: () => this.props
        })
      }

      componentWillUnmount () {
        tree.actions.releaseAction(this)
      }

      render (props, state) {
        return createElement(
          WrappedComponent,
          Object.assign({}, props, state, this.store)
        )
      }
    }
  }
}

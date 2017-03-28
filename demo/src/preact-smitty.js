import { Component, h } from 'preact'
import { createStore } from '../../src'

function getId (a) {
  return a
    ? (a ^ Math.random() * 16 >> a / 4).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getId)
}

const tree = createStore({
  instances: []
})

tree.createActions({
  register: 'tree/REGISTER',
  unregister: 'tree/UNREGISTER',
  setUserStore: 'tree/SET_USER_STORE',
  userStoreChange: 'tree/USER_STORE_CHANGE'
})

let calculateNextState = (userStoreState) => ({ id, instance, mapStateToProps, getProps }) => {
  if (typeof mapStateToProps !== 'function') {
    return
  }

  const nextState = mapStateToProps.length === 2
    ? mapStateToProps(userStoreState, getProps())
    : mapStateToProps(userStoreState)

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
    state.instances = state.instances.concat(payload)
    calculateNextState(state.userStore.state)(payload)
  },
  [tree.actions.unregister]: (state, payload) => {
    const index = state.instances.findIndex(inst => {
      inst.id === payload
    })
    state.instances.splice(index, 1)
  },
  [tree.actions.userStoreChange]: (state, userStoreState) => {
    const updater = calculateNextState(userStoreState)
    state.instances.forEach(updater)
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
        this.id = getId()
        tree.actions.register({
          id: this.id,
          instance: this,
          mapStateToProps,
          getProps: () => this.props
        })
      }

      componentWillUnmount () {
        tree.actions.unregister(this.id)
      }

      render (props, state) {
        return h(
          WrappedComponent,
          Object.assign({}, Object.assign({}, props), state, {
            emit: this.store.emit,
            actions: this.store.actions
          })
        )
      }
    }
  }
}

/** @jsx h */
import './style.css'
import { render, h, Component } from 'preact'
import localforage from 'localforage'
import { createStore } from '../../src'
import { Provider, connect, track } from './react-smitty'

localforage.config({ name: 'smitty_photo_booth' })

const pp = obj => JSON.stringify(obj, null, 2)
const getId = () => new Date().getTime()

const store = createStore({
  camera: {
    stream: new window.MediaStream(),
    images: []
  },
  ui: {
    selectedImageId: null
  }
})

store.createActions({
  startMediaStream: constraints =>
    async store => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        store.actions.mediaStreamSuccess(stream)
      } catch (err) {
        store.actions.mediaStreamError(err)
      }
    },
  mediaStreamSuccess: 'camera/STREAM_SUCCESS',
  mediaStreamError: 'camera/STREAM_ERROR',
  addImages: 'camera/ADD_IMAGES',
  saveImage: url =>
    store => {
      const id = getId()
      const image = { id, url }
      store.actions.addImages([image])

      localforage
        .getItem('images')
        .then(images => {
          images.push(image)
          localforage.setItem('images', images)
        })
        .catch(err => console.log('Could not save image to db', err))
    },
  selectImage: id =>
    store => {
      store.actions.setSelectedImageById(id)
      window.history.pushState({}, '', id || '/smitty/')
    },
  setSelectedImageById: 'ui/SELECT_IMAGE'
})

store.handleActions({
  [store.actions.mediaStreamSuccess]: (state, stream) => {
    state.camera.stream = stream
  },
  [store.actions.mediaStreamError]: (state, error) => {
    state.camera.streamError = error
  },
  [store.actions.addImages]: (state, images) => {
    state.camera.images = state.camera.images.concat(images)
  },
  [store.actions.setSelectedImageById]: (state, imageId) => {
    state.ui.selectedImageId = imageId
  }
})

localforage.getItem('images').then(images => {
  if (images) {
    store.actions.addImages(images)
  } else {
    localforage.setItem('images', [])
  }
})

if (window.location.pathname !== '/') {
  store.actions.setSelectedImageById(
    decodeURI(window.location.pathname).split('/smitty/')[1]
  )
}

window.onpopstate = function (event) {
  store.actions.setSelectedImageById(
    decodeURI(window.location.pathname).split('/smitty/')[1]
  )
}


@track(
  // action type to update state on
  'camera/STREAM_SUCCESS',
  // key to pass as prop
  'stream',
  // tracker sets the value of the prop "stream" when the action type is emitted
  (state, payload, props, type) => state.camera.stream,
  // shouldTrackerUpdateState: default: () => true
  (state, payload, props, type) => !!payload
)
class Camera extends Component {
  video = null
  canvas = null

  componentDidMount () {
    this.props.actions.startMediaStream({
      audio: false,
      video: true
    })
  }

  render ({ streamError }) {
    return (
      <div
        style={{
          paddingTop: 16,
          paddingRight: 16,
          paddingBottom: 16,
          paddingLeft: 16
        }}
      >
        <h3
          style={{
            height: streamError ? 24 : 0,
            lineHeight: '1.2',
            marginBottom: 16,
            textAlign: 'center',
            color: '#ff6b6b',
            opacity: streamError ? 1 : 0,
            transition: 'all 250ms ease-in-out'
          }}
        >
          {streamError ? streamError.name : ''}
        </h3>
        <video
          ref={node => {
            this.video = node
          }}
          style={{
            width: '100%',
            maxHeight: 'calc(50vh - 16px)',
            background: '#212529',
            cursor: 'pointer'
          }}
          src={
            window.URL && this.props.stream
              ? window.URL.createObjectURL(this.props.stream)
              : this.props.stream
          }
          autoplay
          muted
          onClick={this.handleClick}
        />
        <canvas
          ref={node => {
            this.canvas = node
          }}
          style={{ display: 'none' }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: 16,
            marginBottom: 16
          }}
        >
          <button
            style={{
              paddingTop: 8,
              paddingRight: 16,
              paddingBottom: 8,
              paddingLeft: 16,
              margin: '0 auto',
              fontSize: 20,
              lineHeight: '1.6',
              color: '#adb5bd',
              background: '#343a40',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              opacity: streamError ? 0 : 1,
              transition: 'all 250ms ease-in-out'
            }}
            disabled={streamError}
            type={'button'}
            onClick={this.handleClick}
          >
            Take Picture
          </button>
        </div>

      </div>
    )
  }

  handleClick = () => {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    const width = this.video.videoWidth
    const height = this.video.videoHeight
    canvas.width = width
    canvas.height = height
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(this.video, 0, 0, width, height)

    this.props.actions.saveImage(canvas.toDataURL('image/webp'))
  }
}




@track(
  // Event type to update on
  'ui/SELECT_IMAGE',
  // Name of prop to pass to component
  'selectedImageId',
  // Select value from state
  state => state.ui.selectedImageId
)
@track(
  store.actions.addImages, // Use action creator trick
  'images',
  state => state.camera.images
)
class ImageList extends Component {
  render () {
    const { actions, images = [], selectedImageId } = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'wrap'
        }}
      >
        {images.map((image, i) => {
          return (
            <Image
              key={image.id}
              image={image}
              index={i}
              selected={image.id === selectedImageId}
              onClick={() => {
                actions.selectImage(
                  image.id === selectedImageId ? null : image.id
                )
              }}
            />
          )
        })}
      </div>
    )
  }
}

function Image ({ image, index, onClick, selected }) {
  const wrapperStyles = selected
    ? {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      background: '#f8f9fa',
      zIndex: 10
    }
    : {
      position: 'relative',
      flex: '0 1 auto',
      width: 'calc(33% - 4px)',
      order: index * -1,
      paddingTop: 2,
      paddingRight: 2,
      paddingBottom: 0,
      paddingLeft: 2
    }

  const imgStyles = selected
    ? { display: 'block', width: '90%', borderRadius: 8, margin: '64px auto' }
    : { width: '100%', borderRadius: 4 }

  return (
    <a
      style={wrapperStyles}
      class={selected ? 'animate-in' : ''}
      href={image.url}
      target={'_blank'}
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      <img src={image.url} className={'image'} style={imgStyles} />
    </a>
  )
}

function GithubRibbon () {
  return (
    <iframe
      src='https://ghbtns.com/github-btn.html?user=tkh44&amp;repo=smitty&amp;type=star&amp;count=true&amp;size=large'
      frameborder='0'
      scrolling='0'
      width='160px'
      height='30px'
      style={{ marginLeft: 'auto' }}
    />
  )
}

const App = connect(state => ({ state }))(props => (
  <div style={{ display: 'flex' }}>
    <div
      style={{
        flex: '1 0 50%',
        height: '100vh',
        background: '#212529',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: props.state.camera.streamError ? '#f8f9fa' : '#212529',
        cursor: 'pointer',
        transition: 'all 250ms ease-in-out'
      }}
    >
      <Camera />
      <div style={{ color: '#adb5bd' }}>
        <h3>Current State</h3>
        <pre>
          {pp(props.state)}
        </pre>
      </div>

    </div>

    <div
      style={{
        flex: '1 0 50%',
        height: '100vh',
        background: '#f8f9fa',
        borderLeft: '1px solid #dee2e6',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #dee2e6',
          paddingRight: 8,
          paddingLeft: 8
        }}
      >
        <h2>Smitty Photo Booth Demo</h2>
        <a
          href={'https://github.com/tkh44/smitty/tree/master/demo/src'}
          style={{ fontSize: '1rem', color: '#329af0', marginLeft: 8 }}
          target={'_blank'}
        >
          source
        </a>
        <GithubRibbon />
      </div>
      <ImageList />
    </div>
  </div>
))

const Root = function (props) {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Root

/** @jsx h */
import './style.css'
import { render, h, Component } from 'preact'
import { Provider, connect } from 'preact-smitty'
import { createStore } from '../../src'

const store = createStore({
  camera: {
    recording: false,
    stream: new window.MediaStream(),
    images: []
  }
})

const recordVideo = (emit, { camera }) => {
  if (camera.recording) {
    emit('camera/STOP_RECORDING')
    return
  }

  emit('camera/START_RECORDING')

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 }
    })
    .then(stream => {
      emit('camera/SET_STREAM_SUCCESS', stream)
    })
    .catch(err => {
      emit('camera/SET_STREAM_ERROR', err)
    })
}

store.addReducer({
  'camera/START_RECORDING': state => {
    state.camera.recording = true
  },
  'camera/STOP_RECORDING': state => {
    state.camera.recording = false
  },
  'camera/SET_STREAM_SUCCESS': (state, payload) => {
    state.camera.stream = payload
  },
  'camera/SET_STREAM_ERROR': (state, payload) => {
    state.camera.streamError = payload
  },
  'camera/ADD_IMAGE': (state, payload) => {
    state.camera.images.push(payload)
  }
})

const pp = obj => JSON.stringify(obj, null, 2)

const Camera = connect(state => ({
  stream: state.camera.stream
}))(
  class Camera extends Component {
    video = null;
    canvas = null;

    componentDidMount () {
      this.props.emit(recordVideo)
    }

    render () {
      return (
        <div
          style={{
            width: '50vw',
            minHeight: '100vh',
            background: '#212529',
            paddingTop: 16,
            paddingRight: 16,
            paddingBottom: 16,
            paddingLeft: 16
          }}
        >
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
              window.URL
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
                cursor: 'pointer'
              }}
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

      this.props.emit('camera/ADD_IMAGE', canvas.toDataURL('image/webp'))
    };
  }
)

const ImageList = connect(state => ({
  images: state.camera.images
}))(function ImageList ({ images }) {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'wrap-reverse'
      }}
    >
      {images.map((image, i) => {
        return <Image image={image} last={i === images.length - 1} />
      })}
    </div>
  )
})

function Image ({ image, last }) {
  return (
    <a
      style={{
        position: 'relative',
        flex: '1 0 auto',
        width: last ? '100%' : '33%'
      }}
      href={image}
    >
      <img src={image} style={{ width: '100%' }} />
    </a>
  )
}

const App = connect(state => state)(props => (
  <div style={{ display: 'flex' }}>
    <Camera />
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

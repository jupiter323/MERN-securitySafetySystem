import React from 'react'
import { connect } from 'react-redux'
import './style.scss'
import Unity, { UnityContent } from 'react-unity-webgl'

const mapStateToProps = (state, props) => ({
  urls: state.urls,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class SensorView extends React.Component {
  state = {
    border: 'blue',
  }
  constructor(props) {
    super(props)
    this.unityContent = new UnityContent('Build/webgl.json', 'Build/UnityLoader.js', {
      adjustOnWindowResize: true,
      id: 'MyGame',
    })
  }

  componentDidUpdate() {
    console.log('Resizing')
  }

  componentDidMount() {}

  handleResize = () => {
    console.log('Resizing')
  }

  handleMouseDown = e => {
    if (e.target.className !== 'movableArea') {
      //e.preventDefault();
      let { setSensorViewDraggable } = this.props
      setSensorViewDraggable(false)
    }
  }

  render() {
    let { border } = this.state
    let cornerImage = ''
    if (border === 'blue') {
      cornerImage = 'resources/images/background/blue-corner.png'
    }

    return (
      <div
        className={'SensorViewController'}
        onResize={this.handleResize}
        onMouseDown={this.handleMouseDown}
      >
        <Unity unityContent={this.unityContent} />
        <div className={'movableArea'} />
        <img src={cornerImage} className="cornerImage" alt="corner" />
      </div>
    )
  }
}

export default SensorView

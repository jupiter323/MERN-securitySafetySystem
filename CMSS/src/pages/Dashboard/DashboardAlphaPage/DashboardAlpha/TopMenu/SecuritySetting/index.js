import React from 'react'
import { connect } from 'react-redux'
import './style.scss'
import cookie from 'react-cookie'
import { message } from 'antd'

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class SecuritySetting extends React.Component {
  state = {
    selectedLevel: 0,
  }

  selectLevel = index => {
    this.setState({
      selectedLevel: index,
    })
  }

  setSecurityLevel = () => {
    let { userName, password } = this.props
    let { selectedLevel } = this.state
    if (selectedLevel === 0) {
      message.error('Please select system security level.')
      return
    }
    let currentSecurityLevel = cookie.load('SecurityLevelId')
    console.log('send data', currentSecurityLevel, selectedLevel)
    if (currentSecurityLevel === selectedLevel.toString()) {
      document.getElementById('root').style.cursor = 'default'
    } else {
      let data =
        '<UserChangeSecurityLevel><' + userName + '><' + password + '><' + selectedLevel + '>'
      this.props.webSocket.send(data)
      document.getElementById('root').style.cursor = 'default'
    }
    this.setState({
      selectedLevel: 0,
    })
    let { onClose } = this.props
    onClose()
  }

  render() {
    let cornerImage = 'resources/images/background/blue-corner.png'
    let { selectedLevel } = this.state
    let { display, onClose } = this.props
    return (
      <div className="SecuritySettingView" style={{ display: display }}>
        <div className={'captionArea'}>CHANGE SECURITY LEVEL</div>
        <div className={'SecurityNumberArea'}>
          <div
            className={selectedLevel === 1 ? 'NumberButton first selected' : 'NumberButton first'}
            onClick={this.selectLevel.bind(this, 1)}
          >
            -1
          </div>
          <div
            className={selectedLevel === 2 ? 'NumberButton second selected' : 'NumberButton second'}
            onClick={this.selectLevel.bind(this, 2)}
          >
            0
          </div>
          <div
            className={selectedLevel === 3 ? 'NumberButton third selected' : 'NumberButton third'}
            onClick={this.selectLevel.bind(this, 3)}
          >
            1
          </div>
          <div
            className={selectedLevel === 4 ? 'NumberButton fourth selected' : 'NumberButton fourth'}
            onClick={this.selectLevel.bind(this, 4)}
          >
            2
          </div>
          <div
            className={selectedLevel === 5 ? 'NumberButton fifth selected' : 'NumberButton fifth'}
            onClick={this.selectLevel.bind(this, 5)}
          >
            3
          </div>
        </div>
        <div className={'buttonArea'}>
          <div className={'setButton'} onClick={this.setSecurityLevel}>
            CHANGE
          </div>
        </div>
        <button className={'closeButton'} onClick={onClose} />
      </div>
    )
  }
}

export default SecuritySetting

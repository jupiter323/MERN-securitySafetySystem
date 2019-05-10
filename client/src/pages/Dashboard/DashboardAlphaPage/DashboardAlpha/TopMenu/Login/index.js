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
class LoginView extends React.Component {
  state = {
    selectedLevel: 0,
    userName: '',
    password: '',
  }

  onLogin = () => {
    let { userName, password } = this.state
    if (userName === '') {
      message.warning('Input user name.')
      return
    }
    if (password === '') {
      message.warning('Input password.')
      return
    }
    let data =
      '<UserCheckPermission><' + userName + '><' + password + '><Modify System Security Level>'
    this.props.webSocket.send(data)
    this.props.openSecuritySettingView(userName, password)
    document.getElementById('root').style.cursor = 'wait'
    this.setState({
      userName: '',
      password: '',
    })
    let { onClose } = this.props
    onClose()
  }

  onUserNameChange = event => {
    let userName = event.target.value
    this.setState({
      userName: userName,
    })
  }

  onPasswordChange = event => {
    let password = event.target.value
    this.setState({
      password: password,
    })
  }

  render() {
    let cornerImage = 'resources/images/background/blue-corner.png'
    let { userName, password } = this.state
    let { display, onClose } = this.props
    return (
      <div className="LoginView" style={{ display: display }}>
        <div className={'captionArea'}>LOGIN</div>
        <div className={'fieldArea firstField'}>
          <div className={'captionItem'}>USER NAME</div>
          <div className={'inputItem'}>
            <input type={'text'} value={userName} onChange={this.onUserNameChange.bind(this)} />
          </div>
        </div>
        <div className={'fieldArea'}>
          <div className={'captionItem'}>PASSWORD</div>
          <div className={'inputItem'}>
            <input type={'password'} value={password} onChange={this.onPasswordChange.bind(this)} />
          </div>
        </div>
        <div className={'buttonArea'}>
          <div className={'loginButton'} onClick={this.onLogin}>
            LOGIN
          </div>
        </div>
        <button className={'closeButton'} onClick={onClose} />
      </div>
    )
  }
}

export default LoginView

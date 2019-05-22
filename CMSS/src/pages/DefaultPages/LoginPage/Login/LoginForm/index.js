import React from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { REDUCER, submit } from 'ducks/login'
import { push } from 'react-router-redux'
import { Form, Input, Button, message } from 'antd'
import * as app from 'ducks/app'
import { triggerManualEvent } from 'ducks/Milestone'
import rootReducer from 'ducks/redux'

const FormItem = Form.Item

const mapStateToProps = (state, props) => ({
  isSubmitForm: state.app.submitForms[REDUCER],
})

let socketUrl = rootReducer.socketUrl

@connect(mapStateToProps)
@Form.create()
class LoginForm extends React.Component {
  static defaultProps = {}

  state = {
    title: 'LOGIN',
    submit: 'LOGIN',
  }

  ws = new WebSocket(socketUrl)
  socketOpened = false

  componentDidMount() {
    this.ws.onopen = () => {
      console.log('opened')
      this.socketOpened = true
    }

    this.ws.onmessage = evt => {
      var received_msg = evt.data
      let temp_array = received_msg.split('<')
      if (temp_array.length > 1) {
        let command = temp_array[1].slice(0, -1)
        let { dispatch } = this.props
        switch (command) {
          case 'UserLogon': {
            if (temp_array.length === 8) {
              cookie.save('UserName', temp_array[2].slice(0, -1))
              cookie.save('Password', temp_array[3].slice(0, -1))
              cookie.save('MilestoneUser', temp_array[5].slice(0, -1))
              cookie.save('MilestonePassword', temp_array[6].slice(0, -1))
              cookie.save('UserSecurityClearance', temp_array[7].slice(0, -1))
              dispatch(
                submit({
                  username: temp_array[5].slice(0, -1),
                  password: temp_array[6].slice(0, -1),
                }),
              )
              //Get System Info
              let data = '<GetSystemInfo>'
              this.ws.send(data)
            } else {
              message.error('Invalid username or password')
            }
            break
          }
          case 'GetSystemInfo': {
            let result = temp_array[2].slice(0, -1)
            if (result === 'OK') {
              let systemSecurityLevel = 'Security Level -1'
              if (temp_array.length === 8) {
                systemSecurityLevel = temp_array[5].slice(0, -1)
              }
              dispatch({
                type: 'SET_System_Security_Level',
                systemSecurityLevel: systemSecurityLevel,
              })
              cookie.save('SecurityLevelId', temp_array[4].slice(0, -1))
              cookie.save('SecurityLevelImage', temp_array[5].slice(0, -1))
              //Check User Permission
              let userName = cookie.load('UserName')
              let password = cookie.load('Password')
              let permission_info =
                '<UserCheckPermission><' +
                userName +
                '><' +
                password +
                '><Modify System Security Level>'
              this.ws.send(permission_info)
            } else {
              message.error('YOU CAN NOT GET SYSTEM SECURITY LEVEL')
            }
            break
          }
          case 'UserCheckPermission': {
            if (temp_array.length === 7) {
              let permission_type = temp_array[4].slice(0, -1)
              if (permission_type === 'Modify System Security Level') {
                let result = temp_array[5].slice(0, -1)
                if (result === 'OK') {
                  cookie.save('SystemSecurityLevel', 'Modify System Security Level')
                } else {
                  cookie.save('SystemSecurityLevel', 'Invalid')
                }

                let userName = cookie.load('UserName')
                let password = cookie.load('Password')
                let permission_info =
                  '<UserCheckPermission><' +
                  userName +
                  '><' +
                  password +
                  '><Modify Camera Motion Detection>'
                this.ws.send(permission_info)
              } else if (permission_type === 'Modify Camera Motion Detection') {
                let result = temp_array[5].slice(0, -1)
                if (result === 'OK') {
                  cookie.save('CameraMotionDetection', 'Modify Camera Motion Detection')
                } else {
                  cookie.save('CameraMotionDetection', 'Invalid')
                }
              }
            }
            break
          }
        }
      }
    }

    this.ws.onclose = () => {
      // websocket is closed.
      console.log('Connection is closed...')
      this.socketOpened = false
      document.getElementById('root').style.cursor = 'default'
      triggerManualEvent()
    }
  }

  openSocket = data => {
    this.ws = new WebSocket(socketUrl)
    this.ws.onopen = () => {
      console.log('opened')
      this.socketOpened = true
      this.ws.send(data)
    }
    this.ws.onmessage = evt => {
      var received_msg = evt.data
      let temp_array = received_msg.split('<')
      if (temp_array.length > 1) {
        let command = temp_array[1].slice(0, -1)
        let { dispatch } = this.props
        switch (command) {
          case 'UserLogon': {
            if (temp_array.length === 8) {
              cookie.save('UserName', temp_array[2].slice(0, -1))
              cookie.save('Password', temp_array[3].slice(0, -1))
              cookie.save('MilestoneUser', temp_array[5].slice(0, -1))
              cookie.save('MilestonePassword', temp_array[6].slice(0, -1))
              cookie.save('UserSecurityClearance', temp_array[7].slice(0, -1))
              dispatch(
                submit({
                  username: temp_array[5].slice(0, -1),
                  password: temp_array[6].slice(0, -1),
                }),
              )
              //Get System Info
              let data = '<GetSystemInfo>'
              this.ws.send(data)
            } else {
              message.error('Invalid username or password')
            }
            break
          }
          case 'GetSystemInfo': {
            let result = temp_array[2].slice(0, -1)
            if (result === 'OK') {
              let systemSecurityLevel = 'Security Level -1'
              if (temp_array.length === 8) {
                systemSecurityLevel = temp_array[5].slice(0, -1)
              }
              dispatch({
                type: 'SET_System_Security_Level',
                systemSecurityLevel: systemSecurityLevel,
              })
              cookie.save('SecurityLevelId', temp_array[4].slice(0, -1))
              cookie.save('SecurityLevelImage', temp_array[5].slice(0, -1))
              //Check User Permission
              let userName = cookie.load('UserName')
              let password = cookie.load('Password')
              let permission_info =
                '<UserCheckPermission><' +
                userName +
                '><' +
                password +
                '><Modify System Security Level>'
              this.ws.send(permission_info)
            } else {
              message.error('YOU CAN NOT GET SYSTEM SECURITY LEVEL')
            }
            break
          }
          case 'UserCheckPermission': {
            if (temp_array.length === 7) {
              let permission_type = temp_array[4].slice(0, -1)
              if (permission_type === 'Modify System Security Level') {
                let result = temp_array[5].slice(0, -1)
                if (result === 'OK') {
                  cookie.save('SystemSecurityLevel', 'Modify System Security Level')
                } else {
                  cookie.save('SystemSecurityLevel', 'Invalid')
                }

                let userName = cookie.load('UserName')
                let password = cookie.load('Password')
                let permission_info =
                  '<UserCheckPermission><' +
                  userName +
                  '><' +
                  password +
                  '><Modify Camera Motion Detection>'
                this.ws.send(permission_info)
              } else if (permission_type === 'Modify Camera Motion Detection') {
                let result = temp_array[5].slice(0, -1)
                if (result === 'OK') {
                  cookie.save('CameraMotionDetection', 'Modify Camera Motion Detection')
                } else {
                  cookie.save('CameraMotionDetection', 'Invalid')
                }
              }
            }
            break
          }
        }
      }
    }

    this.ws.onclose = () => {
      // websocket is closed.
      console.log('Connection is closed...')
      this.socketOpened = false
      document.getElementById('root').style.cursor = 'default'
      triggerManualEvent()
    }
    this.ws.onerror = () => {
      message.error('Cannot connect to Safety and Security System.')
    }
    setTimeout(() => {
      if (!this.socketOpened) {
        //message.error('Cannot connect to Safety and Security System.');
      }
    }, 2000)
  }

  // $FlowFixMe
  onSubmit = (isSubmitForm: ?boolean) => event => {
    event.preventDefault()
    const { form } = this.props

    if (!isSubmitForm) {
      form.validateFields((error, values) => {
        if (!error) {
          const { password, username } = values
          let data = '<UserLogon><' + username + '><' + password + '>'
          if (!this.socketOpened) {
            this.openSocket(data)
          } else {
            this.ws.send(data)
            document.getElementById('root').style.cursor = 'wait'
            triggerManualEvent()
          }
        }
      })
    }
  }

  render() {
    const { form, isSubmitForm } = this.props
    return (
      <div
        className="cat__pages__login__block__form"
        style={{
          padding: '0% 15%',
          color: 'rgba(0,237,255)',
        }}
      >
        <div
          className="text-uppercase bg-transparent h5"
          style={{
            position: 'absolute',
            right: '5%',
            top: '0px',
            textAlign: 'center',
            color: 'rgba(0,237,255)',
            background: 'rgba(22,50,173,0.8)',
            border: 'solid 2px #00efff',
            borderRadius: '5px',
            boxShadow: '0 0 20px 1px #0274ff, inset 0 0 20px rgb(2,116,255)',
            padding: '0% 4%',
            //border: '1px solid rgba(0,237,255)'
          }}
        >
          {this.state.title}
        </div>
        <br />
        <br />
        <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
          <FormItem
            label="USER NAME"
            className="title-label"

          >
            {form.getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input user name' }],
            })(
              <Input
                className="bg-transparent"
                size="default"
                style={{
                  color: 'rgba(0,237,255)',
                  border: 'solid 2px #00efff',
                  borderRadius: '5px',
                  boxShadow: '0 0 20px 1px #0274ff',
                }}
              />,
            )}
          </FormItem>
          <FormItem label="PASSWORD" className="title-label">
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your password' }],
            })(
              <Input
                className="bg-transparent"
                size="default"
                type="password"
                style={{
                  color: 'rgba(0,237,255)',
                  border: 'solid 2px #00efff',
                  borderRadius: '5px',
                  boxShadow: '0 0 20px 1px #0274ff',
                }}
              />,
            )}
          </FormItem>
          <br />
          <br />
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              className="bg-transparent"
              htmlType="submit"
              loading={isSubmitForm}
              style={{
                color: 'rgba(0,237,255)',
                border: 'solid 2px #00efff',
                borderRadius: '5px',
                boxShadow: '0 0 20px 1px #0274ff',
                width: '50%',
                background: 'rgba(22,50,173,0.8)',
              }}
            >
              {this.state.submit}
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default LoginForm

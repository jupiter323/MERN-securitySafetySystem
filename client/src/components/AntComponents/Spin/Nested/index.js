import React from 'react'
import './style.scss'
import { Spin, Switch, Alert } from 'antd'

export default function(ReactDOM, mountNode) {
  class Card extends React.Component {
    state = { loading: false }
    toggle = value => {
      this.setState({ loading: value })
    }
    render() {
      return (
        <div>
          <Spin spinning={this.state.loading}>
            <Alert
              message="Alert message title"
              description="Further details about the context of this alert."
              type="info"
            />
          </Spin>
          <div style={{ marginTop: 16 }}>
            Loading state：<Switch checked={this.state.loading} onChange={this.toggle} />
          </div>
        </div>
      )
    }
  }

  ReactDOM.render(<Card />, mountNode)
}

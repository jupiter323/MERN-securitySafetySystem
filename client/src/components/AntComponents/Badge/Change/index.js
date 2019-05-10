import React from 'react'
import './style.scss'
import { Badge, Button, Icon, Switch } from 'antd'

export default function(ReactDOM, mountNode) {
  const ButtonGroup = Button.Group

  class Demo extends React.Component {
    state = {
      count: 5,
      show: true,
    }

    increase = () => {
      const count = this.state.count + 1
      this.setState({ count })
    }

    decline = () => {
      let count = this.state.count - 1
      if (count < 0) {
        count = 0
      }
      this.setState({ count })
    }

    onChange = show => {
      this.setState({ show })
    }

    render() {
      return (
        <div>
          <div>
            <Badge count={this.state.count}>
              <a href="javascript: void(0);" className="head-example" />
            </Badge>
            <ButtonGroup>
              <Button onClick={this.decline}>
                <Icon type="minus" />
              </Button>
              <Button onClick={this.increase}>
                <Icon type="plus" />
              </Button>
            </ButtonGroup>
          </div>
          <div style={{ marginTop: 10 }}>
            <Badge dot={this.state.show}>
              <a href="javascript: void(0);" className="head-example" />
            </Badge>
            <Switch onChange={this.onChange} checked={this.state.show} />
          </div>
        </div>
      )
    }
  }

  ReactDOM.render(<Demo />, mountNode)
}

import React from 'react'
import './style.scss'
import { Progress, Button } from 'antd'

export default function(ReactDOM, mountNode) {
  const ButtonGroup = Button.Group

  class App extends React.Component {
    state = {
      percent: 0,
    }
    increase = () => {
      let percent = this.state.percent + 10
      if (percent > 100) {
        percent = 100
      }
      this.setState({ percent })
    }
    decline = () => {
      let percent = this.state.percent - 10
      if (percent < 0) {
        percent = 0
      }
      this.setState({ percent })
    }
    render() {
      return (
        <div>
          <Progress type="circle" percent={this.state.percent} />
          <ButtonGroup>
            <Button onClick={this.decline} icon="minus" />
            <Button onClick={this.increase} icon="plus" />
          </ButtonGroup>
        </div>
      )
    }
  }

  ReactDOM.render(<App />, mountNode)
}

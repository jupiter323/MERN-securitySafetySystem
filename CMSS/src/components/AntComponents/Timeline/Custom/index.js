import React from 'react'
import './style.scss'
import { Timeline, Icon } from 'antd'

export default function(ReactDOM, mountNode) {
  ReactDOM.render(
    <Timeline>
      <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
      <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
      <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
        Technical testing 2015-09-01
      </Timeline.Item>
      <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
    </Timeline>,
    mountNode,
  )
}

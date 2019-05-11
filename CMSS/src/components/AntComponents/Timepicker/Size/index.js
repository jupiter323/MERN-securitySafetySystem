import React from 'react'
import './style.scss'
import { TimePicker } from 'antd'

import moment from 'moment'

export default function(ReactDOM, mountNode) {
  ReactDOM.render(
    <div>
      <TimePicker defaultValue={moment('12:08:23', 'HH:mm:ss')} size="large" />
      <TimePicker defaultValue={moment('12:08:23', 'HH:mm:ss')} />
      <TimePicker defaultValue={moment('12:08:23', 'HH:mm:ss')} size="small" />
    </div>,
    mountNode,
  )
}

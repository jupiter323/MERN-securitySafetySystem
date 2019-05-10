import React from 'react'
import './style.scss'
import { Badge } from 'antd'

export default function(ReactDOM, mountNode) {
  ReactDOM.render(
    <div>
      <Badge status="success" />
      <Badge status="error" />
      <Badge status="default" />
      <Badge status="processing" />
      <Badge status="warning" />
      <br />
      <Badge status="success" text="Success" />
      <br />
      <Badge status="error" text="Error" />
      <br />
      <Badge status="default" text="Default" />
      <br />
      <Badge status="processing" text="Processing" />
      <br />
      <Badge status="warning" text="Warning" />
    </div>,
    mountNode,
  )
}

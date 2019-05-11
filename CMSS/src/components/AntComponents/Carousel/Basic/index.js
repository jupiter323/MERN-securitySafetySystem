import React from 'react'
import './style.scss'
import { Carousel } from 'antd'

export default function(ReactDOM, mountNode) {
  function onChange(a, b, c) {
    console.log(a, b, c)
  }

  ReactDOM.render(
    <Carousel afterChange={onChange}>
      <div>
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
    </Carousel>,
    mountNode,
  )
}

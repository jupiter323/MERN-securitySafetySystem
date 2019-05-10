import React from 'react'
import './style.scss'
import { Slider } from 'antd'

export default function(ReactDOM, mountNode) {
  function onChange(value) {
    console.log('onChange: ', value)
  }

  function onAfterChange(value) {
    console.log('onAfterChange: ', value)
  }

  ReactDOM.render(
    <div>
      <Slider defaultValue={30} onChange={onChange} onAfterChange={onAfterChange} />
      <Slider
        range
        step={10}
        defaultValue={[20, 50]}
        onChange={onChange}
        onAfterChange={onAfterChange}
      />
    </div>,
    mountNode,
  )
}

import React from 'react'
import './style.scss'
import { Radio } from 'antd'

export default function(ReactDOM, mountNode) {
  const RadioButton = Radio.Button
  const RadioGroup = Radio.Group

  function onChange(e) {
    console.log(`radio checked:${e.target.value}`)
  }

  ReactDOM.render(
    <div>
      <div>
        <RadioGroup onChange={onChange} defaultValue="a">
          <RadioButton value="a">Hangzhou</RadioButton>
          <RadioButton value="b">Shanghai</RadioButton>
          <RadioButton value="c">Beijing</RadioButton>
          <RadioButton value="d">Chengdu</RadioButton>
        </RadioGroup>
      </div>
      <div style={{ marginTop: 16 }}>
        <RadioGroup onChange={onChange} defaultValue="a">
          <RadioButton value="a">Hangzhou</RadioButton>
          <RadioButton value="b" disabled>
            Shanghai
          </RadioButton>
          <RadioButton value="c">Beijing</RadioButton>
          <RadioButton value="d">Chengdu</RadioButton>
        </RadioGroup>
      </div>
      <div style={{ marginTop: 16 }}>
        <RadioGroup disabled onChange={onChange} defaultValue="a">
          <RadioButton value="a">Hangzhou</RadioButton>
          <RadioButton value="b">Shanghai</RadioButton>
          <RadioButton value="c">Beijing</RadioButton>
          <RadioButton value="d">Chengdu</RadioButton>
        </RadioGroup>
      </div>
    </div>,
    mountNode,
  )
}

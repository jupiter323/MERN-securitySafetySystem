import React from 'react'
import './style.scss'
import { Input, Select, Icon } from 'antd'

export default function(ReactDOM, mountNode) {
  const Option = Select.Option

  const selectBefore = (
    <Select defaultValue="Http://" style={{ width: 90 }}>
      <Option value="Http://">Http://</Option>
      <Option value="Https://">Https://</Option>
    </Select>
  )
  const selectAfter = (
    <Select defaultValue=".com" style={{ width: 80 }}>
      <Option value=".com">.com</Option>
      <Option value=".jp">.jp</Option>
      <Option value=".cn">.cn</Option>
      <Option value=".org">.org</Option>
    </Select>
  )

  ReactDOM.render(
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input addonBefore="Http://" addonAfter=".com" defaultValue="mysite" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input addonAfter={<Icon type="setting" />} defaultValue="mysite" />
      </div>
    </div>,
    mountNode,
  )
}

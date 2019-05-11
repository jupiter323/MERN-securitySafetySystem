import React from 'react'
import './style.scss'
import { TreeSelect } from 'antd'

export default function(ReactDOM, mountNode) {
  const SHOW_PARENT = TreeSelect.SHOW_PARENT

  const treeData = [
    {
      label: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          label: 'Child Node1',
          value: '0-0-0',
          key: '0-0-0',
        },
      ],
    },
    {
      label: 'Node2',
      value: '0-1',
      key: '0-1',
      children: [
        {
          label: 'Child Node3',
          value: '0-1-0',
          key: '0-1-0',
        },
        {
          label: 'Child Node4',
          value: '0-1-1',
          key: '0-1-1',
        },
        {
          label: 'Child Node5',
          value: '0-1-2',
          key: '0-1-2',
        },
      ],
    },
  ]

  class Demo extends React.Component {
    state = {
      value: ['0-0-0'],
    }
    onChange = value => {
      console.log('onChange ', value, arguments)
      this.setState({ value })
    }
    render() {
      const tProps = {
        treeData,
        value: this.state.value,
        onChange: this.onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: 'Please select',
        style: {
          width: 300,
        },
      }
      return <TreeSelect {...tProps} />
    }
  }

  ReactDOM.render(<Demo />, mountNode)
}

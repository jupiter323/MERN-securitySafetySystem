import React from 'react'
import './style.scss'
import { Table } from 'antd'

export default function(ReactDOM, mountNode) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ]
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ]

  ReactDOM.render(
    <div>
      <h4>Middle size table</h4>
      <Table columns={columns} dataSource={data} size="middle" />
      <h4>Small size table</h4>
      <Table columns={columns} dataSource={data} size="small" />
    </div>,
    mountNode,
  )
}

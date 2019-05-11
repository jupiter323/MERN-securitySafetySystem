import React from 'react'
import './style.scss'
import { Table } from 'antd'

export default function(ReactDOM, mountNode) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ]

  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    })
  }

  ReactDOM.render(
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />,
    mountNode,
  )
}

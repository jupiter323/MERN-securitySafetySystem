import React from 'react'
import './style.scss'
import { List, message, Avatar, Spin } from 'antd'

import reqwest from 'reqwest'

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'

import VList from 'react-virtualized/dist/commonjs/List'

import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'

export default function(ReactDOM, mountNode) {
  const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo'

  class VirtualizedExample extends React.Component {
    state = {
      data: [],
      loading: false,
    }
    loadedRowsMap = {}
    getData = callback => {
      reqwest({
        url: fakeDataUrl,
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        success: res => {
          callback(res)
        },
      })
    }
    componentWillMount() {
      this.getData(res => {
        this.setState({
          data: res.results,
        })
      })
    }
    handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
      let data = this.state.data
      this.setState({
        loading: true,
      })
      for (let i = startIndex; i <= stopIndex; i++) {
        // 1 means loading
        this.loadedRowsMap[i] = 1
      }
      if (data.length > 19) {
        message.warning('Virtualized Transactions loaded all')
        this.setState({
          loading: false,
        })
        return
      }
      this.getData(res => {
        data = data.concat(res.results)
        this.setState({
          data,
          loading: false,
        })
      })
    }
    isRowLoaded = ({ index }) => {
      return !!this.loadedRowsMap[index]
    }
    renderItem = ({ index, key, style }) => {
      const { data } = this.state
      const item = data[index]
      return (
        <List.Item key={key} style={style}>
          <List.Item.Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={<a href="https://ant.design">{item.name.last}</a>}
            description={item.email}
          />
          <div>Content</div>
        </List.Item>
      )
    }
    render() {
      const { data } = this.state
      const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
        <VList
          autoHeight
          height={height}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          overscanRowCount={2}
          rowCount={data.length}
          rowHeight={73}
          rowRenderer={this.renderItem}
          onRowsRendered={onRowsRendered}
          scrollTop={scrollTop}
          width={width}
        />
      )
      const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
        <AutoSizer disableHeight>
          {({ width }) =>
            vlist({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width })
          }
        </AutoSizer>
      )
      const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.handleInfiniteOnLoad}
          rowCount={data.length}
        >
          {({ onRowsRendered }) =>
            autoSize({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered })
          }
        </InfiniteLoader>
      )
      return (
        <List>
          {data.length > 0 && (
            <WindowScroller scrollElement={null}>{infiniteLoader}</WindowScroller>
          )}
          {this.state.loading && <Spin className="demo-loading" />}
        </List>
      )
    }
  }

  ReactDOM.render(<VirtualizedExample />, mountNode)
}

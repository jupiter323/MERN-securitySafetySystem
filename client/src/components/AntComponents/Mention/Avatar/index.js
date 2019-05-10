import React from 'react'
import './style.scss'
import { Mention, Avatar } from 'antd'

export default function(ReactDOM, mountNode) {
  const Nav = Mention.Nav

  const webFrameworks = [
    {
      name: 'React',
      type: 'JavaScript',
      icon: 'https://zos.alipayobjects.com/rmsportal/LFIeMPzdLcLnEUe.svg',
    },
    {
      name: 'Angular',
      type: 'JavaScript',
      icon: 'https://zos.alipayobjects.com/rmsportal/PJTbxSvzYWjDZnJ.png',
    },
    {
      name: 'Dva',
      type: 'Javascript',
      icon: 'https://zos.alipayobjects.com/rmsportal/EYPwSeEJKxDtVxI.png',
    },
    {
      name: 'Flask',
      type: 'Python',
      icon: 'https://zos.alipayobjects.com/rmsportal/xaypBUijfnpAlXE.png',
    },
  ]

  class CustomNavMention extends React.Component {
    state = {
      suggestions: [],
    }
    onSearchChange = value => {
      const searchValue = value.toLowerCase()
      const filtered = webFrameworks.filter(
        item => item.name.toLowerCase().indexOf(searchValue) !== -1,
      )
      const suggestions = filtered.map(suggestion => (
        <Nav value={suggestion.name} data={suggestion} disabled={suggestion.disabled}>
          <Avatar
            src={suggestion.icon}
            size="small"
            style={{ width: 14, height: 14, marginRight: 8, top: 2, position: 'relative' }}
          />
          {suggestion.name} - {suggestion.type}
        </Nav>
      ))
      this.setState({ suggestions })
    }
    render() {
      const { suggestions } = this.state
      return (
        <Mention
          style={{ width: '100%' }}
          suggestions={suggestions}
          onSearchChange={this.onSearchChange}
        />
      )
    }
  }

  ReactDOM.render(<CustomNavMention />, mountNode)
}

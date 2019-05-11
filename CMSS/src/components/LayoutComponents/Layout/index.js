import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'react-redux-spinner'
import { BackTop, Layout as AntLayout } from 'antd'
import Routes from 'routes'
import Footer from 'components/LayoutComponents/Footer'
import Menu from 'components/LayoutComponents/Menu'
import Content from 'components/LayoutComponents/Content'
import Loader from 'components/LayoutComponents/Loader'
import LayoutState from 'components/LayoutComponents/LayoutState'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'

const AntContent = AntLayout.Content
const AntHeader = AntLayout.Header
const AntFooter = AntLayout.Footer

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
}

let isMobile
enquireScreen(b => {
  isMobile = b
})

let contentBuffer = {
  pathName: null,
  content: null,
}

class Layout extends React.Component {
  static childContextTypes = {
    getContentBuffer: PropTypes.func,
    setContentBuffer: PropTypes.func,
  }

  state = {
    isMobile,
    backgroundImage: 'url(resources/images/background/background.png)',
  }

  getChildContext() {
    return {
      getContentBuffer: () => contentBuffer,
      setContentBuffer: ({ pathName, content }) => (contentBuffer = { pathName, content }),
    }
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      })
    })
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
  }

  render() {
    const isMobile = !!this.state.isMobile
    const { backgroundImage } = this.state
    return (
      <ContainerQuery query={query}>
        {params => (
          <div
              className={classNames(params)}
              style={{ backgroundImage: backgroundImage }}
          >
            <AntLayout>
              <LayoutState />
              <Loader />
              <Spinner />
              <BackTop />
              <Routes />
              <AntLayout>
                <AntContent style={{ height: '100%' }}>
                  <Content />
                </AntContent>
              </AntLayout>
            </AntLayout>
          </div>
        )}
      </ContainerQuery>
    )
  }
}

export default Layout

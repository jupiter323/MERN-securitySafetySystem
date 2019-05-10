import React from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import DashboardAlpha from './DashboardAlpha/index'

class DashboardAlphaPage extends React.Component {
  static defaultProps = {
    pathName: 'Dashboard Alpha',
    roles: ['agent', 'administrator'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Dashboard Alpha" />
        <DashboardAlpha />
      </Page>
    )
  }
}

export default DashboardAlphaPage

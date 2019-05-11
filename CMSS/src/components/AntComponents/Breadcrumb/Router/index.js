import React from 'react'
import './style.scss'
import { Router, Route, Link, hashHistory } from 'react-router'

import { Breadcrumb, Alert } from 'antd'

export default function(ReactDOM, mountNode) {
  const Apps = () => (
    <ul className="app-list">
      <li>
        <Link to="/apps/1">Application1</Link>：<Link to="/apps/1/detail">Detail</Link>
      </li>
      <li>
        <Link to="/apps/2">Application2</Link>：<Link to="/apps/2/detail">Detail</Link>
      </li>
    </ul>
  )

  const Home = ({ routes, params, children }) => (
    <div className="demo">
      <div className="demo-nav">
        <Link to="/">Home</Link>
        <Link to="/apps">Application List</Link>
      </div>
      {children || 'Home Page'}
      <Alert style={{ margin: '16px 0' }} message="Click the navigation above to switch:" />
      <Breadcrumb routes={routes} params={params} />
    </div>
  )

  ReactDOM.render(
    <Router history={hashHistory}>
      <Route name="home" breadcrumbName="Home" path="/" component={Home}>
        <Route name="apps" breadcrumbName="Application List" path="apps" component={Apps}>
          <Route name="app" breadcrumbName="Application:id" path=":id">
            <Route name="detail" breadcrumbName="Detail" path="detail" />
          </Route>
        </Route>
      </Route>
    </Router>,
    mountNode,
  )
}

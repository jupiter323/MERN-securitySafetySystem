import React from 'react'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { Helmet } from 'react-helmet'
import createHistory from 'history/createHashHistory'
import thunk from 'redux-thunk'
import 'es6-promise/auto'
import 'setimmediate'
import 'chartist-plugin-tooltip'

import { LocaleProvider } from 'antd'
import enGB from 'antd/lib/locale-provider/en_GB'


import Layout from 'components/LayoutComponents/Layout'


import 'resources/_antd.less' // redefinition AntDesign variables
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap styles

import 'resources/AntStyles/AntDesign/antd.cleanui.scss'
import 'resources/CleanStyles/Core/core.cleanui.scss'
import 'resources/CleanStyles/Vendors/vendors.cleanui.scss'

const history = createHistory()
const router = routerMiddleware(history)
const middlewares = [router, thunk]
const isLogger = false
if (isLogger && process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
    middlewares.push(logger)

}

const App = () => (
    <ConnectedRouter history={history}>
        <LocaleProvider locale={enGB}>
            <div>
                <Helmet titleTemplate="Palladium Security System - %s" />
                <Layout />
                <script type="text/javascript" src="ducks/Milestone.js"></script>
            </div>

        </LocaleProvider>
    </ConnectedRouter>
);

export default App;


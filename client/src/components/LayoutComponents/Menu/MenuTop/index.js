import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { reduce } from 'lodash'
import { setLayoutState } from 'ducks/app'
import { getMenuData } from './menuData'
import './style.scss'

let menuData = [];

const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

const mapStateToProps = ({ app, routing }, props) => {
    //const { app, routing } = state;
    const { layoutState } = app
    return {
        pathname: routing.location.pathname,
        collapsed: layoutState.menuCollapsed,
        //theme: layoutState.themeLight ? 'light' : 'dark',
        theme: 'dark',
        settingsOpened: layoutState.settingsOpened,
        decks: [],//state.deckArray,
        devices: [],//state.deviceArray,
        urls: [],//state.urls,
    }
}

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class MenuTop extends React.Component {
    state = {
        pathname: this.props.pathname,
        collapsed: this.props.collapsed,
        theme: this.props.theme,
        selectedKeys: '',
        openKeys: [''],
        settingsOpened: this.props.settingsOpened,
        backgroundImage: 'url(resources/images/background/menubar.png)',
        level: 2,
    }

    handleClick = e => {
        const { dispatch, isMobile } = this.props
        if (isMobile) {
            // collapse menu on isMobile state
            dispatch(setLayoutState({ menuMobileOpened: false }))
        }
        if (e.key === 'settings') {
            // prevent click and toggle settings block on theme settings link
            dispatch(setLayoutState({ settingsOpened: !this.state.settingsOpened }))
            return
        }
        // set current selected keys
        this.setState({
            selectedKeys: e.key,
            openKeys: e.keyPath,
        });
        let path = e.keyPath;
        let length = path.length;
        switch(path[length - 1]) {
            case 'CAMERA PLAYBACK': {
                this.props.dispatch({type: 'SET_PLAYBACK', playBack: {deck: path[1], camera: path[0]}});
                //cookie.save('playBackInfo', {deck: path[1], camera: path[0]});
            }
        }
    }

    onOpenChange = openKeys => {
        this.setState({
            openKeys,
        })
    }

    getPath(data, id, parents = []) {
        const { selectedKeys } = this.state
        let items = reduce(
            data,
            (result, entry) => {
                if (result.length) {
                    return result
                } else if (entry.url === id && selectedKeys === '') {
                    return [entry].concat(parents)
                } else if (entry.key === id && selectedKeys !== '') {
                    return [entry].concat(parents)
                } else if (entry.children) {
                    let nested = this.getPath(entry.children, id, [entry].concat(parents))
                    return nested ? nested : result
                }
                return result
            },
            [],
        )
        return items.length > 0 ? items : false
    }

    getActiveMenuItem = (props, items) => {
        const { selectedKeys, pathname } = this.state
        let { collapsed } = props
        let [activeMenuItem, ...path] = this.getPath(items, !selectedKeys ? pathname : selectedKeys)

        this.setState({
            selectedKeys: activeMenuItem ? activeMenuItem.key : '',
            collapsed,
        })
    }

    generateMenuPartitions(items) {
        return items.map(menuItem => {
            if (menuItem.children) {
                let subMenuTitle = (
                    <span className="menuTop__title-wrap" key={menuItem.key}>
                        {menuItem.icon && <span className={'menuTop__mainContainer'}>
                                              <img src={menuItem.icon} alt={menuItem.title} />
                                          </span>
                        }
                        {!menuItem.main?
                            <span className="menuTop__item-title">{menuItem.title}</span>:<span />
                        }
                    </span>
                )
                return (
                    <SubMenu title={subMenuTitle} key={menuItem.key}>
                        {this.generateMenuPartitions(menuItem.children)}
                    </SubMenu>
                )
            }
            return this.generateMenuItem(menuItem)
        })
    }

    generateMenuItem(item) {
        const { key, title, url, icon, disabled, main } = item
        const { dispatch } = this.props
        return item.divider ? (
            <Divider key={Math.random()} />
        ) : item.url ? (
            <Menu.Item key={key} disabled={disabled}>
                <Link
                    to={url}
                    onClick={
                        this.props.isMobile
                            ? () => {
                                dispatch(setLayoutState({ menuCollapsed: false }))
                            }
                            : undefined
                    }
                >
                    {icon && <span className={'menuTop__mainContainer'}>
                                <img src={icon} alt={title} />
                                </span>
                    }
                    {!main ?
                        <span className="menuTop__item-title">{title}</span> : <span/>
                    }
                </Link>
            </Menu.Item>
        ) : (
            <Menu.Item key={key} disabled={disabled}>
                {icon && <span className={'menuTop__mainContainer'}>
                    <img src={icon} alt={title} />
                    </span>
                }
                {!main?
                    <span className="menuTop__item-title">{title}</span>:<span />
                }
                </Menu.Item>
        )
    }

    componentWillMount() {
        if( menuData.length === 0 ) {
            let { decks, devices, urls } = this.props;
            let cameras = urls.cameras;
            getMenuData(decks, devices, cameras, (data) => {
                menuData = data;
            })
        }
        this.getActiveMenuItem(this.props, menuData)
    }

    componentWillReceiveProps(newProps) {
        this.setState(
            {
                pathname: newProps.pathname,
                theme: newProps.theme,
                settingsOpened: newProps.settingsOpened,
            },
            () => {
                if (!newProps.isMobile) {
                    this.getActiveMenuItem(newProps, menuData)
                }
            },
        )
    }

    render() {
        const { selectedKeys, openKeys, theme, level, backgroundImage } = this.state
        const menuItems = this.generateMenuPartitions(menuData)
        return (
            <div
                className="menuTop"
                style={{ backgroundImage: backgroundImage }}
            >
                <div className="menuTop__logo" style={{backgroundColor: 'rgba(0, 19, 80, 0.6)'}}>
                    <div className="menuTop__logoContainer">
                        <h2>MY SOLARIS</h2>
                    </div>
                </div>
                <div className="menuTop__logo_" style={{backgroundColor: 'rgba(0, 19, 80, 0.6)'}}>
                    <div className="menuTop__logoContainer">
                        <img src={"resources/images/icons/securityLevel" + level + ".png"} alt="" />
                    </div>
                </div>
                <div className="menuTop__logo_" style={{backgroundColor: 'rgba(0, 19, 80, 0.6)'}}>
                    <div className="menuTop__logoContainer">
                        <img src="resources/images/PalladiumLogo.png" alt="" />
                    </div>
                </div>
                <Menu
                    theme={theme}
                    onClick={this.handleClick}
                    selectedKeys={[selectedKeys]}
                    openKeys={openKeys}
                    onOpenChange={this.onOpenChange}
                    mode="horizontal"
                    className="menuTop__navigation"
                    style={{backgroundColor: 'rgba(0, 19, 80, 0.6)'}}
                >
                    {menuItems}
                </Menu>
            </div>
        )
    }
}

export { MenuTop, menuData }

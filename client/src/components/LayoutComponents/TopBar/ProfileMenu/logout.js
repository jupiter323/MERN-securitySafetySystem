import React from 'react'
import { connect } from 'react-redux'
import { logout } from 'ducks/app'

import { withFirebase } from 'pages/Firebase';

const mapStateToProps = (state, props) => ({});

@connect(mapStateToProps)
class LogOutButton extends React.Component {
    static defaultProps = {}
    // $FlowFixMe
    onClick = event => {
        event.preventDefault()
        const { dispatch } = this.props
        this.props.firebase.doSignOut()

        dispatch(logout(event));
    }

    render() {
        return (
            <a href="javascript: void(0);" onClick={this.onClick}>
                <i className="topbar__dropdownMenuIcon icmn-exit" /> Logout
            </a>
        )
    }
}

export default withFirebase(LogOutButton);

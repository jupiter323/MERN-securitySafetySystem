import React from 'react'
import LoginForm from './LoginForm'
import './style.scss'
import CameraView from "../../../Dashboard/DashboardAlphaPage/DashboardAlpha/CameraView";
import $ from "jquery";

import 'gridstack/dist/gridstack'
import 'gridstack/dist/gridstack.jQueryUI'
import 'gridstack/dist/gridstack.css';
import 'gridstack/dist/gridstack-extra.css';

class Login extends React.Component {
  state = {}

  componentDidMount() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
      $(function () {
          var options = {
              width: 11,
              float: false,
              removable: '.trash',
              removeTimeout: 100,
              acceptWidgets: '.grid-stack-item'
          };
          $('.grid').gridstack(options);

          $('.grid-stack-item').draggable({
              revert: 'invalid',
              handle: '.grid-stack-item-content',
              scroll: false,
              appendTo: 'body'
          });
      });
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].style.overflow = ''
  }

  render() {
      let borderImage = 'resources/images/background/blue-border.png';
      let cornerImage = 'resources/images/background/blue-corner.png';
    return (
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="grid-stack cameraView grid grid-stack-11" id="grid1">
                        <div className="grid-stack-item loginform-height"
                             data-gs-x="4" data-gs-y="2"
                             data-gs-width="4" 
                            //  data-gs-height="9"
                             >
                            <div
                                className="LoginCard
                                grid-stack-item-content
                                bg-transparent"
                                style={{
                                    color: 'rgba(0,237,255)',
                                }}
                            >
                                <div className="BorderContainer">
                                    <img src={cornerImage} className='cornerImage' />
                                    <LoginForm email={this.state.restoredEmail} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default Login

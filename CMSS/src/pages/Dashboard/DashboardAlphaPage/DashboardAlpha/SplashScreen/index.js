import React from 'react'
import Loader from 'react-loader-spinner'
//import { connect } from 'react-redux'
import './style.scss'

// const mapStateToProps = (state, props) => ({
//     urls: state.urls,
// })
//
// const mapDispatchToProps = (dispatch, props) => ({
//     dispatch: dispatch,
// })
//
// @connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )

class SplashScreen extends React.Component {
  render() {
    let caption = 'Connecting to milestone server...'
    console.log('LoadingCaption: ', caption)
    let img_path = 'resources/images/background/palladium-splash.png'
    return (
      <div className={'SplashScreen'}>
        <img src={img_path} alt={'Splash Screen'} />
        <div className={'loadingCaptionArea'}>
          <Loader type="Oval" color="#10ff10" height={40} />
          {caption}
        </div>
      </div>
    )
  }
}

export default SplashScreen

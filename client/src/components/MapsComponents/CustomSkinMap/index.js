import React from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import './style.scss'
import { Row, Col, Rate } from 'antd';
import { default as setCurDumpster } from 'ducks/dumpster.js'

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";

const mapStateToProps = (state, props) => ({
})
const mapDispatchToProps = (dispatch, props) => ({
    setCurDumpster: dispatch(setCurDumpster),
    dispatch: dispatch
})
@connect(mapStateToProps, mapDispatchToProps)

class Modal extends React.Component {

    onClick = e => {
        this.props.setCurDumpster({type: 'CUR_DUMPSTER', dumpster: this.props.dumpster.key});
        this.props.dispatch(push('/dumpster'))
    }

    render() {
        const {dumpster} = this.props;
        console.log(dumpster);
        return (
            <div onClick={this.onClick} className="info-button">
                <Row>
                    <Col span={12}>
                        <div className="rate">
                            <center><Rate allowHalf disabled={true} defaultValue={dumpster.rate.rate} /></center>
                            <center><h5>{dumpster.rate.rate}</h5></center>
                        </div>

                    </Col>
                    <Col span={12}>
                        <h3>{dumpster.address},{dumpster.city},{dumpster.state} {dumpster.zip}</h3>
                        <h5>Size: {dumpster.size}</h5>
                        <h5>Type: {dumpster.type}</h5>
                        <h5>{dumpster.availableDate.from} - {dumpster.availableDate.to}</h5>
                    </Col>
                </Row>
            </div>
        );
    }
}

class CustomSkinMap extends React.Component {
    state = {
        isToggleOn: false,
        active: 0,
    }

    onMapClick = () => {
        this.setState({isToggleOn: false});

    }

    onMarkerClick = (index, e) => {
        this.setState({
            isToggleOn: true,
            active: index,
        })
    }

    onCloseClick = () => {
        this.setState({isToggleOn: false})
    }
    render() {
        const {dumpsters} = this.props;
        const {isToggleOn, active} = this.state;
        return (
            <GoogleMap
                defaultZoom={13}
                onClick={this.onMapClick}
                center={{lat: dumpsters[0].location.lat, lng: dumpsters[0].location.lng}}
                defaultOptions={{
                    //scrollwheel: true,
                    zoomControl: true,
                    styles: [
                        {
                            featureType: "water",
                            stylers: [
                                {saturation: 43},
                                {lightness: -11},
                                {hue: "#0088ff"}
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.fill",
                            stylers: [
                                {hue: "#ff0000"},
                                {saturation: -100},
                                {lightness: 99}
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{color: "#808080"}, {lightness: 54}]
                        },
                        {
                            featureType: "landscape.man_made",
                            elementType: "geometry.fill",
                            stylers: [{color: "#ece2d9"}]
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry.fill",
                            stylers: [{color: "#ccdca1"}]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{color: "#767676"}]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.stroke",
                            stylers: [{color: "#ffffff"}]
                        },
                        {featureType: "poi", stylers: [{visibility: "off"}]},
                        {
                            featureType: "landscape.natural",
                            elementType: "geometry.fill",
                            stylers: [{visibility: "on"}, {color: "#b8cb93"}]
                        },
                        {featureType: "poi.park", stylers: [{visibility: "on"}]},
                        {
                            featureType: "poi.sports_complex",
                            stylers: [{visibility: "on"}]
                        },
                        {featureType: "poi.medical", stylers: [{visibility: "on"}]},
                        {
                            featureType: "poi.business",
                            stylers: [{visibility: "simplified"}]
                        }
                    ]
                }}
            >
                {dumpsters.map((dumpster, index) => {
                    return (
                        <Marker
                            key={index}
                            position={{lat: dumpster.location.lat, lng: dumpster.location.lng}}
                            onClick={this.onMarkerClick.bind(this.props, index)}
                        >
                            {
                                isToggleOn && active == index && (
                                    <InfoWindow onCloseClick={this.onCloseClick}>
                                        <Modal dumpster={dumpster}/>
                                    </InfoWindow>
                                )
                            }
                        </Marker>
                    )
                })}

            </GoogleMap>
        )
    }
}

export default withScriptjs(withGoogleMap(CustomSkinMap));

    /*withGoogleMap(props => {
        let isToggleOn = false;
        let active_index = 0;


        console.log(props);


    })
);

export default CustomSkinMap;*/
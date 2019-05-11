/* eslint-disable react/react-in-jsx-scope */
import React from 'react'
import CustomSkinMap from './CustomSkinMap'

function Maps({ ...props }) {
  return (
    <CustomSkinMap
      googleMapURL={ "https://maps.googleapis.com/maps/api/js?key=AIzaSyC7vbqq36-BJ-JsdB7zVbAVt0YktMpjPKc" }
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
      dumpsters={props.dumpsters}
    />
  );
}

export default Maps;

import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import "./style.css"

class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    const { location, google, mapType } = this.props;
    console.log('Location : ', location, 'Google : ',google);
    const {
      activeMarker,
      showingInfoWindow,
      selectedPlace
    } = this.state;
    return (
      <div className='map-top-div'>
        <div className="content-header">
          <Map
            className="map-main-section"
            google={google}
            onClick={this.onMapClicked}
            initialCenter={{
              lat: mapType === "officeMap" ? location?.coordinates[1] : 19.0760,
              lng: mapType === "officeMap" ? location?.coordinates[0] : 72.8777
            }}
            center={{
              lat: mapType === "officeMap" ? location?.coordinates[1] : 19.0760,
              lng: mapType === "officeMap" ? location?.coordinates[0] : 72.8777
            }}
            // added coordinates of mumbai(MH-India)
          >
            {
              mapType === "officeMap" &&
              <Marker
                icon={{
                  url: require('../../../assets/images/location.png'),
                  anchor: new google.maps.Point(17, 46),
                  scaledSize: new google.maps.Size(37, 37)
                }}
                position={{
                  lat: location?.coordinates[1],
                  lng: location?.coordinates[0]
                }}
                onClick={this.onMarkerClick}
                name={`${location?.address?.line1},${location?.address?.city}`}
              />
            }

            {
              mapType === "dashboardMap" && 
              location?.length > 0 && location?.map((location,idx) => (
                <Marker
                  icon={{
                    url: require('../../../assets/images/location.png'),
                    anchor: new google.maps.Point(17, 46),
                    scaledSize: new google.maps.Size(37, 37)
                  }}
                  position={{
                    lat: location?.addressCordinater?.coordinates[1],
                    lng: location?.addressCordinater?.coordinates[0]
                  }}
                  key={idx}
                  onClick={this.onMarkerClick}
                  name={`${location?.address?.line1},${location?.address?.city}`}
                />
              ))
            }

            <InfoWindow
              marker={activeMarker}
              visible={showingInfoWindow}
            >
              <div>
                <h6>
                  {selectedPlace.name}
                </h6>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAF0v_4uVgwSpBw1X4IDAbzOKaG50wtIsc")
  // AIzaSyAF0v_4uVgwSpBw1X4IDAbzOKaG50wtIsc - Sharley
  // AIzaSyD_eqiIh-TKuDVpOqB1ZKYR5-M0Dhhiqo0 - Dhawal
})(MapContainer)
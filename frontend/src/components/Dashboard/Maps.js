import React, { Component } from 'react'
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

class Maps extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            showingInfoWindow: false,  // Hides or shows the InfoWindow
            activeMarker: {},          // Shows the active marker upon click
            selectedPlace: {}
        }
    }

    onMarkerClick = ( props, marker, e ) =>
        this.setState( {
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        } );

    onClose = props => {
        if ( this.state.showingInfoWindow ) {
            this.setState( {
                showingInfoWindow: false,
                activeMarker: null
            } );
        }
    };

    render () {
        return (
            <div>
                <Map
                    google={ this.props.google }
                    zoom={ 14 }
                    initialCenter={
                        {
                            lat: 37.335480,
                            lng: -121.893028
                        }
                    }
                >
                    <Marker
                        onClick={ this.onMarkerClick }
                        name={ 'San Jose' }
                    />
                    <InfoWindow
                        marker={ this.state.activeMarker }
                        visible={ this.state.showingInfoWindow }
                        onClose={ this.onClose }
                    >
                        <div>
                            <h6>{ this.state.selectedPlace.name }</h6>
                        </div>
                    </InfoWindow></Map>
            </div>
        )
    }
}

export default GoogleApiWrapper( {
    apiKey: 'AIzaSyAXWCI5f1-e6DpiCVMaw-GwUEipY1T8FIY'
} )( Maps );
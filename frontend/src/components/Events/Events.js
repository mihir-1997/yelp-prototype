import React, { Component } from 'react'
import axios from 'axios'

import Event from './Event'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class Events extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            events: [],
            unregistered_events: [],
            filtered_unregistered_events: [],
            registered_events: [],
        }
    }

    componentDidMount () {
        let active = localStorage.getItem( "active" )
        if ( active === "restaurant" ) {
            let id = localStorage.getItem( "id" )
            if ( id ) {
                return axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/eventsForRestaurants/" + id )
                    .then( ( res ) => {
                        if ( res.status === 200 ) {
                            // console.log( res.data )
                            this.setState( {
                                events: res.data
                            } )
                        }
                    } )
                    .catch( ( err ) => {
                        if ( err.response ) {
                            console.log( err.response.message )
                            return
                        }
                        return
                    } )
            } else {
                console.log( "No Id found in local storage" )
            }
        } else if ( active === "user" ) {
            let id = localStorage.getItem( "id" )
            if ( id ) {
                return axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/getAllEvents/" + id )
                    .then( ( res ) => {
                        if ( res.status === 200 ) {
                            this.setState( {
                                unregistered_events: res.data.unregistered_events,
                                filtered_unregistered_events: res.data.unregistered_events,
                                registered_events: res.data.registered_events
                            } )
                        }
                    } )
                    .catch( ( err ) => {
                        if ( err.response ) {
                            console.log( err.response.message )
                            return
                        }
                        return
                    } )
            } else {
                console.log( "No Id found in local storage" )
            }
        }
    }

    postEvent = ( item ) => {
        window.location.assign( '/createevent' )
    }

    searchEvent = ( item ) => {
        if ( item.target.value ) {
            this.setState( {
                filtered_unregistered_events: this.state.filtered_unregistered_events.filter( event => event.name.toUpperCase().startsWith( item.target.value.toUpperCase() ) )
            } )
        } else {
            this.setState( {
                filtered_unregistered_events: this.state.unregistered_events
            } )
        }
    }

    showUserProfile = ( user_id ) => {
        console.log( user_id )
        return this.props.history.push( {
            pathname: '/userprofile',
            state: {
                user_id: user_id,
            }
        } )
    }

    render () {
        return (
            <div>
                {
                    localStorage.getItem( "active" ) === "restaurant" &&
                    <div className="container">
                        <div className="row post-event-wrapper">
                            <div className="post-event">
                                <button type="button" className="btn red-button right-align" onClick={ this.postEvent }>Create an Event</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9 populer-events"><h3>Events</h3></div>
                            <div className="col-3 populer-events"><h5>Registered Customers</h5></div>
                        </div>
                        <div className="row">
                            {
                                this.state.events ?
                                    this.state.events.map( ( event, index ) => {
                                        return <div className="single-restaurant-event" key={ index }>
                                            <Event event={ event } showprofile={ this.showUserProfile }></Event>
                                        </div>
                                    } )
                                    : "No Events. Post a new"
                            }
                        </div>
                    </div>
                }
                {
                    localStorage.getItem( "active" ) === "user" &&
                    <div className="events-wrapper">
                        <div className="row">
                            <div className="col-9 unregistered-event">
                                <div className="row search-event">
                                    <form>
                                        <input type="text" id="searchEvent" className="form-control search-event" placeholder="Search event by name" onChange={ this.searchEvent } />
                                    </form>
                                </div>
                                <div className="row">
                                    <div className="container">
                                        <h4 className="populer-events">Populer Events</h4>
                                    </div>
                                    {
                                        this.state.filtered_unregistered_events ?
                                            this.state.filtered_unregistered_events.map( event => {
                                                return <Event event={ event } registered={ false }></Event>
                                            } )
                                            : "No Events. Come back later!"
                                    }
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row search-event">
                                    <h4 className="registered-events">Registered Events</h4>
                                </div>
                                <div className="row">
                                    {
                                        this.state.registered_events ?
                                            this.state.registered_events.map( event => {
                                                return <Event event={ event } registered={ true }></Event>
                                            } )
                                            : "No Events. Register for one!"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

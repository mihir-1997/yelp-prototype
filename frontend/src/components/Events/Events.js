import React, { Component } from 'react'
import axios from 'axios'

import Event from './Event'

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
                axios.get( "http://localhost:3001/eventsForRestaurants/" + id )
                    .then( ( res ) => {
                        if ( res.status === 200 ) {
                            console.log( res.data )
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
                axios.get( "http://localhost:3001/getAllEvents/" + id )
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

    render () {
        return (
            <div>
                {
                    localStorage.getItem( "active" ) === "restaurant" &&
                    <div className="container">
                        <div className="row post-event-wrapper">
                            <div className="post-event  text-center">
                                <button type="button" className="btn btn-primary" onClick={ this.postEvent }>Post Event</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9"><h3>Events</h3></div>
                            <div className="col-3"><h5>Registered Customers</h5></div>
                        </div>
                        <div className="row">
                            {
                                this.state.events ?
                                    this.state.events.map( event => {
                                        return <Event event={ event }></Event>
                                    } )
                                    : "No Events. Post a new"
                            }
                        </div>
                    </div>
                }
                {
                    localStorage.getItem( "active" ) === "user" &&
                    <div className="container">
                        <div className="row">
                            <div className="col-6 unregistered-event">
                                <div className="row search-event">
                                    <input type="text" id="searchEvent" className="search-event" placeholder="Search event by name" onChange={ this.searchEvent } />
                                </div>
                                <div className="row">
                                    {
                                        this.state.filtered_unregistered_events ?
                                            this.state.filtered_unregistered_events.map( event => {
                                                return <Event event={ event } registered={ false }></Event>
                                            } )
                                            : "No Events. Come back later!"
                                    }
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row search-event">
                                    <h2 className="text-center">Registered Events</h2>
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

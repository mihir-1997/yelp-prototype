import React, { Component } from 'react'
import axios from 'axios'

export default class Event extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.event.id,
            name: this.props.event.name,
            user_id: this.props.event.user_id,
            restaurant_id: this.props.event.restaurant_id,
            restaurant_name: this.props.event.restaurant_name,
            user_ids: this.props.event.user_ids,
            user_names: this.props.event.user_names,
            description: this.props.event.description,
            location: this.props.event.location,
            date: this.props.event.date,
            time: this.props.event.time,
            hashtags: this.props.event.hashtags,
            registered: this.props.registered
        }
    }

    registerForEvent = ( item ) => {
        item.preventDefault()
        let id = localStorage.getItem( "id" )
        if ( id ) {
            const events_sub_data = {
                user_id: id,
                event_id: this.state.id
            }
            axios.post( "http://localhost:3001/registeForEvent", events_sub_data )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        window.location.reload()
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

    showUserProfile = ( user_id ) => {
        this.props.showprofile( user_id )
    }

    render () {
        let column = null
        let event_name = null
        if ( this.props.registered ) {
            column = "col-12"
            event_name = <h4 className="event-name">{ this.props.event.name }</h4>
        } else {
            column = "col-9"
            event_name = <h3 className="event-name">{ this.props.event.name }</h3>
        }
        return (
            <div className="container">
                <div className="row event">
                    <div className={ column }>
                        <div className="row">
                            { event_name }
                        </div>
                        <div className="row">
                            <div className="col">
                                { localStorage.getItem( "active" ) === "user" &&
                                    <span>
                                        <strong>{ this.props.event.restaurant_name }</strong>
                                        <br />
                                    </span>
                                }
                                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.5.5v14m7-7.005H.5m13 0a6.006 6.006 0 01-6 6.005c-3.313 0-6-2.694-6-6.005a5.999 5.999 0 016-5.996 6 6 0 016 5.996z" stroke="currentColor" stroke-linecap="square"></path></svg>
                                    &nbsp;&nbsp;{ this.props.event.location }
                                <br />
                                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M3.5 0v5m8-5v5m-10-2.5h12a1 1 0 011 1v10a1 1 0 01-1 1h-12a1 1 0 01-1-1v-10a1 1 0 011-1z" stroke="currentColor"></path></svg>
                                    &nbsp;&nbsp;<span className="event-datetime">{ this.props.event.date }&nbsp;{ this.props.event.time }</span>
                                <br />
                                { this.props.event.description }
                                <br />
                                { this.props.event.hashtags }
                            </div>
                        </div>
                    </div>

                    { localStorage.getItem( "active" ) === "user" &&
                        <div className="col-3">
                            <button type="button" className="btn red-button" onClick={ this.registerForEvent } hidden={ this.props.registered }>Register</button>
                        </div>
                    }
                    {
                        localStorage.getItem( "active" ) === "restaurant" &&
                        <div className="col-3">
                            { this.props.event.user_names ?
                                this.props.event.user_names.map( ( user_name, index ) => {
                                    return <button type="button" className="btn btn-secondary" onClick={ () => this.showUserProfile( this.props.event.user_ids[ index ] ) }>{ user_name }</button>
                                } )
                                : null }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

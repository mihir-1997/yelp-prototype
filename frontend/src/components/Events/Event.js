import React, { Component } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';

import UserPage from '../UserPage/UserPage'

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

    render () {
        const contentStyle = { background: '#fff' };
        const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
        const arrowStyle = { color: '#000' }; // style for an svg element

        const Modal = ( user_id, user_name ) => (
            <Popup
                trigger={ <button type="button" className="btn btn-secondary">{ user_name }</button> }
                { ...{ contentStyle, overlayStyle, arrowStyle } }
                position="bottom center">
                <UserPage user_id={ user_id } />
            </Popup>
        );
        return (
            <div className="container">
                <div className="row event">
                    <div className="col-9">
                        <div className="row">
                            <h3>{ this.props.event.name }</h3>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                { localStorage.getItem( "active" ) === "user" &&
                                    <div className="row">
                                        <strong>{ this.props.event.restaurant_name }</strong>
                                    </div> }
                                <div className="row">
                                    { this.props.event.description }
                                </div>
                                <div className="row">
                                    <strong>Location:</strong>&nbsp;{ this.props.event.location }
                                </div>
                                <div className="row">
                                    <strong>Date:</strong>&nbsp;{ this.props.event.date }
                                </div>
                                <div className="row">
                                    <strong>Time:</strong>&nbsp;{ this.props.event.time }
                                </div>
                                <div className="row">
                                    { this.props.event.hashtags }
                                </div>
                            </div>
                        </div>
                    </div>

                    { localStorage.getItem( "active" ) === "user" &&
                        <div className="col-3">
                            <button type="button" className="btn btn-primary" onClick={ this.registerForEvent } hidden={ this.props.registered }>Register</button>
                        </div>
                    }
                    {
                        localStorage.getItem( "active" ) === "restaurant" &&
                        <div className="col-3">
                            { this.props.event.user_names ?
                                this.props.event.user_names.map( ( user_name, index ) => {
                                    return Modal( this.props.event.user_ids[ index ], user_name )
                                } )
                                : null }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

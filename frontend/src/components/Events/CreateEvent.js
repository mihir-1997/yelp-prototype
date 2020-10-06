import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';

import './Events.css'

export default class CreateEvent extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            description: "",
            location: "",
            date: "",
            time: "",
            hashtags: "",
            error: ""
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    postEvent = ( item ) => {
        item.preventDefault()
        if ( !this.state.time.includes( ":" ) || this.state.time.length !== 5 ) {
            this.setState( {
                error: "Time must be in HH:MM format"
            } )
            return
        } else {
            this.setState( {
                error: ""
            } )
        }
        let hour = this.state.time.split( ":" )[ 0 ]
        let minutes = this.state.time.split( ":" )[ 1 ]
        if ( parseInt( hour ) < 1 || parseInt( hour ) > 23 ) {
            console.log( parseInt( hour ) )
            this.setState( {
                error: "Hour must be between 1 to 23"
            } )
            return
        } else if ( parseInt( minutes ) < 0 || parseInt( minutes ) > 59 ) {
            this.setState( {
                error: "Minuted must be between 0 to 59"
            } )
            return
        } else {
            this.setState( {
                error: ""
            } )
            if ( this.state.name && this.state.description && this.state.location && this.state.date && this.state.time ) {
                let id = localStorage.getItem( "id" )
                const eventData = {
                    restaurant_id: id,
                    name: this.state.name,
                    description: this.state.description,
                    location: this.state.location,
                    date: this.state.date,
                    time: this.state.time + ":00",
                    hashtags: this.state.hashtags,
                }
                axios.defaults.withCredentials = true;
                axios.post( "http://localhost:3001/postevent", eventData )
                    .then( ( res ) => {
                        if ( res.status === 200 ) {
                            this.setState( {
                                error: ""
                            } )
                            window.location.assign( "/events" );
                        }
                    } )
                    .catch( ( err ) => {
                        if ( err.response ) {
                            console.log( err.response )
                        }
                    } )
            } else {
                this.setState( {
                    error: "*Some required fields are empty"
                } )
            }
        }
    }

    render () {
        var redirectVar = null
        if ( localStorage.getItem( "active" ) !== "restaurant" ) {
            redirectVar = <Redirect to="/login" />
            return redirectVar
        }
        return (
            <div >
                {redirectVar }
                <div className="container">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8 create-event-form-wrapper">
                            <div className="row">
                                <div className="text-center">
                                    <h3>Create Event</h3>
                                </div>
                            </div>
                            <form>
                                <div class="form-group">
                                    <label for="name">Name<span className="required-field">*</span></label>
                                    <input type="text" class="form-control" id="name" name="name" placeholder="Event name" value={ this.state.name } onChange={ this.onChange } required />
                                </div>
                                <div class="form-group">
                                    <label for="description">Description<span className="required-field">*</span></label>
                                    <textarea type="text" class="form-control" name="description" id="description" value={ this.state.description } onChange={ this.onChange } required />
                                </div>
                                <div class="form-group">
                                    <label for="location">Location<span className="required-field">*</span></label>
                                    <input type="text" class="form-control" id="location" name="location" value={ this.state.location } onChange={ this.onChange } required />
                                </div>
                                <div class="form-group">
                                    <label for="hashtags">Hashtags</label>
                                    <input type="text" class="form-control" id="hashtags" name="hashtags" placeholder="#tasty" value={ this.state.hashtags } onChange={ this.onChange } />
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="date">Date<span className="required-field">*</span></label>
                                        <input type="date" class="form-control" id="date" name="date" value={ this.state.date } min={ new Date().toISOString().split( "T" )[ 0 ] } onChange={ this.onChange } required />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="time">Time<span className="required-field">*</span></label>
                                        <input type="text" class="form-control" id="time" name="time" value={ this.state.time } placeholder="HH:MM" onChange={ this.onChange } required />
                                    </div>
                                </div>
                                <button type="submit" class="btn red-button" onClick={ this.postEvent }>Create</button>
                            </form>
                            <p className="error">{ this.state.error }</p>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
            </div>
        )
    }
}

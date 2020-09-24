import React, { Component } from 'react'
import axios from 'axios'

import Review from './Review'

export default class Reviews extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            reviews: []
        }
    }

    componentDidMount () {

        const selected = localStorage.getItem( "active" )
        if ( selected ) {
            if ( selected === "user" ) {
                axios.defaults.withCredentials = true;
                let id = localStorage.getItem( "id" )
                if ( id ) {
                    axios.get( "http://localhost:3001/reviewsForUsers/" + id )
                        .then( ( res ) => {
                            if ( res.status === 200 ) {
                                this.setState( {
                                    reviews: res.data
                                } )
                            }
                        } )
                        .catch( ( err ) => {
                            if ( err.response ) {
                                if ( err.response.status === 404 ) {
                                    console.log( err.response.message )
                                    return
                                } else if ( err.response.status === 500 ) {
                                    console.log( err.response.message )
                                    return
                                }
                            }
                            return
                        } )
                } else {
                    console.log( "No Id found in local storage" )
                }
            } else {
                axios.defaults.withCredentials = true;
                let id = localStorage.getItem( "id" )
                if ( id ) {
                    console.log( id )
                    axios.get( "http://localhost:3001/reviewsForRestaurants/" + id )
                        .then( ( res ) => {
                            if ( res.status === 200 ) {
                                this.setState( {
                                    reviews: res.data
                                } )
                            }
                        } )
                        .catch( ( err ) => {
                            if ( err.response ) {
                                if ( err.response.status === 404 ) {
                                    console.log( err.response.message )
                                    return
                                } else if ( err.response.status === 500 ) {
                                    console.log( err.response.message )
                                    return
                                }
                            }
                            return
                        } )
                } else {
                    console.log( "No Id found in local storage" )
                }
            }
        } else console.log( "No selected found in localstorage" )
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <h2>Reviews</h2>
                </div>
                {this.state.reviews.map( ( review, index ) => {
                    return <Review review={ review } key={ index } />
                } ) }
            </div>
        )
    }
}

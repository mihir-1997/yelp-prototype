import React, { Component } from 'react'
import axios from 'axios'
import Dish from "./Dish"


export default class Dishes extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            dishes: []
        }
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            axios.get( "http://localhost:3001/dishes/" + id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            dishes: res.data
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.response.message )
                    }
                } )
        } else {
            console.log( "No Id found in local storage" )
        }
    }

    render () {

        return (
            <div className="row" style={ this.style }>
                <div className="col">
                    { this.state.dishes.map( dish => {
                        return <Dish dish={ dish }></Dish>
                    } ) }
                </div>
            </div>
        )
    }
    style = {
        margin: "20px 0 40px"
    }
}

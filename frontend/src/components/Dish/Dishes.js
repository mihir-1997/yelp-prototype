import React, { Component } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';

import Dish from "./Dish"
import UpdateAddedDish from '../Dish/UpdateDish'


export default class Dishes extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            dishes: [],
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
                        return
                    }
                    return
                } )
        } else {
            console.log( "No Id found in local storage" )
        }
    }

    render () {

        const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
        const arrowStyle = { color: '#000' }; // style for an svg element
        const UpdateDish = ( dish ) => (
            <Popup
                trigger={ <input type="radio" name="dish" value={ dish.dish.id } style={ this.radioButtons }></input> }
                { ...{ dish, overlayStyle, arrowStyle } }
                position="right bottom">
                <UpdateAddedDish dish={ dish.dish } />
            </Popup>
        );
        return (
            <div className="row" style={ this.style }>
                <div className="col">
                    { this.state.dishes.map( dish => {
                        return (
                            <div className="row" key={ dish.id + "div-row" }>
                                <div className="col-1" key={ dish.id + "col-1" }>
                                    <div style={ { marginTop: "70%" } }>
                                        { this.props.radioShow ? <UpdateDish dish={ dish } /> : null }
                                    </div>
                                </div>
                                <div className="col-11">
                                    <Dish dish={ dish }></Dish>
                                </div>
                            </div>
                        )
                    } ) }
                </div>
            </div >
        )
    }
    style = {
        margin: "20px 0 40px"
    }

    radioButtons = {
        float: "right",
        // marginTop: "40%"
    }
}

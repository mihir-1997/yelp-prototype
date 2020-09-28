import React, { Component } from 'react'
import axios from 'axios'

import './RestaurantPage.css'
import Reviews from '../Reviews/Reviews'
import Dishes from '../Dish/Dishes'

export default class RestaurantPage extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.location.state.id,
            name: "",
            email: "",
            phone_no: "",
            location: "",
            description: "",
            timings: "",
            pictures: [],
            avgRatings: "",
            deliveryOption: "",
            error: ""
        }
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id && this.state.id ) {
            axios.get( "http://localhost:3001/getrestaurant/" + this.state.id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            name: res.data.name,
                            email: res.data.email,
                            phone_no: res.data.phone_no,
                            location: res.data.location,
                            description: res.data.description,
                            timings: res.data.timings,
                            pictures: res.data.pictures
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( err.response.message )
                        } else if ( err.response.status === 400 ) {
                            console.log( err.response.message )
                        }
                    }
                } )

            axios.get( "http://localhost:3001/averageRatingsForRestaurant/" + this.state.id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            avgRatings: res.data.ratings
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( err.response.message )
                        } else if ( err.response.status === 400 ) {
                            console.log( err.response.message )
                        }
                    }
                } )
        } else {
            console.log( "No Id found in local storage" )
        }
    }

    onOrder = ( dishId, dishPrice ) => {
        if ( this.state.deliveryOption ) {
            const orderData = {
                restaurant_id: this.state.id,
                user_id: localStorage.getItem( "id" ),
                dish_id: dishId,
                total: dishPrice,
                delivery_option: this.state.deliveryOption
            }
            axios.defaults.withCredentials = true;
            axios.post( "http://localhost:3001/createOrder", orderData )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            error: ""
                        } )
                        window.alert( "ordered" )
                        setTimeout( function () {
                            // let orderPopup = document.getElementsByClassName( "ordered" )
                            // $("#live-chat").css({ "display" : "block" });
                            // }, 30000);
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.response )
                        return
                    }
                    return
                } )
        } else {
            this.setState( {
                error: "Please select delivery option"
            } )
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    render () {
        return (
            <div>
                <div className="row picture-scrolling-wrapper">
                    <div className="picture-scrolling">
                        { this.state.pictures && this.state.pictures.map( picture => {
                            return <img src={ "http://localhost:3001/" + picture } key={ picture } alt="restaurant_picture" className="restaurant-picture shadow" crossOrigin="anonymous"></img>
                        } ) }
                    </div>
                </div>
                <div className="restaurantpage-information">
                    <div className="row">
                        <div className="col-10">
                            <div className="row restaurantname">
                                <h2>{ this.state.name }</h2>
                            </div>
                            <div className="row restaurantlocation">
                                { this.state.location }
                            </div>
                            <div className="row restaurantratings">
                                { this.state.avgRatings }
                            </div>
                            <div className="row restaurantdescription">
                                { this.state.description }
                            </div>
                            <div className="row menu-title">
                                <div className="row">
                                    <div className="col">
                                        <h4>Our Offerings!</h4>
                                    </div>
                                </div>
                                <div className="row delivery-selection">
                                    <select name="deliveryOption" id="deliveryOptions" className="deliveryOptions" onChange={ this.onChange }>
                                        <option name="deliveryByName" value="">Select Delivery</option>
                                        <option name="deliveryByName" value="pickup">Pickup</option>
                                        <option name="deliveryByName" value="delivery">Delivery</option>
                                    </select>
                                    <span className="select-delivery">{ this.state.error }</span>
                                </div>
                                <Dishes id={ this.state.id } radioShow={ false } orderButton={ true } onOrder={ this.onOrder }></Dishes>
                            </div>
                        </div>
                        <div className="col-2">
                            <Reviews id={ this.state.id } active="restaurant" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
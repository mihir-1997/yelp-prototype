import React, { Component } from 'react'
import axios from 'axios';

import './UserDashboard.css'
import Restaurant from './Restaurant'
import Maps from './Maps'

class UserDashboard extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            search: "",
            restautants: [],
            filtered_restaurants: [],
            latLongs: [],
            filtered_latLongs: [],
            filtered: "",
            selectedOption: "",
            curbside_pickup: false,
            dine_in: false,
            delivery: false
        }
    }

    onChange = ( item ) => {
        this.setState( {
            [ item.target.name ]: item.target.value
        } )
    }

    onClick = ( data, avgRatings ) => {
        return this.props.history.push( {
            pathname: '/restaurant',
            state: {
                id: data,
                avgRatings: avgRatings
            }
        } )
    }

    searchRestaurants = ( item ) => {
        item.preventDefault()
        axios.defaults.withCredentials = true;

        if ( this.state.search && this.state.selectedOption ) {
            axios.get( "http://localhost:3001/getrestaurantbysearch/" + this.state.selectedOption + "/" + this.state.search )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        let ids = []
                        this.setState( {
                            filtered_restaurants: this.state.filtered_restaurants.filter( ( restaurant ) => {
                                if ( res.data.includes( restaurant.id ) ) {
                                    ids.push( restaurant.id )
                                    return true
                                }
                                return false
                            } ),
                            filtered_latLongs: this.state.latLongs.filter( latlong => ids.includes( latlong.id ) )
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            this.setState( {
                                filtered_restaurants: [],
                                filtered_latLongs: []
                            } )
                        } else if ( err.response.status === 500 ) {
                            console.log( err.response.message )
                        }
                    }
                } )
        } else {
            this.setState( {
                filtered_restaurants: this.state.restautants,
                filtered_latLongs: this.state.latLongs
            } )
        }
    }

    filterRestaurant = ( item ) => {
        if ( this.state[ this.state.filtered ] ) {
            let ids = []
            this.setState( {
                filtered_restaurants: this.state.filtered_restaurants.filter( ( restaurant ) => {
                    if ( restaurant[ this.state.filtered ] === 1 ) {
                        ids.push( restaurant.id )
                        return true
                    }
                    return false
                } ),
                filtered_latLongs: this.state.latLongs.filter( latlong => ids.includes( latlong.id ) )
            } )
        } else {
            this.setState( {
                filtered_restaurants: this.state.restautants,
                filtered: "",
                filtered_latLongs: this.state.latLongs
            } )
        }
    }

    onChangeFilter = ( item ) => {
        this.setState( {
            [ item.target.value ]: !this.state[ item.target.value ],
            filtered: item.target.value
        }, this.filterRestaurant )
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            axios.get( "http://localhost:3001/getAllRestaurants" )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            restautants: res.data.restaurants,
                            filtered_restaurants: res.data.restaurants,
                            latLongs: res.data.latlongs,
                            filtered_latLongs: res.data.latlongs
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( err.response.message )
                        } else if ( err.response.status === 500 ) {
                            console.log( err.response.message )
                        }
                    }
                } )
        } else {
            console.log( "No Id found in local storage" )
        }
    }

    render () {
        if ( localStorage.getItem( "active" ) !== "user" ) {
            this.props.history.goBack()
        }
        return (
            <div className="dashboard-wrapper">
                <div className="row restaurant-search-bar">
                    <div className="col-2"></div>
                    <div className="col-8 restaurant-search">
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <select name="selectedOption" id="searchOptions" className="form-control searchOptions" onChange={ this.onChange }>
                                        <option name="searchByName" value="">Search By...</option>
                                        <option name="searchByName" value="dish">Dish</option>
                                        <option name="searchByName" value="cuisine">Cuisine</option>
                                        <option name="searchByName" value="location">Location</option>
                                        {/* <option name="searchByName" value="deliverymode">Mode of Delivery</option> */ }
                                    </select>
                                </div>
                                <div className="form-group col-md-8">
                                    <input type="text" className="form-control searchrestaurant" name="search" value={ this.state.search } onChange={ this.onChange } />
                                </div>
                                <div className="form-group col-md-2">
                                    <button type="button" className="btn searchsubmit" onClick={ this.searchRestaurants }>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" width="25" height="25" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <circle cx="10" cy="10" r="7" />
                                            <line x1="21" y1="21" x2="15" y2="15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-2"></div>
                </div>
                {/* <div className="below-restaurant-search-bar"> */ }
                <div className="row">
                    <div className="col-2 filters-wrapper">
                        <div className="row filters-heading">
                            <h5>Filters</h5>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="row suggested-heading">
                                    Suggested
                                </div>
                                <div className="row">
                                    <div className="delivery_filters">
                                        <input type="checkbox" name="delivery_method" value="curbside_pickup" onChange={ this.onChangeFilter } disabled={ this.state.dine_in || this.state.delivery } /> Curbside Pickup<br />
                                        <input type="checkbox" name="delivery_method" value="dine_in" onChange={ this.onChangeFilter } disabled={ this.state.curbside_pickup || this.state.delivery } /> Open Now<br />
                                        <input type="checkbox" name="delivery_method" value="delivery" onChange={ this.onChangeFilter } disabled={ this.state.curbside_pickup || this.state.dine_in } /> Yelp Delivery<br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-7 restaurants-wrapper">
                        <h2>Restaurants</h2>
                        <div className="row restaurants">
                            { this.state.filtered_restaurants.length ?
                                this.state.filtered_restaurants.map( ( restaurant, index ) => {
                                    return <Restaurant restautantData={ restaurant } index={ index } onClick={ this.onClick } key={ index } />
                                } )
                                : "No restaurants found" }
                        </div>
                    </div>
                    <div className="col-3 maps-wrapper">
                        <Maps latlongs={ this.state.filtered_latLongs } />
                    </div>
                </div>
            </div>
            // </div>
        )
    }
}
export default UserDashboard;

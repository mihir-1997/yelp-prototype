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

    onClick = ( data ) => {
        return this.props.history.push( {
            pathname: '/restaurant',
            state: {
                id: data
            }
        } )
    }

    searchRestaurants = ( item ) => {
        item.preventDefault()
        if ( this.state.selectedOption && this.state.search ) {
            console.log( "button clicked" )
        }
    }

    filterRestaurant = ( item ) => {
        if ( this.state[ this.state.filtered ] ) {
            this.setState( {
                filtered_restaurants: this.state.filtered_restaurants.filter( restaurant => restaurant[ this.state.filtered ] === 1 )
            } )
        } else {
            this.setState( {
                filtered_restaurants: this.state.restautants,
                filtered: ""
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
                            restautants: res.data,
                            filtered_restaurants: res.data
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

        return (
            <div className="dashboard-wrapper">
                <div className="row restaurant-search-bar">
                    <div className="col-1"></div>
                    <div className="col-9 restaurant-search">
                        <form>
                            <select name="selectedOption" id="searchOptions" className="searchOptions" onChange={ this.onChange }>
                                <option name="searchByName" value="">--select category--</option>
                                <option name="searchByName" value="dish">Dish</option>
                                <option name="searchByName" value="cuisine">Cuisine</option>
                                <option name="searchByName" value="location">Location</option>
                                <option name="searchByName" value="deliverymode">Mode of Delivery</option>
                            </select>
                            <input type="text" className="searchrestaurant" name="search" value={ this.state.search } onChange={ this.onChange } />
                            <button type="button" className="searchsubmit" onClick={ this.searchRestaurants }>Search</button>
                        </form>
                    </div>
                    <div className="col-1"></div>
                </div>
                <div className="below-restaurant-search-bar">
                    <div className="row">
                        <div className="col-2 filters-wrapper">
                            <div className="all-filters">
                                <h5>Filters</h5>
                                <div className="delivery_filters">
                                    <input type="checkbox" name="delivery_method" value="curbside_pickup" onChange={ this.onChangeFilter } disabled={ this.state.dine_in || this.state.delivery } /> Curbside Pickup<br />
                                    <input type="checkbox" name="delivery_method" value="dine_in" onChange={ this.onChangeFilter } disabled={ this.state.curbside_pickup || this.state.delivery } /> Open Now<br />
                                    <input type="checkbox" name="delivery_method" value="delivery" onChange={ this.onChangeFilter } disabled={ this.state.curbside_pickup || this.state.dine_in } /> Yelp Delivery<br />
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <h2>Restaurants</h2>
                            <div className="row restaurants">
                                { this.state.filtered_restaurants.length ?
                                    this.state.filtered_restaurants.map( ( restaurant, index ) => {
                                        return <Restaurant restautantData={ restaurant } index={ index } onClick={ this.onClick } key={ index } />
                                    } )
                                    : "No restaurants found" }
                            </div>
                        </div>
                        <div className="col-2">
                            <Maps />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default UserDashboard;

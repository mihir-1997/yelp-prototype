import React, { Component } from 'react'
// import axios from 'axios';

import './Restaurant.css'

class Restaurant extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            // index: this.props.index,
            // id: this.props.restautantData.id,
            // name: this.props.restautantData.name,
            // description: this.props.restautantData.description,
            // location: this.props.restautantData.location,
            // email: this.props.restautantData.email,
            // phone_no: this.props.restautantData.phone_no,
            // timings: this.props.restautantData.timings,
            // picture: this.props.restautantData.image
        }
    }

    onClick = ( item ) => {
        this.props.onClick( this.props.restautantData.id )
    }

    render () {
        return (
            <div className="row each-restaurant" onClick={ this.onClick }>
                <div className="col-3">
                    { this.props.restautantData.image ?
                        <img src={ "http://localhost:3001/" + this.props.restautantData.image } className="each-restaurant-image" alt="res_pic" /> : null }
                </div>
                <div className="col-6">
                    <div className="row restaurant-name">
                        <h4>{ this.props.restautantData.name }</h4>
                    </div>
                    <div className="row restaurant-location">
                        { this.props.restautantData.location }
                    </div>
                    <div className="row">
                        <span className="restaurant-description">Description</span>: { this.props.restautantData.description }
                    </div>
                </div>
                <div className="col-3 contactinfo">
                    { this.props.restautantData.email }<br />
                    { this.props.restautantData.phone_no }<br />
                    { this.props.restautantData.timings }
                </div>
            </div>
        )
    }
}

export default Restaurant;

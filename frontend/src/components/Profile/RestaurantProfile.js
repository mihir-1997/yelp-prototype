import React, { Component } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';
import UpdateRestaurant from './UpdateRestaurant'
import Dishes from '../Dish/Dishes'
import AddDish from '../Dish/AddDish'
import './RestaurantProfile.css'

export default class RestaurantProfile extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            email: "",
            phone_no: "",
            location: "",
            description: "",
            timings: "",
            pictures: [],
            selected: "",
            radioShow: false,
            showPopup: false
        }
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            axios.get( "http://localhost:3001/getrestaurant/" + id )
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
        } else {
            console.log( "No Id found in local storage" )
        }
    }

    onChangePictures = item => {
        console.log( item.target.files )
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        console.log( item.target.files )
        if ( id ) {
            const formData = new FormData()
            Array.from( item.target.files ).forEach( ( file ) => {
                formData.append( 'file', file )
            } )
            formData.append( 'id', id )
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post( "http://localhost:3001/restaurantPictures", formData, config )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        window.location.reload();
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

    addFiles = () => {
        document.getElementById( "restaurantPictures" ).click()
    }

    updateProfile = () => {
        this.setState( {
            showPopup: !this.state.showPopup
        } )
    }

    updateDish = () => {
        this.setState( {
            radioShow: !this.state.radioShow
        } )
    }

    render () {
        if ( localStorage.getItem( "email" ) ) {
            // const contentStyle = { background: '#000' };
            const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
            const arrowStyle = { color: '#000' }; // style for an svg element

            const Modal = () => (
                <Popup
                    trigger={ <button type="button" className="btn btn-secondary"> Update</button> }
                    { ...{ overlayStyle, arrowStyle } }
                    position="left top">
                    <UpdateRestaurant restaurant={ this.state } />
                </Popup>
            );

            const AddNewDish = () => (
                <Popup
                    trigger={ <button type="button" className="btn btn-primary">Add Dish</button> }
                    { ...{ overlayStyle, arrowStyle } }
                    position="top">
                    <AddDish />
                </Popup>
            );
            return (
                < div id="restaurantProfile" style={ this.style }>
                    <div className="row h-20">
                        <div className="col-7">
                            <div className="row restaurantname">
                                { this.state.name }
                            </div>
                            <div className="row restaurantlocation">
                                { this.state.location }
                            </div>
                            <div className="row restaurantdescription">
                                { this.state.description }
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="row restaurantemail">
                                { this.state.email }
                            </div>
                            <div className="row restaurantphone">
                                { this.state.phone_no }
                            </div>
                        </div>
                        <div className="col-1">
                            <Modal />
                        </div>
                    </div>
                    <div className="row h-45">
                        {/* <h2>Pictures</h2> */ }
                        <div className="col">
                            <div className="row">
                                <div className="text-center">
                                    <input type="file" id="restaurantPictures" name="restaurantpictures" title="" accept="image/*" onChange={ this.onChangePictures } multiple hidden />
                                    <button type="button" className="btn btn-primary" onClick={ this.addFiles }>Add Picture</button>
                                </div>
                            </div>
                            <div className="row picture-scrolling-wrapper">
                                <div className="picture-scrolling">
                                    { this.state.pictures.map( picture => {
                                        return <img src={ "http://localhost:3001/" + picture } key={ picture } alt="restaurant_picture" className="restaurant-picture shadow" crossOrigin="anonymous"></img>
                                    } ) }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row h-70">
                        <div className="col">
                            <div className="row dish-heading">
                                <h2>Dishes</h2>
                            </div>
                            <div className="row">
                                <div className="col-4"></div>
                                <div className="col-2 text-center">
                                    <AddNewDish />
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-primary" onClick={ this.updateDish }>Update Dish</button>
                                </div>
                                <div className="col-4"></div>
                            </div>
                            <div className="row dishes">
                                <Dishes radioShow={ this.state.radioShow }></Dishes>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            window.location.assign( '/login' )
            return null
        }

    }
    style = {
        height: "100vh",
        margin: "30px 20px 20px 20px"
    }
}

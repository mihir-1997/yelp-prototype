import React, { Component } from 'react'
import './Userprofile.css'
import axios from 'axios'
import Popup from 'reactjs-popup';

import UpdateProfile from './UpdateUserProfile'
import Reviews from '../Reviews/Reviews'
const FormData = require( 'form-data' );

export class UserProfile extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            email: "",
            phone_no: "",
            nick_name: "",
            birthdate: "",
            city: "",
            state: "",
            country: "",
            website: "",
            headline: "",
            profile_picture: "",
            yelping_since: "",
            things_love: "",
            find_me: "",
            showPopup: false
        }
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            axios.get( "http://localhost:3001/getuser/" + id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            name: res.data.name,
                            email: res.data.email,
                            phone_no: res.data.phone_no,
                            nick_name: res.data.nick_name,
                            birthdate: res.data.birthdate,
                            city: res.data.city,
                            state: res.data.state,
                            country: res.data.country,
                            website: res.data.website,
                            headline: res.data.headline,
                            profile_picture: res.data.profile_picture,
                            yelping_since: res.data.yelping_since,
                            things_love: res.data.things_love,
                            find_me: res.data.find_me,
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

    onChangeProfile = item => {
        console.log( item.target.files[ 0 ] )
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            const formData = new FormData()
            formData.append( 'file', item.target.files[ 0 ] )
            formData.append( 'id', id )
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post( "http://localhost:3001/updateProfile", formData, config )
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

    updateProfile = () => {
        this.setState( {
            showPopup: !this.state.showPopup
        } )
    }

    render () {
        if ( localStorage.getItem( "email" ) ) {
            const contentStyle = { background: '#000' };
            const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
            const arrowStyle = { color: '#000' }; // style for an svg element

            const Modal = () => (
                <Popup
                    trigger={ <button type="button" className="btn btn-secondary"> Update</button> }
                    { ...{ contentStyle, overlayStyle, arrowStyle } }
                    position="left top">
                    <UpdateProfile user={ this.state } />
                </Popup>
            );
            return (
                < div id="userProfile" style={ this.style }>
                    <div className="row h-100">
                        <div className="col-3">
                            <div className="profile-picture-wrapper">
                                <div className="profile-picture h-75">
                                    <img src={ "http://localhost:3001/" + this.state.profile_picture } alt="profile" className="profile_pic" crossOrigin="anonymous"></img>
                                </div>
                                <div className="h-25">
                                    <form>
                                        <input type="file" id="profile" name="profile_picture" accept="image/*" onChange={ this.onChangeProfile } />
                                    </form>
                                </div>
                            </div>
                            <div className="below-profile-picture"></div>
                        </div>
                        <div className="col-9">
                            <div className="row h-25">
                                <div className="col-7">
                                    <div className="row username">
                                        { this.state.name }
                                    </div>
                                    <div className="row userlocation">
                                        { this.state.city }, { this.state.state }
                                    </div>
                                    <div className="row usersince">
                                        Since { this.state.yelping_since }
                                    </div>
                                    <div className="row userdescription">
                                        { this.state.headline }
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="row userwebsite">
                                        <a href={ this.state.website }>{ this.state.website }</a>
                                    </div>
                                    <div className="row userlove">
                                        { this.state.things_love }
                                    </div>
                                </div>
                                <div className="col-1">
                                    <Modal />
                                </div>
                            </div>
                            <Reviews id={ localStorage.getItem( "id" ) } active={ localStorage.getItem( "active" ) } />
                        </div>
                    </div>
                </div >
            )
        } else {
            window.location.assign( '/login' )
            return null
        }

    }
    style = {
        height: "100vh",
        margin: "20px"
    }
}

export default UserProfile

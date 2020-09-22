import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux';

import { userLogin } from '../../actions/userLogin'
import './Signup.css'

class Login extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            email: "",
            password: "",
            selected: "user",
            error: ""
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    radioChange = item => {
        console.log( item.target.value )
        this.setState( {
            selected: item.target.value
        } )
    }

    register = () => {
        window.location.assign( '/register' )
    }

    login = item => {
        item.preventDefault()
        if ( this.state.selected === "user" ) {
            const user = {
                email: this.state.email,
                password: this.state.password,
            }
            // axios.defaults.withCredentials = true;
            // axios.post( "http://localhost:3001/loginUser", user )
            //     .then( ( res ) => {
            //         if ( res.status === 200 ) {
            //             localStorage.setItem( "email", res.data.email )
            //             localStorage.setItem( "id", res.data.id )
            //             localStorage.setItem( "active", "user" )
            //             console.log( "User Loggedin successfully" )
            //             window.location.assign( '/userprofile' )
            //         }
            //     } )
            //     .catch( ( err ) => {
            //         if ( err.response ) {
            //             if ( err.response.status === 404 ) {
            //                 console.log( "Error! No user" )
            //                 this.setState( { "error": "No user found" } )
            //             } else if ( err.response.status === 401 ) {
            //                 this.setState( { "error": "Wrong Password" } )
            //             } else if ( err.response.status === 400 ) {
            //                 this.setState( { "error": "Each field is required" } )
            //             }
            //         }
            //     } )
            this.props.userLogin( user )
        } else {
            const restaurant = {
                email: this.state.email,
                password: this.state.password,
            }
            axios.defaults.withCredentials = true;
            axios.post( "http://localhost:3001/loginRestaurant", restaurant )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        localStorage.setItem( "email", res.data.email )
                        localStorage.setItem( "id", res.data.id )
                        localStorage.setItem( "active", "restaurant" )
                        console.log( "Restaurant Loggedin successfully" )
                        window.location.assign( '/restaurantprofile' )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( "Error! No restaurant" )
                            this.setState( { "error": "No restaurant found" } )
                        } else if ( err.response.status === 401 ) {
                            this.setState( { "error": "Wrong Password" } )
                        } else if ( err.response.status === 400 ) {
                            this.setState( { "error": "Each field is required" } )
                        }
                    }
                } )
        }
    }

    componentDidUpdate () {
        if ( this.props.id ) {
            setTimeout( () => {
                localStorage.setItem( "email", this.props.user.email )
                localStorage.setItem( "id", this.props.user.id )
                localStorage.setItem( "active", "user" )
                window.location.assign( '/userprofile' )
            }, 2000 )
        }
    }

    render () {
        if ( localStorage.getItem( "email" ) && localStorage.getItem( "active" ) === "user" ) {
            window.location.assign( '/userprofile' )
        } else if ( localStorage.getItem( "email" ) && localStorage.getItem( "active" ) === "restaurant" ) {
            window.location.assign( '/restaurantprofile' )
        }
        return (
            <div className="login" style={ this.loginContainer }>
                <h3>Login</h3>
                <input
                    type="radio"
                    name="selected"
                    onChange={ this.radioChange }
                    value="user"
                    required />
                <label
                    htmlFor="user">Customer</label>
                <input
                    type="radio"
                    name="selected"
                    onChange={ this.radioChange }
                    value="restaurant"
                    required />
                <label
                    htmlFor="restaurant">Restaurant</label>
                <form>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={ this.state.email }
                            onChange={ this.onChange }
                            required />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={ this.onChange }
                            value={ this.state.password }
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{ 8,}"
                            title="Password must contain lowercase, uppercase, digits and of minumim length of 8"
                            required />
                    </div>

                    <button
                        type="submit"
                        id="submit"
                        className="btn btn-success"
                        onClick={ this.login }>Login</button>
                </form>
                <button
                    type="button"
                    id="register"
                    onClick={ this.register }
                    className="btn btn-primary">Register</button>
                <div className="row">
                    <p id="error">{ this.props.error }</p>
                </div>
            </div >
        )
    }

    registerStyle = {
        color: "white"
    }
}

const mapStateToProps = state => ( {
    id: state.user.id,
    user: state.user.user,
    error: state.user.userError
} );

export default connect( mapStateToProps, { userLogin } )( Login );

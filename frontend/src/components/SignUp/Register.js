import React, { Component } from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import './Signup.css'

export class register extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            email: "",
            password: "",
            location: "",
            selected: "user",
            error: "",
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

    login = () => {
        window.location.assign( '/login' )
    }

    register = item => {
        item.preventDefault()
        if ( this.state.selected === "user" ) {
            const user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            }
            axios.defaults.withCredentials = true;
            axios.post( "http://localhost:3001/registerUser", user )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        console.log( "User added successfully" )
                        window.location.assign( '/login' )
                    } else {
                        console.log( "Error creating user" )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 409 ) {
                            this.setState( { "error": "User already exist" } )
                        }
                    }
                } )
        } else {
            const restaurant = {
                name: this.state.name,
                email: this.state.email,
                location: this.state.location,
                password: this.state.password,
            }
            axios.defaults.withCredentials = true;
            axios.post( "http://localhost:3001/registerRestaurant", restaurant )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        console.log( "Restaurant added successfully" )
                        window.location.assign( '/login' )
                    } else {
                        console.log( "Error creating restaurant" )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 409 ) {
                            this.setState( { "error": "Restaurant already exist" } )
                        }
                    }
                } )
        }
    }

    render () {
        if ( localStorage.getItem( "email" ) ) {
            window.location.assign( '/profile' )
        }
        return (
            <div className="register">
                <h3>Register</h3>
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
                <form
                    onSubmit={ this.register }>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={ this.state.name }
                            onChange={ this.onChange }
                            required />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={ this.state.email }
                            onChange={ this.onChange }
                            required />
                    </div>
                    { this.state.selected === "restaurant" &&
                        <div className="form-group">
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                onChange={ this.onChange }
                                value={ this.state.location }
                                required />
                        </div>
                    }
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
                        className="btn login-button"
                    >Register</button>
                </form>

                <br />
                <a href="/login"> Already have an account? Login</a>
                <div className="row">
                    <p id="error">{ this.state.error }</p>
                </div>
            </div >
        )
    }

    loginStyle = {
        color: "white"
    }
}

export default register

import React, { Component } from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import './Signup.css'

export class Login extends Component {

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
        this.props.history.push( '/register' )
    }

    login = item => {
        item.preventDefault()
        if ( this.state.selected === "user" ) {
            const user = {
                email: this.state.email,
                password: this.state.password,
            }
            axios.defaults.withCredentials = true;
            axios.post( "http://localhost:3001/loginUser", user )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        localStorage.setItem( "email", res.data.email )
                        localStorage.setItem( "id", res.data.id )
                        console.log( "User Loggedin successfully" )
                        this.props.history.push( '/userprofile' )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( "Error! No user" )
                            this.setState( { "error": "No user found" } )
                        } else if ( err.response.status === 401 ) {
                            this.setState( { "error": "Wrong Password" } )
                        } else if ( err.response.status === 400 ) {
                            this.setState( { "error": "Each field is required" } )
                        }
                    }
                } )
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
                        console.log( "Restaurant Loggedin successfully" )
                        this.props.history.push( '/restaurantprofile' )
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

    render () {
        if ( localStorage.getItem( "email" ) ) {
            this.props.history.push( '/userprofile' )
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
                    <p id="error">{ this.state.error }</p>
                </div>
            </div >
        )
    }

    registerStyle = {
        color: "white"
    }
}

export default Login

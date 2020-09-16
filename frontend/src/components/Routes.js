import React, { Component } from 'react'
import { Route } from "react-router-dom";
import { NavBar } from './NavBar/NavBar'
import Register from "./SignUp/Register"
import Login from "./SignUp/Login"
import UserProfile from "./Profile/UserProfile"
import RestaurantProfile from "./Profile/RestaurantProfile"

export class Routes extends Component {
    render () {
        return (
            <div>
                <Route path="/" component={ NavBar } />
                <Route path="/login" component={ Login } />
                <Route path="/register" component={ Register } />
                <Route path="/userprofile" component={ UserProfile } />
                <Route path="/restaurantprofile" component={ RestaurantProfile } />
            </div>
        )
    }
}

export default Routes

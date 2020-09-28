import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Yelp_Logo from '../../Images/Yelp_Logo.png'
import './Navbar.css'

//create the Navbar Component
export class NavBar extends Component {
    constructor( props ) {
        super( props );
        this.handleLogout = this.handleLogout.bind( this );
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        localStorage.removeItem( "email" )
        localStorage.removeItem( "id" )
        localStorage.removeItem( "active" )
        window.location.assign( '/login' )
    }
    render () {
        let redirectVar = null
        if ( !localStorage.getItem( "active" ) && this.props.location.pathname !== "/register" ) {
            redirectVar = <Redirect to="/login" />
            return redirectVar
        } else {
            return (
                < div >
                    { redirectVar }
                    { localStorage.getItem( "active" ) === "user" &&
                        <nav className="navbar navbar-default navbar-fixed-top navbar-expand-lg rounded">
                            <a className="navbar-brand" href="/userprofile">
                                <img src={ Yelp_Logo } width="60" height="30" alt="" />
                            </a>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item"><a className="nav-link" href="/userdashboard">Home</a></li>
                                <li className="nav-item"><a className="nav-link" href="/userorders">Orders</a></li>
                                <li className="nav-item"><a className="nav-link" href="#events">Events</a></li>
                                <li className="nav-item"><a className="nav-link" href="/userprofile">Profile</a></li>
                                <button type="button" className="logout-button" onClick={ this.handleLogout }>Log Out</button>
                            </ul>
                        </nav>
                    }
                    {localStorage.getItem( "active" ) === "restaurant" &&
                        <nav className="navbar navbar-expand-lg rounded">
                            <a className="navbar-brand" href="/restaurantHome">
                                <img src={ Yelp_Logo } width="60" height="30" alt="" />
                            </a>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item"><a className="nav-link" href="/restaurantprofile">Home</a></li>
                                <li className="nav-item"><a className="nav-link" href="/restaurantorders">Orders</a></li>
                                <li className="nav-item"><a className="nav-link" href="#events">Events</a></li>
                                <button type="button" className="logout-button" onClick={ this.handleLogout }>Log Out</button>
                            </ul>
                        </nav>
                    }
                </div>
            )
        }
    }
}

export default NavBar;
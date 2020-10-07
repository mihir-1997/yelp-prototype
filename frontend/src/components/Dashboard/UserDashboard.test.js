import React from 'react';
import { shallow } from 'enzyme';

import UserDashboard from './UserDashboard'

describe( 'UserDashboard', () => {

    let axios = require( "axios" );
    let MockAdapter = require( "axios-mock-adapter" );
    let mock = new MockAdapter( axios );

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost"
    const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 3001

    const restaurants = [
        {
            address: "43 S 1st St",
            city: "San Jose",
            curbside_pickup: 1,
            delivery: 0,
            description: "We serve quality food!",
            dine_in: 1,
            email: "res@gmail.com",
            id: 1,
            image: "RestaurantImages/subway-1600419949316.jpeg",
            name: "Subway",
            phone_no: "(123)-456-7893",
            state: "CA",
            timings: "9:00 AM-11:00 PM",
            zipcode: 95113
        },
        {
            address: "1398 W San Carlos St",
            city: "San Jose",
            curbside_pickup: 0,
            delivery: 1,
            description: "Tasty Food!",
            dine_in: 1,
            email: "mcd@gmail.com",
            id: 4,
            image: "RestaurantImages/erik-mclea-1601630103191.jpg",
            name: "McDonalds",
            phone_no: "(123)-456-7892",
            state: "CA",
            timings: "9:00 AM-11:00 PM",
            zipcode: 95126
        }
    ]

    const filtered_restaurants = [
        {
            address: "43 S 1st St",
            city: "San Jose",
            curbside_pickup: 1,
            delivery: 0,
            description: "We serve quality food!",
            dine_in: 1,
            email: "res@gmail.com",
            id: 1,
            image: "RestaurantImages/subway-1600419949316.jpeg",
            name: "Subway",
            phone_no: "(123)-456-7893",
            state: "CA",
            timings: "9:00 AM-11:00 PM",
            zipcode: 95113
        }
    ]

    mock.onGet( BACKEND_URL + ":" + BACKEND_PORT + "/getAllRestaurants" ).reply( 200,
        { restaurants: restaurants, latlongs: [] }
    );

    mock.onGet( BACKEND_URL + ":" + BACKEND_PORT + "/getrestaurantbysearch/cuisine/indian" ).reply( 200,
        [ 1 ]
    );

    let component

    beforeEach( () => {
        localStorage.setItem( "active", "user" )
        localStorage.setItem( "id", 1 )
        component = shallow( <UserDashboard debug /> );
    } );

    it( 'should render correctly in "debug" mode', () => {
        component.instance()
        expect( component ).toMatchSnapshot();
    } );

    it( 'validate localstorage has values', () => {
        expect( localStorage.getItem( "id" ) ).toEqual( 1 )
        expect( localStorage.getItem( "active" ) ).toEqual( "user" )
    } );

    it( 'render after setting localstorage', async ( done ) => {
        component
            .instance()
            .componentDidMount()
            .then( () => {
                expect( component.state().restaurants ).toEqual( restaurants )
                expect( component.state().filtered_restaurants ).toEqual( restaurants )
                done()
            } )
        expect( component ).toMatchSnapshot();
    } );

    it( 'simulate checkbox to filter restaurants by curbside_pickup', async ( done ) => {
        component
            .instance()
            .componentDidMount()
            .then( () => {
                let restaurants_filter = component.find( 'input[type="checkbox"]' ).at( 0 )
                expect( component.state().filtered_restaurants ).toEqual( restaurants )
                restaurants_filter.simulate( 'change', { target: { checked: true, value: "curbside_pickup" } } )
                expect( component.state().filtered ).toEqual( "curbside_pickup" )
                expect( component.state().filtered_restaurants ).toEqual( filtered_restaurants )
                restaurants_filter.simulate( 'change', { target: { checked: false, value: "curbside_pickup" } } )
                expect( component.state().filtered ).toEqual( "" )
                expect( component.state().filtered_restaurants ).toEqual( restaurants )
                done()
            } )

        expect( component ).toMatchSnapshot();
    } )

    it( 'simulate search restaurants to search indian cuisine', async ( done ) => {
        component
            .instance()
            .componentDidMount()
            .then( () => {
                let search_options = component.find( 'select.searchOptions' )
                let search = component.find( 'input[type="text"]' )
                expect( component.state().filtered_restaurants ).toEqual( restaurants )
                search_options.simulate( 'keydown', { keyCode: 40 } )
                search_options.simulate( 'keydown', { keyCode: 13 } )
                search_options.simulate( 'change', { target: { name: "selectedOption", value: "cuisine" } } )
                expect( component.state().selectedOption ).toEqual( "cuisine" )
                search.simulate( 'change', { target: { name: "search", value: "indian" } } )
                expect( component.state().search ).toEqual( "indian" )
                component
                    .instance()
                    .searchRestaurants( {
                        preventDefault: () => {
                        }
                    } )
                    .then( () => {
                        expect( component.state().filtered_restaurants ).toEqual( filtered_restaurants )
                        done()
                    } )

                expect( component ).toMatchSnapshot();
            } )
    } )

    it( 'validate localstorage is empty', () => {
        localStorage.removeItem( "id" )
        localStorage.removeItem( "active" )
        expect( localStorage.store ).toEqual( {} )
    } );

} )
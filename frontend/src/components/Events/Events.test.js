import React from 'react';
import { shallow } from 'enzyme';

import Events from './Events'

describe( 'Events', () => {

    let axios = require( "axios" );
    let MockAdapter = require( "axios-mock-adapter" );
    let mock = new MockAdapter( axios );

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost"
    const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 3001

    const events = [
        {
            date: "2020-09-30",
            description: "New event",
            hashtags: "#tasty",
            id: 2,
            location: "San Jose",
            name: "MCD Event",
            restaurant_id: 4,
            time: "08:00:00",
            user_ids: [ 10, 1 ],
            user_names: [ "Nishit", "Mihir Patel" ]
        },
        {
            date: "2020-10-01",
            description: "A food festival is an event that features a variety of foods, which are usually available for tasting or purchase. The food highlighted at one of these festivals may be a specific ingredient — such as",
            hashtags: "#food #foodfest",
            id: 3,
            location: "Santa Clara",
            name: "Food fest",
            restaurant_id: 4,
            time: "09:00:00",
            user_ids: [],
            user_names: []
        }
    ]

    mock.onGet( BACKEND_URL + ":" + BACKEND_PORT + "/eventsForRestaurants/4" ).reply( 200,
        events
    );

    let component

    beforeEach( () => {
        localStorage.setItem( "active", "restaurant" )
        localStorage.setItem( "id", 4 )
        component = shallow( <Events debug /> );
    } );

    it( 'should render correctly in "debug" mode', () => {
        component.instance()
        expect( component ).toMatchSnapshot();
    } );

    it( 'validate localstorage has values', () => {
        expect( localStorage.getItem( "id" ) ).toEqual( 4 )
        expect( localStorage.getItem( "active" ) ).toEqual( "restaurant" )
    } );

    it( 'render after setting localstorage', async ( done ) => {
        component
            .instance()
            .componentDidMount()
            .then( () => {
                expect( component.state().events ).toEqual( events )
                expect( component.find( 'div.single-restaurant-event' ) ).toHaveLength( 2 )
                done()
            } )
        expect( component ).toMatchSnapshot();
    } );

    it( 'validate localstorage is empty', () => {
        localStorage.removeItem( "id" )
        localStorage.removeItem( "active" )
        expect( localStorage.store ).toEqual( {} )
    } );

} )
import React from 'react';
import { shallow } from 'enzyme';

import UserOrders from './UserOrders';

describe( 'UserOrders', () => {

    let axios = require( "axios" );
    let MockAdapter = require( "axios-mock-adapter" );
    let mock = new MockAdapter( axios );

    const orders = [
        {
            id: 8,
            total: 15,
            status: 'Ordered',
            order_date: '2020-09-30T08:44:18.000Z',
            restaurant_name: 'McDonalds',
            dish_name: 'French Fries'
        },
        {
            id: 2,
            total: 20,
            status: 'Delivered',
            order_date: '2020-09-27T06:01:13.000Z',
            restaurant_name: 'Subway',
            dish_name: 'Hamburger'
        },
        {
            id: 1,
            total: 12,
            status: 'Delivered',
            order_date: '2020-09-27T00:25:41.000Z',
            restaurant_name: 'Subway',
            dish_name: 'Burger'
        }
    ]

    const filtered_orders = [
        {
            id: 8,
            total: 15,
            status: 'Ordered',
            order_date: '2020-09-30T08:44:18.000Z',
            restaurant_name: 'McDonalds',
            dish_name: 'French Fries'
        },
    ]

    mock.onGet( "http://localhost:3001/getUserOrders/1" ).reply( 200,
        orders
    );

    let component

    beforeEach( () => {
        localStorage.setItem( "active", "user" )
        localStorage.setItem( "id", 1 )
        component = shallow( <UserOrders debug /> );
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
                expect( component.state().orders ).toEqual( orders )
                expect( component.state().filtered_orders ).toEqual( orders )
                done()
            } )
        expect( component ).toMatchSnapshot();
    } );

    it( 'simulate checkbox to filter orders with status ordered', async ( done ) => {
        component
            .instance()
            .componentDidMount()
            .then( () => {
                let ordered_checkbox = component.find( 'input[type="checkbox"]' ).at( 0 )
                expect( component.state().filtered_orders ).toEqual( orders )
                ordered_checkbox.simulate( 'change', { target: { checked: true, value: "Ordered" } } )
                expect( component.state().filtered ).toEqual( "Ordered" )
                expect( component.state().filtered_orders ).toEqual( filtered_orders )
                ordered_checkbox.simulate( 'change', { target: { checked: false, value: "Ordered" } } )
                expect( component.state().filtered ).toEqual( "" )
                expect( component.state().filtered_orders ).toEqual( orders )
                done()
            } )

        expect( component ).toMatchSnapshot();
    } )

    it( 'validate localstorage is empty', () => {
        localStorage.removeItem( "id" )
        localStorage.removeItem( "active" )
        expect( localStorage.store ).toEqual( {} )
    } );

} );
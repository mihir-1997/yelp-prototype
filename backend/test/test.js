let chai = require( 'chai' );
let chaiHttp = require( 'chai-http' );
// let server = require( '../index' );
let should = chai.should();

chai.use( chaiHttp );

let server = "http://localhost:3001"

// get user test
describe( '/GET user by id', () => {
    it( 'it should GET a user from id', ( done ) => {
        chai.request( server )
            .get( '/getuser/1' )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                res.body.should.be.a( 'object' );
                res.body.should.have.property( "id" )
                res.body.should.have.property( "email" )
                res.body.should.not.have.property( "password" )
                res.body.should.have.property( "id" ).eql( 1 )
                res.body.should.have.property( "email" ).eql( "mihir@gmail.com" )
                done();
            } );
    } );
} );

// user login test
describe( '/POST uesr login', () => {
    it( 'it should check user credentials and send status accordingly (200)', ( done ) => {
        let user = {
            email: "mihir@gmail.com",
            password: "Mihir1234"
        }
        chai.request( server )
            .post( '/loginUser' )
            .send( user )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                res.body.should.be.a( 'object' );
                res.body.should.have.property( "id" )
                res.body.should.have.property( "email" )
                res.body.should.have.property( "password" )
                res.body.should.have.property( "id" ).eql( 1 )
                res.body.should.have.property( "email" ).eql( "mihir@gmail.com" )
                done();
            } );
    } );

    it( 'it should check user credentials and send status accordingly (401)', ( done ) => {
        let user = {
            email: "mihir@gmail.com",
            password: "Mihir1231"
        }
        chai.request( server )
            .post( '/loginUser' )
            .send( user )
            .end( ( err, res ) => {
                res.should.have.status( 401 );
                res.body.should.be.a( 'object' );
                res.body.should.have.property( "message" )
                res.body.should.have.property( "message" ).eql( "Wrong Password" )
                done();
            } );
    } );
} );

// get restaurant by id
describe( '/GET restaurant by id', () => {
    it( 'it should GET a restaurant from id', ( done ) => {
        chai.request( server )
            .get( '/getrestaurant/1' )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                res.body.should.be.a( 'object' );
                res.body.should.have.property( "id" )
                res.body.should.have.property( "email" )
                res.body.should.have.property( "pictures" )
                res.body.should.not.have.property( "password" )
                res.body.should.have.property( "id" ).eql( 1 )
                res.body.should.have.property( "email" ).eql( "res@gmail.com" )
                res.body.should.have.property( "latitude" ).eql( 37.335355 )
                done();
            } );
    } );
} );

// change order status
describe( '/PUT order status', () => {
    it( 'it should UPDATE an order status', ( done ) => {
        let order = {
            updated_status: "Delivered"
        }
        chai.request( server )
            .put( '/updateOrderStatus/8' )
            .send( order )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                res.body.should.be.a( 'object' );
                res.body.should.have.property( "message" )
                res.body.should.have.property( "message" ).eql( "Updated" )
                done();
            } );
    } );
} );

// update dish 
describe( '/PUT dish', () => {
    it( 'it should UPDATE a dish', ( done ) => {
        let dish = {
            id: 2,
            restaurant_id: 1,
            name: "Hamburger",
            ingredients: "Evaporated milk, Worcestershire sauce",
            price: 25,
            description: "A sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun",
            category: "Main Course",
            file: "DishImages/hamburger-1601598026442.jpeg",
            cuisine: "American"
        }
        chai.request( server )
            .put( '/updateDish/2' )
            .send( dish )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                res.body.should.be.a( 'object' );
                res.body.should.have.property( "id" ).eql( "2" )
                chai.request( server )
                    .get( '/getDish/2' )
                    .end( ( err, res ) => {
                        res.should.have.status( 200 );
                        res.body.should.be.a( 'object' );
                        res.body.should.have.property( "id" ).eql( 2 )
                        res.body.should.have.property( "price" ).eql( 25 )
                        res.body.should.have.property( "name" ).eql( "Hamburger" )
                    } );
                done();
            } );
    } );
} );
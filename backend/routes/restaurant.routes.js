module.exports = app => {
    const Restaurants = require( "../controllers/restaurant.controller" );

    // Create a new Restaurant
    app.post( "/registerRestaurant", ( req, res ) => {
        Restaurants.create( req, res )
    } );

    // Retrieve all Restaurants
    app.get( "/Restaurants", ( req, res ) => {
        Restaurants.findAll( req, res )
    } );

    // Retrieve a single Restaurant with RestaurantEmail
    app.post( "/loginRestaurant", ( req, res ) => {
        Restaurants.findOne( req, res )
    } );

    // Retrieve a single Restaurant with RestaurantsId
    app.get( "/getrestaurant/:id", ( req, res ) => {
        Restaurants.findOneById( req, res )
    } );

    // Update a Restaurant with RestaurantEmail
    app.put( "/updaterestaurant/:id", ( req, res ) => {
        console.log( `update` )
        Restaurants.update( req, res )
    } );

    // Delete a Restaurant with RestaurantEmail
    app.delete( "/Restaurants/:email", ( req, res ) => {
        Restaurants.delete( req, res )
    } );

};
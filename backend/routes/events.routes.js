module.exports = app => {
    const events = require( "../controllers/events.controller.js" );

    // Create a new review
    app.post( "/postevent", ( req, res ) => {
        events.create( req, res )
    } );

    // Retrieve all events for user
    app.get( "/getAllEvents/:user_id", ( req, res ) => {
        events.getAll( req, res )
    } );

    // Retrieve all events for restaurant
    app.get( "/eventsForRestaurants/:id", ( req, res ) => {
        events.findAllForRestaurants( req, res )
    } );

    // Register a new user to event
    app.post( "/registeForEvent", ( req, res ) => {
        events.registerUser( req, res )
    } );

    // app.get( "/averageRatingsForRestaurant/:id", ( req, res ) => {
    //     events.averageRatingsForRestaurant( req, res )
    // } );

};
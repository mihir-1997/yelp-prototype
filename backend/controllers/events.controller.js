const Event = require( "../models/events.model.js" );

exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    // create a event
    const newEvent = new Event( {
        restaurant_id: req.body.restaurant_id,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
        time: req.body.time,
        hashtags: req.body.hashtags,
    } )
    console.log( newEvent )
    Event.create( newEvent, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving Events"
            } );
            return
        } else res.send( data );
    } )
}

// find all events for user
exports.getAll = ( req, res ) => {
    if ( !req.params.user_id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Event.getAll( req, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving events"
            } );
            return
        } else res.send( data );
    } );
};

exports.findAllForRestaurants = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Event.findByRestaurantId( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No Events found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving Events"
                } );
                return
            }
        } else res.send( data );
    } );
};

// register a new user to event
exports.registerUser = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    // create a event
    const newEvent_sub = {
        user_id: req.body.user_id,
        event_id: req.body.event_id
    }
    Event.registerUser( newEvent_sub, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving Events"
            } );
            return
        } else res.send( data );
    } )
}

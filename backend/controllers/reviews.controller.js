const Reviews = require( "../models/reviews.model.js" );

// find reviews by user_id
exports.findAllForUsers = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Reviews.findByUserId( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No reviews found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving reviews"
                } );
                return
            }
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
    Reviews.findByRestaurantId( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No reviews found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving reviews"
                } );
                return
            }
        } else res.send( data );
    } );
};

exports.averageRatingsForRestaurant = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Reviews.averageRatingsForRestaurant( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No reviews found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving reviews"
                } );
                return
            }
        } else res.send( data );
    } );
};
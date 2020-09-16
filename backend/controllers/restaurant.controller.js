const Restaurant = require( "../models/restaurant.model" );
var passwordHash = require( 'password-hash' );

// create a new Restaurant
exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    const hashedPassword = passwordHash.generate( req.body.password );
    // Create a Restaurant
    const restaurant = new Restaurant( {
        name: req.body.name,
        email: req.body.email,
        location: req.body.location,
        phone_no: req.body.phone_no,
        description: req.body.description,
        timings: req.body.timings,
        password: hashedPassword
    } );

    // Save Restaurant in the database
    Restaurant.create( restaurant, ( err, data ) => {
        if ( err ) {
            console.log( err.message )
            if ( err.code === "ER_DUP_ENTRY" ) {
                res.status( 409 ).send( {
                    message: "Restaurant already exist"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message:
                        err.message || "Some error occurred while creating the Restaurant."
                } );
                return
            }
        } else res.send( data );
    } );
};

// find one Restaurant by id
exports.findOne = ( req, res ) => {
    if ( !req.body.email && !req.body.password ) {
        res.status( 400 ).send( {
            message: "Each field is required"
        } );
        return
    }
    Restaurant.findByEmail( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No Restaurant found`
                } );
                return
            } else if ( err.kind === "wrong_password" ) {
                res.status( 401 ).send( {
                    message: "Wrong Password"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving Restaurant"
                } );
                return
            }
        } else res.send( data );
    } );
};

// update one Restaurant by id
exports.update = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }

    Restaurant.updateByEmail(
        req.params.email,
        new Restaurant( req.body ),
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found Restaurant with Id ${ req.params.email }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating Restaurant with Id " + req.params.email
                    } );
                }
            } else res.send( data );
        }
    );
};

// delete one Restaurant by id
exports.delete = ( req, res ) => {
    Restaurant.remove( req.params.email, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `Not found Restaurant with id ${ req.params.email }.`
                } );
            } else {
                res.status( 500 ).send( {
                    message: "Could not delete Restaurant with id " + req.params.email
                } );
            }
        } else res.send( { message: `Restaurant was deleted successfully!` } );
    } );
};
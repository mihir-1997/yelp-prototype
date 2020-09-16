const sql = require( "./db.js" );
var passwordHash = require( 'password-hash' );

// constructor
const Restaurant = function ( Restaurant ) {
    this.name = Restaurant.name;
    this.email = Restaurant.email;
    this.location = Restaurant.location;
    this.phone_no = Restaurant.phone_no;
    this.description = Restaurant.description;
    this.timings = Restaurant.timings;
    this.password = Restaurant.password
};

Restaurant.create = ( newRestaurant, result ) => {
    sql.query( "INSERT INTO restaurants SET ?", newRestaurant, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        console.log( "created Restaurant: ", { id: res.insertId, ...newRestaurant } );
        result( null, { id: res.insertId, ...newRestaurant } );
    } );
};

Restaurant.findByEmail = ( req, result ) => {
    sql.query( `SELECT * FROM restaurants WHERE email = \'${ req.body.email }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        if ( res.length ) {
            console.log( "found Restaurant: ", res[ 0 ] );
            if ( passwordHash.verify( req.body.password, res[ 0 ].password ) ) {
                result( null, res[ 0 ] );
                return;
            } else {
                result( { kind: "wrong_password" }, null );
                return
            }
        }

        // not found Restaurant with the Email
        result( { kind: "not_found" }, null );
        return
    } );
};

Restaurant.getAll = result => {
    sql.query( "SELECT * FROM restaurants", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( "Restaurants: ", res );
        result( null, res );
    } );
};

Restaurant.updateByEmail = ( email, Restaurant, result ) => {
    sql.query(
        "UPDATE restaurants SET name = ?, email = ?, location = ?, phone_no = ?, description = ?, timings = ? WHERE email = ?",
        [ Restaurant.name, Restaurant.email, Restaurant.location, Restaurant.phone_no, Restaurant.description, Restaurant.timings ],
        ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            if ( res.affectedRows == 0 ) {
                // not found Restaurant with the email
                result( { kind: "not_found" }, null );
                return;
            }

            console.log( "updated Restaurant: ", { email: email, ...Restaurant } );
            result( null, { email: email, ...Restaurant } );
        }
    );
};

Restaurant.remove = ( email, result ) => {
    sql.query( "DELETE FROM restaurants WHERE email = ?", email, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        if ( res.affectedRows == 0 ) {
            // not found Restaurant with the email
            result( { kind: "not_found" }, null );
            return;
        }

        console.log( "deleted Restaurant with email: ", email );
        result( null, res );
    } );
};

Restaurant.removeAll = result => {
    sql.query( "DELETE FROM restaurants", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( `deleted ${ res.affectedRows } Restaurants` );
        result( null, res );
    } );
};

module.exports = Restaurant;
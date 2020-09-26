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
    this.pictures = Restaurant.pictures;
    this.curbside_pickup = Restaurant.curbside_pickup;
    this.dine_in = Restaurant.dine_in;
    this.delivery = Restaurant.delivery;
    this.password = Restaurant.password
};

Restaurant.create = ( newRestaurant, result ) => {
    delete newRestaurant[ "pictures" ]
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

Restaurant.findById = ( req, result ) => {
    var restaurant = null
    var error = false
    sql.query( `SELECT * FROM restaurants WHERE id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            console.log( "found Restaurant: ", res[ 0 ] );
            let { password, ...alldata } = res[ 0 ]
            restaurant = alldata
            sql.query( `SELECT * FROM restaurant_images WHERE restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( err, null );
                    return;
                }
                if ( res.length ) {
                    console.log( "found Restaurant Pictures: ", res );
                    let images = []
                    res.forEach( r => {
                        let { image, ...restdata } = r
                        images.push( image )
                    } )
                    restaurant[ "pictures" ] = images
                    result( null, restaurant )
                    return;
                    // result( null, alldata );
                } else {
                    // not found Restaurant with the id
                    result( null, restaurant )
                    return;
                }
            } );
        } else {
            // not found Restaurant with the id
            console.log( "error: ", null );
            return;
        }
    } );
};

Restaurant.getAll = ( req, result ) => {
    sql.query( "SELECT r.id, r.name, r.location, r.email, r.phone_no, r.description, r.timings, r.curbside_pickup, r.dine_in, r.delivery, ri.image FROM restaurants r LEFT JOIN restaurant_images ri on r.id = ri.restaurant_id", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }
        if ( res.length ) {
            const filtered_data = [];
            const map = new Map();
            for ( const item of res ) {
                if ( !map.has( item.id ) ) {
                    map.set( item.id, true );
                    filtered_data.push( item );
                }
            }

            result( null, filtered_data );
            return
        }
        console.log( "Restaurants: ", res );
        result( null, res );
    } );
};

Restaurant.updateById = ( id, Restaurant, result ) => {
    Restaurant.curbside_pickup = Restaurant.curbside_pickup ? 1 : 0
    Restaurant.dine_in = Restaurant.dine_in ? 1 : 0
    Restaurant.delivery = Restaurant.delivery ? 1 : 0
    sql.query(
        "UPDATE restaurants SET name = ?, email = ?, location = ?, phone_no = ?, description = ?, timings = ?, curbside_pickup = ?, dine_in = ?, delivery = ? WHERE id = ?",
        [ Restaurant.name, Restaurant.email, Restaurant.location, Restaurant.phone_no, Restaurant.description, Restaurant.timings, parseInt( Restaurant.curbside_pickup, 10 ), parseInt( Restaurant.dine_in, 10 ), parseInt( Restaurant.delivery, 10 ), id ],
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

            console.log( "updated Restaurant: ", { id: id, ...Restaurant } );
            result( null, { id: id, ...Restaurant } );
        }
    );
};

Restaurant.addPictures = ( id, files, result ) => {
    let error = false
    files.forEach( ( file ) => {
        sql.query(
            "INSERT INTO restaurant_images SET restaurant_id = ?, image = ?",
            [ id, file.path ],
            ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( null, err );
                    return;
                }

                if ( res.affectedRows == 0 ) {
                    // not found Restaurant with the email
                    error = true
                }
                console.log( res )
                // console.log( "updated Restaurant: ", { profile_picture: profile_picture, res[0] } );
            }
        );
    } )
    if ( !error ) {
        result( null, { message: "picture added" } );
        return
    }
};

Restaurant.findOneImageById = ( req, result ) => {
    sql.query( `SELECT * FROM restaurant_images WHERE restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }
        if ( res.length ) {
            result( null, res[ 0 ] );
            return
        }
        result( null, res );
    } );
}

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
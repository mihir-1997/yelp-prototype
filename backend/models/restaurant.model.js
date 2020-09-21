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
                    console.log( "error: ", null );
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

Restaurant.updateById = ( id, Restaurant, result ) => {
    sql.query(
        "UPDATE restaurants SET name = ?, email = ?, location = ?, phone_no = ?, description = ?, timings = ? WHERE id = ?",
        [ Restaurant.name, Restaurant.email, Restaurant.location, Restaurant.phone_no, Restaurant.description, Restaurant.timings, id ],
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
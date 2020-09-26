const sql = require( "./db.js" );

const Reviews = function () {

}

Reviews.findByUserId = ( req, result ) => {

    sql.query( `SELECT reviews.*, restaurants.name, restaurants.location FROM reviews INNER JOIN restaurants ON reviews.restaurant_id = restaurants.id WHERE reviews.user_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            result( null, res )
            return
        }
        result( { kind: "not_found" }, null );
        return
    } );

}

Reviews.findByRestaurantId = ( req, result ) => {
    sql.query( `SELECT reviews.*, users.name, users.city, users.state FROM reviews INNER JOIN users ON reviews.user_id = users.id WHERE reviews.restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            result( null, res )
            return
        }
        result( { kind: "not_found" }, null );
        return
    } );
}

Reviews.averageRatingsForRestaurant = ( req, result ) => {
    sql.query( `select CAST(AVG(ratings) AS DECIMAL(10,2)) as ratings from reviews where restaurant_id= \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            console.log( "ratings: " + res[ 0 ] )
            result( null, res[ 0 ] )
            return
        }
        result( { kind: "not_found" }, null );
        return
    } );
}

module.exports = Reviews;
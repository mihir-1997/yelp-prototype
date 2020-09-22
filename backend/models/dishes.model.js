const sql = require( "./db.js" );

// constructor
const Dish = function ( Dish ) {
    this.restaurant_id = Dish.restaurant_id;
    this.name = Dish.name;
    this.ingredients = Dish.ingredients;
    this.price = Dish.price;
    this.description = Dish.description;
    this.category = Dish.category;
    this.image = Dish.image;
};

Dish.create = ( newDish, result ) => {
    sql.query( "INSERT INTO dishes SET ?", newDish, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        console.log( "created Dish: ", { id: res.insertId, ...newDish } );
        result( null, { id: res.insertId, ...newDish } );
    } );
};

Dish.findAll = ( req, result ) => {
    console.log( "get dishes" )
    console.log( req.params.restaurant_id )
    sql.query( `SELECT * FROM dishes WHERE restaurant_id = \'${ req.params.restaurant_id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        if ( res.length ) {
            console.log( "found Dish: ", res[ 0 ] );
            result( null, res );
            return
        }

        // not found Dish with the Email
        result( { kind: "not_found" }, null );
        return
    } );
};

Dish.findById = ( req, result ) => {
    var dish = null
    var error = false
    sql.query( `SELECT * FROM dishes WHERE id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            console.log( "found Dish: ", res[ 0 ] );
            let { password, ...alldata } = res[ 0 ]
            dish = alldata
            sql.query( `SELECT * FROM dish_images WHERE dish_id = \'${ req.params.id }\'`, ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( err, null );
                    return;
                }
                if ( res.length ) {
                    console.log( "found Dish Pictures: ", res );
                    let images = []
                    res.forEach( r => {
                        let { image, ...restdata } = r
                        images.push( image )
                    } )
                    dish[ "pictures" ] = images
                    result( null, dish )
                    return;
                    // result( null, alldata );
                } else {
                    // not found dish with the id
                    console.log( "error: ", null );
                    return;
                }
            } );
        } else {
            // not found dish with the id
            console.log( "error: ", null );
            return;
        }
    } );
};

Dish.getAll = result => {
    sql.query( "SELECT * FROM dishes", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( "Dishs: ", res );
        result( null, res );
    } );
};

Dish.updateById = ( id, req, result ) => {
    console.log( req.body )
    let image_path = null
    if ( req.file ) {
        if ( req.file.path ) {
            image_path = req.file.path
        } else {
            image_path = req.body.file
        }
    } else {
        image_path = req.body.file
    }
    sql.query(
        "UPDATE dishes SET name = ?, ingredients = ?, price = ?, description = ?, category = ?, image = ? WHERE id = ?",
        [ req.body.name, req.body.ingredients, req.body.price, req.body.description, req.body.category, image_path, id ],
        ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            if ( res.affectedRows == 0 ) {
                // not found Dish with the email
                result( { kind: "not_found" }, null );
                return;
            }

            console.log( "updated Dish: ", { id: id, ...Dish } );
            result( null, { id: id, ...Dish } );
        }
    );
};

Dish.addPictures = ( id, files, result ) => {
    let error = false
    files.forEach( ( file ) => {
        sql.query(
            "INSERT INTO Dish_images SET dishe_id = ?, image = ?",
            [ id, file.path ],
            ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( null, err );
                    return;
                }

                if ( res.affectedRows == 0 ) {
                    // not found Dish with the email
                    error = true
                }
                console.log( res )
                // console.log( "updated Dish: ", { profile_picture: profile_picture, res[0] } );
            }
        );
    } )
    if ( !error ) {
        result( null, { message: "picture added" } );
        return
    }
};

Dish.remove = ( email, result ) => {
    sql.query( "DELETE FROM dishes WHERE email = ?", email, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        if ( res.affectedRows == 0 ) {
            // not found Dish with the email
            result( { kind: "not_found" }, null );
            return;
        }

        console.log( "deleted Dish with email: ", email );
        result( null, res );
    } );
};

Dish.removeAll = result => {
    sql.query( "DELETE FROM dishes", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( `deleted ${ res.affectedRows } Dish` );
        result( null, res );
    } );
};

module.exports = Dish;
const sql = require( "./db.js" );

const Event = function ( Event ) {
    this.user_id = Event.user_id;
    this.restaurant_id = Event.restaurant_id;
    this.name = Event.name;
    this.description = Event.description;
    this.location = Event.location;
    this.date = Event.date;
    this.time = Event.time;
    this.hashtags = Event.hashtags;
}

Event.create = ( newEvent, result ) => {
    console.log( newEvent )
    delete newEvent[ "user_id" ]
    sql.query( "INSERT INTO events SET ?", newEvent, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        result( null, { id: res.insertId, ...newEvent } );
    } );
}

Event.getAll = ( req, result ) => {
    sql.query( `SELECT e.*, r.name as restaurant_name from events e inner join restaurants r on e.restaurant_id=r.id where e.id not in (select event_id from events_sub where user_id = ${ req.params.user_id }) ORDER BY e.date ASC`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        // if ( res.length ) {
        console.log( "events model" )
        let unregistered_events = res
        console.log( unregistered_events )
        sql.query( `SELECT e.*, r.name as restaurant_name from events e inner join restaurants r on e.restaurant_id=r.id where e.id in (select event_id from events_sub where user_id = ${ req.params.user_id }) ORDER BY e.date ASC`, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( err, null );
                return;
            }
            if ( res.length ) {
                let registered_events = res
                console.log( registered_events )
                result( null, { unregistered_events: unregistered_events, registered_events: registered_events } )
                return
            } else {
                let registered_events = null
                result( null, { unregistered_events: unregistered_events, registered_events: registered_events } )
                return
            }

        } );
    } );

}

Event.findByRestaurantId = ( req, result ) => {
    sql.query( `SELECT * FROM events e WHERE e.restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            res.map( event => {
                event[ "user_ids" ] = []
                event[ "user_names" ] = []
            } )
            let output = res
            sql.query( `SELECT * FROM events_sub es WHERE es.event_id in (SELECT id FROM events WHERE restaurant_id = \'${ req.params.id }\')`, ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( err, null );
                    return;
                }
                if ( res ) {
                    console.log( res )
                    res.map( e => {
                        output.map( event => {
                            if ( event.id === e.event_id ) {
                                event[ "user_ids" ].push( e.user_id )
                                event[ "user_names" ].push( e.user_name )
                            }
                        } )
                    } )
                    result( null, output )
                    return
                }
            } )
        } else {
            result( { kind: "not_found" }, null );
            return
        }
    } );
}

// registerUser
Event.registerUser = ( newEvent_sub, result ) => {
    sql.query( `SELECT name from users where id=${ newEvent_sub.user_id }`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res ) {
            newEvent_sub[ "user_name" ] = res[ 0 ].name
            sql.query( "INSERT INTO events_sub SET ?", newEvent_sub, ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( err, null );
                    return;
                }
                result( null, { id: res.insertId, ...newEvent_sub } );
            } );
        }
    } )

}


module.exports = Event;
const express = require( "express" );
const bodyParser = require( "body-parser" );

const app = express();

// express session
var session = require( 'express-session' );
var cookieParser = require( 'cookie-parser' );
var cors = require( "cors" );
const multer = require( "multer" );
const path = require( 'path' )
const users = require( "./controllers/user.controller" );
// use body parser to parse JSON and urlencoded request bodies
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
// use cookie parser to parse request headers
app.use( cookieParser() );
app.use( cors( { origin: "http://localhost:3000", credentials: true } ) );
// use session to store user data between HTTP requests
app.use( session( {
    name: '',
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
} ) );

app.use( '/Profiles', express.static( path.join( __dirname, '/Profiles' ) ) );

// simple route
app.get( "/", ( req, res ) => {
    res.json( { message: "Welcome to bezkoder application." } );
} );

// users routes
require( "./routes/user.routes" )( app );

// restaurants routes
require( "./routes/restaurant.routes" )( app );

const storage = multer.diskStorage( {
    // destination: '/uploads/',
    destination: function ( req, file, cb ) {
        cb( null, 'Profiles/' )
    },
    filename: function ( req, file, callback ) {
        callback( null, file.originalname.split( "." )[ 0 ] + '-' + Date.now() + path.extname( file.originalname ) )
    }
} );

const upload = multer( {
    storage: storage,
} )

app.post( "/updateProfile", upload.single( "file" ), ( req, res ) => {
    console.log( req.body.id )
    console.log( req.file )
    users.updateProfile( req, res )
} );

// set port, listen for requests
app.listen( 3001, () => {
    console.log( "Server is running on port 3001." );
} );
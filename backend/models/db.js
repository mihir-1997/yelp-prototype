const mysql = require( 'mysql' );
const dbConfig = require( '../config/db.config' )

// Create database connection
const connection = mysql.createConnection( {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
} );

// Open a database connection
connection.connect( error => {
    if ( error ) throw error;
    console.log( "Successfully connected to the database." );
} );

module.exports = connection;
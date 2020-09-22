import axios from 'axios'

import { GET_USER } from './types'

export const getUser = userData => dispatch => {
    axios.defaults.withCredentials = true
    let id = localStorage.getItem( "id" )
    axios.get( "http://localhost:3001/getuser/" + id )
        .then( ( res ) => {
            if ( res.status === 200 ) {
                dispatch( {
                    type: GET_USER,
                    error: "",
                    payload: res.data
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.response ) {
                dispatch( {
                    type: GET_USER,
                    error: err.response,
                    payload: {}
                } )
            }
        } )
}
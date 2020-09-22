import axios from 'axios'

import { UPDATE_USER } from './types'

export const updateUser = userData => dispatch => {
    axios.defaults.withCredentials = true
    let id = localStorage.getItem( "id" )
    axios.defaults.withCredentials = true;

    axios.put( "http://localhost:3001/updateUser/" + id, userData )
        .then( ( res ) => {
            if ( res.status === 200 ) {
                dispatch( {
                    type: UPDATE_USER,
                    error: "",
                    payload: res.data
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.response ) {
                dispatch( {
                    type: UPDATE_USER,
                    error: err.response,
                    payload: {}
                } )
            }
        } )
}
import axios from 'axios'

import { USER_LOGIN, REGISTER_USER } from './types'

export const userLogin = userData => dispatch => {
    axios.defaults.withCredentials = true
    axios.post( "http://localhost:3001/loginUser", userData )
        .then( ( res ) => {
            if ( res.status === 200 ) {
                dispatch( {
                    type: USER_LOGIN,
                    error: "",
                    payload: res.data
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.response ) {
                dispatch( {
                    type: USER_LOGIN,
                    error: err.response,
                    payload: {}
                } )
            }
        } )
}

export const registerUser = userData => dispatch => {
    axios.defaults.withCredentials = true
    axios.post( "http://localhost:3001/registerUser", userData )
        .then( ( res ) => {
            if ( res.status === 200 ) {
                dispatch( {
                    type: REGISTER_USER,
                    error: "",
                    payload: res.data
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.response ) {
                dispatch( {
                    type: REGISTER_USER,
                    error: err.response,
                    payload: {}
                } )
            }
        } )
}


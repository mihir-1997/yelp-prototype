import { USER_LOGIN, GET_USER, UPDATE_USER, REGISTER_USER } from '../actions/types'

const initialState = {
    id: "",
    user: {},
    userError: ""
};

export default function ( state = initialState, action ) {
    switch ( action.type ) {
        case USER_LOGIN:
            if ( action.error ) {
                if ( action.error.status === 404 ) {
                    console.log( "Error! No user" )
                    return {
                        ...state,
                        userError: "No user found"
                    }
                } else if ( action.error.status === 401 ) {
                    return {
                        ...state,
                        userError: "Wrong Password"
                    }
                } else if ( action.error.status === 400 ) {
                    return {
                        ...state,
                        userError: "Each field is required"
                    }
                }
                return {
                    ...state,
                    userError: "Something went wrong"
                }
            } else {
                return {
                    ...state,
                    id: action.payload.id,
                    user: action.payload,
                    userError: ""
                };
            }
        case GET_USER:
            if ( action.error ) {
                if ( action.error.status === 404 ) {
                    console.log( "Error! No user" )
                    return {
                        ...state
                    }
                } else if ( action.error.status === 400 ) {
                    console.log( action.error.message )
                    return {
                        ...state
                    }
                }
                return {
                    ...state
                }
            } else {
                return {
                    ...state,
                    id: action.payload.id,
                    user: action.payload,
                    userError: ""
                };
            }

        case UPDATE_USER:
            if ( action.error ) {
                if ( action.error.status === 404 ) {
                    return {
                        ...state
                    }
                }
                return {
                    ...state
                }
            } else {
                return {
                    ...state,
                    id: action.payload.id,
                    user: action.payload,
                    userError: ""
                };
            }
        case REGISTER_USER:
            if ( action.error ) {
                if ( action.error.status === 409 ) {
                    console.log( "Error! No user" )
                    return {
                        ...state,
                        userError: "User already exist"
                    }
                }
                return {
                    ...state,
                    userError: "Something went wrong"
                }
            } else {
                return {
                    ...state,
                    id: action.payload.id,
                    user: action.payload,
                    userError: ""
                };
            }
        default:
            return state;
    }
}
import { 
    GET_DRIVERS, 
    GET_BY_NAME, 
    GET_BY_ID, 
    GET_TEAMS,
    GET_BY_SOURCE, 
    GET_BY_TEAM,
    CLEAR_DETAIL
} from "../Actions/Actions";

let initialState = {
    allDrivers:[], 
    driversCopy:[], 
    createDriver:[], 
    driverDetails: {},
    allTeams:[],
    forenameDrivers: [],
};

function rootReducer(state= initialState, action){
    switch(action.type){

        case GET_DRIVERS:
            return{
                ...state,
                allDrivers:[...action.payload],
                driversCopy: [...action.payload],
            };

        case GET_BY_NAME:
            return{
                ...state,
                allDrivers:[...action.payload],
            };

        case GET_BY_ID:
            return{
                ...state,
                driverDetails:action.payload,
            };

        case GET_TEAMS:
            return{
                ...state,
                allTeams: action.payload,
            };

        case GET_BY_SOURCE:
            return{
                ...state,
                allDrivers:[...action.payload],
                driversCopy: [...action.payload],
            };

        case GET_BY_TEAM:
            return{
                ...state,
                allDrivers:[...action.payload],
                driversCopy: [...action.payload],
            };

        case CLEAR_DETAIL:
        return{
            ...state,
            driverDetails: {},
        };

        default:
            return state
        }
}

export default rootReducer
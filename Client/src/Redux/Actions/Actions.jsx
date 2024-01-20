import axios from "axios"

export const GET_DRIVERS = "GET_DRIVERS"
export const GET_BY_NAME = "GET_BY_NAME"
export const GET_BY_ID = "GET_BY_ID"
export const GET_TEAMS = "GET_TEAMS"
export const GET_BY_SOURCE = "GET_BY_SOURCE"
export const GET_BY_TEAM = "GET_BY_TEAM"
export const GET_FORENAME_DRIVERS = "GET_FORENAME_DRIVERS"
export const CLEAR_DETAIL = "CLEAR_DETAIL"


export function getDrivers(){
    return async function (dispatch){
        try {
            const response = await axios("http://localhost:3001/drivers"); 

            const driversWithCorrectedTeams = response.data.data.map(driver => {
                if (typeof driver.teams === 'string') {
                  driver.teams = driver.teams.split(',').join(', ');
                }
                return driver;
              });

            return dispatch({
                type: "GET_DRIVERS",
                payload: driversWithCorrectedTeams, 
            });
        } catch (error) {
            console.error('Error founding all drivers on front:', error);
            throw error;
        }
    }
}

export function getByName(name){
    return async function (dispatch){
        try {
            const response = await axios(`http://localhost:3001/name?name=${name}`); 
            
            if (response.data.drivers && Array.isArray(response.data.drivers)) {
            return dispatch({
                type: "GET_BY_NAME",
                payload: response.data.drivers, 
            });
        } else {
            console.error('Driver name not found:', response.data);
            return dispatch({
              type: "GET_BY_NAME",
              payload: [],
            });
          }
        } catch (error) {
            console.error('Error founding name driver on front:', error);
            throw error;
        }
    }
}

export function getById(id){
    return async function (dispatch){
        try {
            const response = await axios(` http://localhost:3001/drivers/${id}`); 
            
            if (response.data && Object.keys(response.data).length !== 0) {
            return dispatch({
                type: "GET_BY_ID",
                payload: response.data, 
            });
        } else {
            console.error('Can not read id', response.data);
            return dispatch({
              type: "GET_BY_ID",
              payload: {},
            });
          }
        } catch (error) {
            console.error('Error founding id driver on front:', error);
            throw error;
        }
    }
}

export function getBySource(source){
    return async function (dispatch){
        try {
            const response = await axios("http://localhost:3001/drivers"); 

            let filteredDrivers;
            if (source === 'API') {
                filteredDrivers = response.data.data.filter(driver => typeof driver.id === 'number');
            } else if (source === 'DB') {
                filteredDrivers = response.data.data.filter(driver => driver.created === true);
            } else {
                filteredDrivers = response.data.data;
            }
        
              return dispatch({
                type: "GET_BY_SOURCE",
                payload: filteredDrivers,
              });
            } catch (error) {
              console.error('Error obtaining drivers by source:', error);
              throw error;
            }
          };
        }

    const isUUID = (str) => {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(str);
};

export function clearDetail(){
    return function (dispatch){
    return dispatch({
        type: "CLEAR_DETAIL",
    }
    )
}}

export function getByTeam(team){
    return async function (dispatch){
        try {
            const response = await axios('http://localhost:3001/drivers'); 
            
            if (response.data && Array.isArray(response.data.data)) {
                const drivers = response.data.data;

                const driversByTeam = drivers.filter(driver => {
                    if (typeof driver.teams === 'string') {
                    const driverTeams = driver.teams.split(',').map(team => team.trim());
                    return driverTeams.includes(team);
                } else if (Array.isArray(driver.teams)) {
                    return driver.teams.includes(team);
                  }
                return false;
            });
                
                return dispatch({
                    type: "GET_BY_TEAM",
                    payload: driversByTeam, 
                });
        } else {
            console.error('Invalid data format for drivers');
            
            return dispatch({
                type: "GET_BY_TEAM",
                payload: [],
              });
        }
        } catch (error) {
            console.error('Error founding team driver on front:', error);
            throw error;
        }
    }
}

export function getTeams(){
    return async function (dispatch){
        try {
            const response = await axios("http://localhost:3001/teams"); 

            const teams = response.data.data;
            
            return dispatch({
                type: "GET_TEAMS",
                payload: teams, 
            });
        } catch (error) {
            console.error('Error founding all teams on front:', error);
            throw error;
        }
    }
}

export const createDriver = (driverData) => {
    return async (dispatch) => {
    try {
        const response = await fetch('http://localhost:3001/drivers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(driverData),
          });
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
    
          const data = await response.json();
    
          return data;
    } catch (error) {
        console.error('Error creating driver:', error);
    throw error;
  }
};
}
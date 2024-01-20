const axios = require ("axios");
const fs = require('fs');
const path = require('path');
const sequelize = require ('sequelize')

const { Driver, Team, DriverTeam } = require ("../db");
const CommonStructureToAll = (drivers) => {
  if (!Array.isArray(drivers)) {
    return {
      id: drivers.id || null,
      forename: drivers.forename || drivers.name.forename || null,
      surname: drivers.surname || drivers.name.surname || null,
      teams: drivers.teams || [],
      dob: drivers.dob || null,
      nationality: drivers.nationality || null,
      description: drivers.description || null,
      image: drivers.image?.url || drivers.image || null,
      created: drivers.created !== undefined ? drivers.created : false,
    };
  } else {
    return drivers.map((driver) => {
      return {
        id: driver.id || null,
        forename: driver.forename || driver.name.forename || null,
        surname: driver.surname || driver.name.surname || null,
        teams: driver.teams || [],
        dob: driver.dob || null,
        nationality: driver.nationality || null,
        description: driver.description || null,
        image: driver.image?.url || driver.image || null,
        created: driver.created !== undefined ? driver.created : false,
      };
    });
  }
};

//Entrega todos los Drivers y estructura los datos
const convertTeamsToMap = async () => {
  const teamsResponse = await axios.get('http://localhost:3001/teams');
  const teamsData = teamsResponse.data.data;
  
  const teamsMap = {};
  teamsData.forEach(team => {
    teamsMap[team.id] = team.name;
  });

  return teamsMap;
};

const AllDrivers = async () => {
  const driverTeamRelation = await axios.get('http://localhost:3001/relation');
  const relationData = driverTeamRelation.data;

  const teamsMap = await convertTeamsToMap();

  const infoDB = await Driver.findAll({
    include: [{ model: Team }],
  });

  const driversDB = CommonStructureToAll(infoDB).map(driver => {
    const associatedTeams = relationData
      .filter(relation => relation.DriverId === driver.id)
      .map(relation => relation.TeamId);

    const teams = associatedTeams.map(teamId => teamsMap[teamId]).join(', ');

    return {
      ...driver,
      teams,
    };
  });
    const infoAPI = (await axios.get ("http://localhost:5000/drivers")).data;
    const driversAPI = CommonStructureToAll (infoAPI).map(driver => {
      if (typeof driver.teams === 'string') {
        driver.teams = driver.teams.split(',').join(', ');
      }
      return driver;
  });
    
    return [...driversDB, ...driversAPI]
}

//Busca Driver en DB y API según ID
const DriverById = async (id, source) =>{
    console.log(`Looking for driver ID ${id} on ${source}`);
    let driverFromId;

  if (source === 'api') {
    const response = await axios.get(`http://localhost:5000/drivers/${id}`);
    driverFromId = response.data;
  } else {
    driverFromId = await Driver.findByPk(id, { include: Team });
  }

    console.log('Founded driver: ', driverFromId);
    if (source === 'api') {
      return CommonStructureToAll(driverFromId);
    } else {
      const teams = driverFromId.Teams.map(team => team.name).join(', ');
      const driverWithTeams = {
        ...driverFromId.toJSON(),
        teams,
      };
  
      return CommonStructureToAll(driverWithTeams);
    }
  };

//Busca Driver en DB y API según primer nombre
const DriverByName = async (forename) => {
  const DBdrivers = await Driver.findAll({
    where: sequelize.where(sequelize.fn('lower', sequelize.col('forename')), sequelize.fn('lower', forename)),
    include: Team,
  });

  const capsQuery = (forename.charAt(0).toUpperCase() + forename.slice(1).toLowerCase());
  const APIdrivers = (await axios.get(`http://localhost:5000/drivers?name.forename=${capsQuery}`)).data;

  const combinedDrivers = [...DBdrivers, ...APIdrivers];
  const uniqueDrivers = combinedDrivers.filter((driver, index, self) =>
    index === self.findIndex((d) => (d.id === driver.id)));

  const limitedDrivers = uniqueDrivers.slice(0, 15);

  const teamsRelation = (await axios.get('http://localhost:3001/relation')).data;

  const teamsDataResponse = await axios.get('http://localhost:3001/teams');
  const teamsData = teamsDataResponse.data.data;

  const formattedDrivers = limitedDrivers.map(driver => {
    let associatedTeams = '';
    const associatedTeamsIds = teamsRelation
      .filter(relation => relation.DriverId === driver.id)
      .map(relation => relation.TeamId);

    associatedTeams = associatedTeamsIds.map(teamId => {
      const foundTeam = teamsData.find(team => team.id === teamId);
      return foundTeam ? foundTeam.name : null;
    }).filter(Boolean).join(', ');

    const driverFromAPI = APIdrivers.find(apiDriver => apiDriver.id === driver.id);
    const forenameFromAPI = driverFromAPI ? driverFromAPI.name.forename : null;
    const surnameFromAPI = driverFromAPI && driverFromAPI.name ? driverFromAPI.name.surname : null;
    const idFromAPI = driverFromAPI ? driverFromAPI.id : null;

    return {
      ...driver,
      forename: forenameFromAPI || driver.forename, 
      surname: surnameFromAPI || driver.surname,
      id: idFromAPI || driver.id,
      teams: associatedTeams,
    };
  });
  return CommonStructureToAll(formattedDrivers);
};

//Ubicación, mapeo y formateo de teams
const AllTeamsFromAPI = async () => {
  const filePath = path.join(__dirname, '..', '..', 'api', 'db.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(data);
  
  if (!jsonData || !jsonData.drivers) {
    throw new Error('Unable to retrieve information from the API');
  }
  
  const drivers = jsonData.drivers;
  
  console.log('Looking for Teams in API...');
  let teamsArray = [];
  
  drivers.forEach(driver => {
    if (typeof driver.teams === 'string') {
      const teams = driver.teams.split(',').map(team => team.trim());
      teamsArray = teamsArray.concat(teams);
    }
  });

  const uniqueTeams = [...new Set(teamsArray)];
  const sortedTeams = uniqueTeams.sort();
  
  console.log('Teams found: ', sortedTeams);
  console.log(`There are ${sortedTeams.length} teams in total.`);
  
  const existingTeams = await Team.findAll();

  if (existingTeams.length === 0) {
    throw new Error('No teams found in the database');
  }

  console.log('Teams found in database: ', existingTeams);

  return existingTeams;
};

//Guardado de teams en DB
const saveTeamsToDatabase = async (teams) => {

    const existingTeams = await Team.findAll();
    
    if (existingTeams.length === 0) {
      await Team.bulkCreate(teams.map(team => ({ name: team.name })));
      console.log('Teams saved to database successfully');
    } else {
      console.log('Existing Teams:', existingTeams);

      const existingTeamNames = existingTeams.map(team => team.name);
      console.log('Existing Team Names:', existingTeamNames);

      const newTeamNames = teams.map(team => team.name);
      console.log('New Team Names:', newTeamNames);

      const missingTeams = newTeamNames.filter(name => !existingTeamNames.includes(name));
      missingTeams.sort();

      console.log('Missing Teams:', missingTeams);

      if (missingTeams.length > 0) {
        const teamsToCreate = missingTeams.map(name => ({ name}));
        console.log('Teams to Create:', teamsToCreate);

        await Team.bulkCreate(teamsToCreate);
        console.log('Missing teams saved to database successfully');
      }
    }
};

//Relación Driver-Team y Creación de Driver en DB
const createDriverDB = async (driverData) => {
  
  const {
      forename,
      surname,
      teams,
      dob,
      nationality,
      description,
      image
    } = driverData;
    
    const existingDriverDB = await Driver.findOne({ where: { forename, surname } });

    if (existingDriverDB) {
            throw new Error('Driver already exists in the database');
        }
        
    const apiCheckUrl = ` http://localhost:3001/name?name=${forename}&surname=${surname}`;
    const apiResponse = await axios.get(apiCheckUrl);
    
    if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data.drivers)) {
      const foundDriver = apiResponse.data.drivers.find(driver => {
            const formattedForename = driver.forename.toLowerCase().trim();
            const formattedSurname = driver.surname.toLowerCase().trim();
            const inputForename = forename.toLowerCase().trim();
            const inputSurname = surname.toLowerCase().trim();
            
            return formattedForename === inputForename && formattedSurname === inputSurname;
          });
          
          if (foundDriver) {
            throw new Error('Driver already exists in the external API');
        } else {
    const newDriver = await Driver.create({
      forename,
      surname,
      dob,
      nationality,
      description,
      image
    });
    
    const teamsArray = teams.split(',').map(team => team.trim());
    const teamInstances = await Promise.all(teamsArray.map(teamName => Team.findOne({ where: { name: teamName } })));
    const teamIds = teamInstances.map(team => team.id);

    await newDriver.addTeams(teamIds);

    const associatedTeams = await newDriver.getTeams();
    const teamNames = associatedTeams.map(team => team.name);

    const savedDriver = await newDriver.save();
    return { ...savedDriver.toJSON(), teams: teamNames };
  }
}
};

//Lectura de Driver-Team 
const getRelation = async (req, res, next) => {
  try {
    const relations = await DriverTeam.findAll({ 
      attributes: ['DriverId', 'TeamId'],
    });
    res.json(relations); 
  } catch (error) {
    next(error); 
  }
};

module.exports={
    AllDrivers,
    DriverById,
    DriverByName,
    AllTeamsFromAPI,
    saveTeamsToDatabase,
    createDriverDB,
    getRelation
  };
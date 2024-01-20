const {
    AllDrivers,
    DriverById, 
    DriverByName, 
    createDriverDB, 
    AllTeamsFromAPI,
    saveTeamsToDatabase
} = require ("../controllers/driverControllers");

//Entrega TODOS los drivers y maneja errores
const getDriversHandler = async (req,res) =>{
    console.log('Searching drivers...');

    try {
        const drivers = await AllDrivers()
        
          res.status(200).json({
            msg: 'Founded drivers',
            data: drivers   
          });

    } catch (error) {
        console.error('Error while fetching drivers:', error);
        res.status(500).json({error:error.message});
    }
    console.log('Finding drivers and returned...');
};

//Busca Driver según ID y maneja de errores
const getIdHandler = async (req,res) =>{
    const {id} = req.params;
    const source = isNaN(id) ? "db" : "api";
    try {
        const detailDriver = await DriverById(id,source)
        res.status(200).json({
            msg: `Detail from the id: ${id}`,
            data: detailDriver
        });
    } catch (error) {
        console.error('Error while fetching driver details:', error);
        res.status(500).json({error:error.message});
    }
};

//Busca Driver en DB y API según primer nombre con manejo de errores
const getNameHandler = async (req,res) =>{
    console.log('Searching drivers...');
    const {name} = req.query;
    try {
        let drivers;
        if (name){
            drivers = await DriverByName(name)
            res.status(200).json({
              msg: 'Founded drivers',
              drivers
            });

        } else{
        res.status(404).json({
            msg: `No drivers found with name: ${forename}`,
            data: [] 
        }) 
      }
     } catch (error) {
        console.error('Error while fetching drivers:', error);
        res.status(500).json({error:error.message});
    }
    console.log('Finding drivers and returned...');
};

//Creación de Driver en DB con manejo de errores
const createDriverHandler = async (req,res) =>{
    console.log('Request for driver creation');
    const {forename, surname, description, image, nationality, dob, teams} = req.body;
    try{
        const newDriverData = {
            forename,
            surname,
            description,
            image,
            nationality,
            dob,
            teams
        };
        const newDriver = await createDriverDB(newDriverData);
        res.status(200).json({
            msg: `${forename} ${surname} was created as a new driver`,
            data: newDriver
        });
    } catch (error){
        console.error('Error while creating driver:', error);
        res.status(500).json({error:error.message});
    }
    console.log('Driver created successfully');
};

//Creación de Teams en DB con manejo de errores
const getTeamsHandler = async (req, res) => {
  try {
    const teamsFromAPI = await AllTeamsFromAPI();

    await saveTeamsToDatabase(teamsFromAPI);

    res.status(200).json({
      msg: 'Teams fetched from API and saved to database',
      data: teamsFromAPI,
    });
  } catch (error) {
    console.error('Error while fetching or saving teams:', error);
    res.status(500).json({ error: 'Failed to fetch or save teams' });
  }
};

module.exports={
    getDriversHandler,
    getIdHandler,
    getNameHandler,
    createDriverHandler,
    getTeamsHandler
}
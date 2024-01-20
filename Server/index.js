require('dotenv').config();

const server = require("./src/server");
const { conn } = require('./src/db.js');

const PORT = process.env.PORT;

(async () => {
  try {
    await conn.sync({ force: false })
  console.log('Connected to the database');

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.error('Error connecting to the database: ', error);
  process.exit(1);
}
})();

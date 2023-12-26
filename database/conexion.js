const mysql = require('mysql2'); // o 'mysql' si prefieres

/*
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'cholon'
});
*/

const pool = mysql.createPool({
  host: 'bflolatg26vnltushcor-mysql.services.clever-cloud.com',
  user: 'ubyrfgevexfh8ehj',
  password: 'fsHd5lPmnvsQa63o8SmD',
  port: 3306,
  database: 'bflolatg26vnltushcor'
});

// Exporta el pool para que pueda ser utilizado desde otros módulos
module.exports = pool;
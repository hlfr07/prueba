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
  host: 'bfncbsukldeaquuuktbf-mysql.services.clever-cloud.com',
  user: 'ubvkgh4bibh2rvnx',
  password: 'icBjIC74iTMTQfk6roqn',
  port: 3306,
  database: 'bfncbsukldeaquuuktbf'
});

// Exporta el pool para que pueda ser utilizado desde otros módulos
module.exports = pool;
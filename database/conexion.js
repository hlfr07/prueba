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
  host: 'bv1n9vnt5nxgenj8fftd-mysql.services.clever-cloud.com',
  user: 'ueb1ypkbsh1uxsi6',
  password: 'KZdGMgmcf2pXgJGasLwU',
  port: 3306,
  database: 'bv1n9vnt5nxgenj8fftd'
});



// Exporta el pool para que pueda ser utilizado desde otros módulos
module.exports = pool;
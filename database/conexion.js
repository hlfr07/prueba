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
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'BHWHZcuxqwCWnlhWuNAYTqNSfEmfojII',
  port: 53238,
  database: 'cholon'
});



// Exporta el pool para que pueda ser utilizado desde otros módulos
module.exports = pool;
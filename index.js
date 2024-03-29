const express = require('express');
const pool = require('./database/conexion');
const app = express();
const cors = require("cors");
const path = require('path');

// Aplicar el middleware CORS a todas las rutas
app.use(cors());
// Configurar middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));
/*----------------------------------------------------------------------------------------------------------------*/
app.use(express.json());
// ACA PONES EL MOTOR O FORMATO DEL HTML QUE VAS A USAR EJS SERIA EL MAS COMUN
app.set('view engine', 'ejs');

// ACA VAS A PONER DE DONDE VA BUSCAR EL HTML O EL EJS MAS DICHO AHI TE DEJO
app.set('views', path.join(__dirname, 'src', 'views'));

// Configurar tipos MIME para archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'text/javascript');
      }
      // Agregar más tipos MIME según sea necesario para otros tipos de archivos
    }
  }));

/*----------------------------------------------------------------------------------------------------------------*/

app.use('/src', express.static('src'))
app.use(express.static(path.join(__dirname, 'src'), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'text/javascript');
      }
      // Agregar más tipos MIME según sea necesario para otros tipos de archivos
    }
  }));


//PARA PODER AGARRAR DATS DEL FORMULARIO LOGIN
app.use(express.urlencoded({ extended: true }));

// RUTAS EN GENERAL SON ESTO
const rutas = require('./src/routes/rutas');
app.use(rutas);

// PRUEBA DE LA CONEXION A LA BASE DE DATOS MYSQL
pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    } else {
        console.log('Conexión a la base de datos de MySQL con éxito!');
    }
});

app.listen(3000, () => {
    console.log('El servidor está corriendo en el puerto 3000 ---> http://localhost:3000/');
});

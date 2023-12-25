
const pool = require("../../../database/conexion")
const vistagalpon = async (req, res) => {
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
  // Consulta SQL para obtener perfiles
  const sqlActivo = `SELECT *
  FROM galpon
  WHERE estadogalpon = 1;
  `
// Consulta SQL para obtener pisos inactivos (estado_piso=0)
const sqlInactivo = `SELECT *
FROM galpon
WHERE estadogalpon = 0;`;

  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [galpon, galponInactivos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlInactivo),
    ]);

    console.log("Galpon Activos:", galpon[0]);
    console.log("Galpon Inactivos:", galponInactivos[0]);
 

    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/lotes/galpon", {
      galpon: galpon[0],
      galponInactivos: galponInactivos[0], nombre: nombre,
      perfil: perfil 
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};
const regisgalpon = async (req, res) => {
  try {
    const { nombregalpon,disponibilidad } = req.body;
    const estadogalpon = 1;


    // Inserta el usuario y la contraseña en la base de datos
    pool.query(
      "INSERT INTO galpon (nombregalpon,estadogalpon,disponibilidad ) VALUES (?,?,?)",
      [nombregalpon,estadogalpon,disponibilidad],
      (error, results) => {
        if (error) {
          console.error("Error al registrar el usuario:", error);
          res.status(500).json({ message: "Error al registrar el usuario" });
        } else {
          console.log("Usuario registrado correctamente");
          res.status(200).json({ message: "Usuario registrado correctamente" });
        }
      }
    );
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    res.status(500).json({ message: "Error en el registro de usuario" });
  }
};

const vistagalponid = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idgalpon = req.params.id;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'SELECT * FROM galpon WHERE idgalpon = ?';
  
  // Ejecuta la consulta SQL
  pool.query(sql, [idgalpon], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }
    console.log(results);
    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Galpon no encontrado' });
      return;
    }

    // Envía los resultados en formato JSON
    res.json(results[0]);
  });
};

const updategalponPUT = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idgalponobtenido = req.params.id;
  const { nombregalpon1} = req.body;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE galpon SET nombregalpon=?, estadogalpon = 1 WHERE idgalpon = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [nombregalpon1,idgalponobtenido], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Galpon no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Categoria actualizado con éxito' });

  });
};


const deletegalpon = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idgalpon = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE galpon SET estadogalpon = 0 WHERE idgalpon = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idgalpon], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });

 
  });
};
const actgalpon = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idgalpon = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE galpon SET estadogalpon = 1 WHERE idgalpon = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idgalpon], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.affectedRows > 0) {
      res.status(200).json({ mensaje: 'Usuario restablecido con éxito' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado o no se realizó ninguna actualización' });
    }


  });
};


module.exports = { vistagalpon, regisgalpon,vistagalponid,updategalponPUT, deletegalpon, actgalpon };
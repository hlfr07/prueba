
const pool = require("../../../database/conexion")
const vistaunidad = async (req, res) => {
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
  // Consulta SQL para obtener perfiles
  const sqlActivo = `SELECT *
  FROM  unidad
  WHERE estado_unidad = 1;
  `
// Consulta SQL para obtener pisos inactivos (estado_piso=0)
const sqlInactivo = `SELECT *
FROM unidad
WHERE estado_unidad = 0;`;

  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [unidad, unidadInactivos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlInactivo),
    ]);

    console.log("Unidad Activos:", unidad[0]);
    console.log("Unidad Inactivos:", unidadInactivos[0]);
 

    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/almacen/unidad", {
      unidad:unidad[0],
      unidadInactivos: unidadInactivos[0],
      nombre: nombre,
      perfil: perfil
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};

const regisunidad = async (req, res) => {
  try {
    const { nombre_unidad } = req.body;
    const estado_unidad = 1;


    // Inserta el usuario y la contraseña en la base de datos
    pool.query(
      "INSERT INTO unidad (nombre_unidad,estado_unidad ) VALUES (?,?)",
      [nombre_unidad,estado_unidad],
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

const vistaunidadid = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idunidad = req.params.id;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'SELECT * FROM unidad WHERE idunidad = ?';
  
  // Ejecuta la consulta SQL
  pool.query(sql, [idunidad], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }
    console.log(results);
    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Categoria no encontrado' });
      return;
    }

    // Envía los resultados en formato JSON
    res.json(results[0]);
  });
};

const updateunidadPUT = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idunidadobtenido = req.params.id;
  const { nombre_unidad1} = req.body;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE unidad SET nombre_unidad=?, estado_unidad = 1 WHERE idunidad = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [nombre_unidad1,idunidadobtenido], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Categoria no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Categoria actualizado con éxito' });

  });
};


const deleteunidad = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idunidad = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE unidad SET estado_unidad = 0 WHERE idunidad = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idunidad], (err, results) => {
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
const actunidad = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idunidad = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE unidad SET estado_unidad = 1 WHERE idunidad = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idunidad], (err, results) => {
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


module.exports = { vistaunidad, regisunidad,vistaunidadid,updateunidadPUT, deleteunidad , actunidad};
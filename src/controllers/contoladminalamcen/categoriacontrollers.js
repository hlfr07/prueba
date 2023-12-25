
const pool = require("../../../database/conexion")
const vistacategoria = async (req, res) => {
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
  // Consulta SQL para obtener perfiles
  const sqlActivo = `SELECT *
  FROM categoria
  WHERE estado_categoria = 1;
  `
// Consulta SQL para obtener pisos inactivos (estado_piso=0)
const sqlInactivo = `SELECT *
FROM categoria
WHERE estado_categoria = 0;`;

  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [categoria, categoriaInactivos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlInactivo),
    ]);

    console.log("Galpon Activos:", categoria[0]);
    console.log("Galpon Inactivos:", categoriaInactivos[0]);
 

    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/almacen/categoria", {
      categoria:categoria[0],
      categoriaInactivos: categoriaInactivos[0],
      nombre: nombre,
      perfil: perfil

    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};
const regiscategoria = async (req, res) => {
  try {
    const { nombre_categoria } = req.body;
    const estado_categoria = 1;


    // Inserta el usuario y la contraseña en la base de datos
    pool.query(
      "INSERT INTO categoria (nombre_categoria,estado_categoria ) VALUES (?,?)",
      [nombre_categoria,estado_categoria],
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

const vistacategoriaid = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcategoria = req.params.id;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'SELECT * FROM categoria WHERE idcategoria = ?';
  
  // Ejecuta la consulta SQL
  pool.query(sql, [idcategoria], (err, results) => {
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

const updatecategoriaPUT = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcategoriaobtenido = req.params.id;
  const { nombre_categoria1} = req.body;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE categoria SET nombre_categoria=?, estado_categoria = 1 WHERE idcategoria = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [nombre_categoria1,idcategoriaobtenido], (err, results) => {
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


const deletecategoria = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcategoria = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE categoria SET estado_categoria = 0 WHERE idcategoria = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idcategoria], (err, results) => {
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
const actcategoria = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcategoria = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE categoria SET estado_categoria = 1 WHERE idcategoria = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idcategoria], (err, results) => {
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


module.exports = { vistacategoria, regiscategoria,vistacategoriaid,updatecategoriaPUT, deletecategoria, actcategoria };
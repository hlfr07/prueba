
const pool = require("../../../database/conexion")


const vistasegusuarios = async (req, res) => {
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
  // Consulta SQL para obtener pisos activos (estado_piso=1)
  const sqlActivo = `SELECT usuario.idusuario, usuario.dni, usuario.nombre, usuario.correo, usuario.password, perfil.perfil, usuario.estado
  FROM usuario
  JOIN perfil ON usuario.idperfil = perfil.idperfil
  WHERE usuario.estado = 1;
  `;

  // Consulta SQL para obtener pisos inactivos (estado_piso=0)
  const sqlInactivo = `SELECT usuario.idusuario, usuario.dni, usuario.nombre, usuario.correo, usuario.password, perfil.perfil, usuario.estado
  FROM usuario
  JOIN perfil ON usuario.idperfil = perfil.idperfil
  WHERE usuario.estado = 0;
  `;

  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [usuario, usuarioInactivos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlInactivo),
    ]);

    console.log('Pisos Activos:', usuario[0]);
    console.log('Pisos Inactivos:', usuarioInactivos[0]);
    console.log("idusuariologueado:", nombre);
    console.log("idusuariologueado",perfil);


    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render('vistaadmin/seguridad/segusuario', { usuario: usuario[0], usuarioInactivos: usuarioInactivos[0],  nombre: nombre,
      perfil: perfil });
  } catch (err) {
    console.error('Error al ejecutar las consultas SQL:', err);
    res.status(500).send('Error en las consultas SQL');
  }
};

  

  const vistausuariosid = async (req, res) => {
    // Obtén el ID del perfil de los parámetros de la URL
    const idusuario = req.params.id;
  
    // Consulta SQL para obtener un perfil por su ID
    const sql = 'SELECT * FROM usuario WHERE idusuario = ?';
  
    // Ejecuta la consulta SQL
    pool.query(sql, [idusuario], (err, results) => {
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
  
      // Envía los resultados en formato JSON
      res.json(results[0]);
    });
  };


  const updateusuariosPUT = async (req, res) => {
    // Obtén el ID del perfil de los parámetros de la URL
    const idusuario = req.params.id;
    const { dni,nombre,correo,idperfil } = req.body;
  
    // Consulta SQL para obtener un perfil por su ID
    const sql = 'UPDATE usuario SET dni=?, nombre = ?, correo=?, idperfil=?, estado = 1 WHERE idusuario = ?';
  
    // Ejecuta la consulta SQL
    pool.query(sql, [dni,nombre,correo,idperfil,idusuario], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta SQL:', err);
        res.status(500).json({ error: 'Error en la consulta SQL' });
        return;
      }
      //comprueba si no se repite el dni
      // Comprueba si se encontró un perfil con el ID proporcionado
      if (results.length === 0) {
        res.status(400).json({ error: 'Perfil no encontrado' });
        return;
      }

  
      res.status(200).json({ mensaje: 'Perfil actualizado con éxito' });
  
   
    });
  };


  const deleteUsuarios = async (req, res) => {
    // Obtén el ID del perfil de los parámetros de la URL
    const idusuario = req.params.id;
  
  
    // Consulta SQL para obtener un perfil por su ID
    const sql = 'UPDATE usuario SET estado = 0 WHERE idusuario = ?';
  
    // Ejecuta la consulta SQL
    pool.query(sql, [idusuario], (err, results) => {
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
  

  const actusuario = async (req, res) => {
    // Obtén el ID del perfil de los parámetros de la URL
    const idusuario = req.params.id;
  
  
    // Consulta SQL para obtener un perfil por su ID
    const sql = 'UPDATE usuario SET estado = 1 WHERE idusuario = ?';
  
    // Ejecuta la consulta SQL
    pool.query(sql, [idusuario], (err, results) => {
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
  
 
  module.exports = { vistasegusuarios,vistausuariosid,updateusuariosPUT,deleteUsuarios,actusuario };
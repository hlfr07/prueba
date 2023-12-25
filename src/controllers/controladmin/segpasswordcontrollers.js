const pool = require("../../../database/conexion")
const bcrypt=require("bcryptjs");
const vistasegpasword = async (req, res) => {
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
     // Consulta SQL para obtener perfiles
  const sql = `SELECT usuario.*, perfil.perfil
FROM usuario
INNER JOIN perfil ON usuario.idperfil = perfil.idperfil
WHERE usuario.estado=1;
`;

  // Ejecuta la consulta SQL
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).send('Error en la consulta SQL');
      return;
    }
    console.log(results);

    // Envía los resultados de la consulta a la vista
    res.render('vistaadmin/seguridad/segrecuperapassword', { segrecuperapassword: results , nombre: nombre,
      perfil: perfil  });
  });
  };

  const vistapasswordid = async (req, res) => {
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

  const updatepasswordPUT = async (req, res) => {
    
    // Obtén el ID del perfil de los parámetros de la URL
    const idusuario = req.params.id;
    const { correo,password } = req.body;
    // Encripta la contraseña
    const passwordEncryptado = await bcrypt.hash(password, 10);
  
    // Consulta SQL para obtener un perfil por su ID
    const sql = 'UPDATE usuario SET correo=?, password=?, estado = 1 WHERE idusuario = ?';
  
    // Ejecuta la consulta SQL
    pool.query(sql, [correo,passwordEncryptado,idusuario], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta SQL:', err);
        res.status(500).json({ error: 'Error en la consulta SQL' });
        return;
      }
  
      // Comprueba si se encontró un perfil con el ID proporcionado
      if (results.length === 0) {
        res.status(404).json({ error: 'Perfil no encontrado' });
        return;
      }
  
      res.status(200).json({ mensaje: 'Perfil actualizado con éxito' });
  
   
    });
  };


  module.exports = { vistasegpasword, vistapasswordid,updatepasswordPUT };
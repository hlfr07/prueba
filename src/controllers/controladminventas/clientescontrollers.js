const pool = require("../../../database/conexion")
const vistaclientes = async (req, res) => {
  // Consulta SQL para obtener pisos activos (estado_piso=1)
  const sqlActivo = `
  SELECT *
  FROM cliente
  WHERE estadocliente = 1;`;

  // Consulta SQL para obtener pisos inactivos (estado_piso=0)
  const sqlInactivo = `SELECT *
  FROM cliente
  WHERE estadocliente = 0;`;

  
  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [clientes, clientesInactivos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlInactivo),
    ]);

    console.log("Habitacion Activos:", clientes[0]);
    console.log("Habitacion Inactivos:", clientesInactivos[0]);
 

    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/ventas/clientes", {
      clientes: clientes[0],
      clientesInactivos: clientesInactivos[0],
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};

const regisclientes = async (req, res) => {
  try {
    const { ruc, dni, nombre, razonsocial, telefono,direccion } = req.body;
    const estadocliente = 1;


    // Inserta el usuario y la contraseña en la base de datos
    pool.query(
      "INSERT INTO cliente (ruc,dni,nombre,razonsocial,telefono,direccion,estadocliente ) VALUES (?,?,?,?,?,?,?)",
      [ruc, dni, nombre, razonsocial, telefono,direccion,estadocliente],
      (error, results) => {
        if (error) {
          console.error("Error al registrar el Cliente:", error);
          res.status(500).json({ message: "Error al registrar el Cliente" });
        } else {
          console.log("Cliente registrado correctamente");
          res.status(200).json({ message: "Cliente registrado correctamente" });
        }
      }
    );
  } catch (error) {
    console.error("Error en el registro de Cliente:", error);
    res.status(500).json({ message: "Error en el registro de Cliente" });
  }
};

const vistaclientesid = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcliente = req.params.id;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'SELECT * FROM cliente WHERE idcliente = ?';
  
  // Ejecuta la consulta SQL
  pool.query(sql, [idcliente], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }
    console.log(results);
    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    // Envía los resultados en formato JSON
    res.json(results[0]);
  });
};

const updateclientesPUT = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idclienteobtenido = req.params.id;
  const { ruc1,dni1,nombre1,razonsocial1,telefono1,direccion1 } = req.body;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE cliente SET ruc=?, dni = ?, nombre=?, razonsocial=?, telefono=?, direccion=?, estadocliente = 1 WHERE idcliente = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [ ruc1,dni1,nombre1,razonsocial1,telefono1,direccion1,idclienteobtenido], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Cliente actualizado con éxito' });

  });
};


const deleteclientes = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcliente = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE cliente SET estadocliente = 0 WHERE idcliente = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idcliente], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Cliente eliminado con éxito' });

 
  });
};
const actclientes = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcliente = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE cliente SET estadocliente = 1 WHERE idcliente = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idcliente], (err, results) => {
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

module.exports = { vistaclientes, regisclientes,vistaclientesid,updateclientesPUT, deleteclientes, actclientes };
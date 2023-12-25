const pool = require("../../../database/conexion")
const vistacontrolgalpon = async (req, res) => {
  // Consulta SQL para obtener pisos activos (estado_piso=1)
  const sqlActivo = `
  SELECT 
  controlgalpon.idcontrolgalpon,
  galpon.nombregalpon,
  almacen.cantidad,
  controlgalpon.cantidadpollo,
  controlgalpon.fechallegada ,
  controlgalpon.estadocontrolgalpon
FROM controlgalpon
JOIN galpon ON controlgalpon.idgalpon = galpon.idgalpon
JOIN almacen ON controlgalpon.idalmacen = almacen.idalmacen
WHERE controlgalpon.estadocontrolgalpon = 1;
`;

  // Consulta SQL para obtener pisos inactivos (estado_piso=0)
  const sqlInactivo = `
  SELECT 
  controlgalpon.idcontrolgalpon,
  galpon.nombregalpon,
  almacen.cantidad,
  controlgalpon.cantidadpollo,
  controlgalpon.fechallegada ,
  controlgalpon.estadocontrolgalpon
FROM controlgalpon
JOIN galpon ON controlgalpon.idgalpon = galpon.idgalpon
JOIN almacen ON controlgalpon.idalmacen = almacen.idalmacen
WHERE controlgalpon.estadocontrolgalpon = 0;
`;
// Consulta SQL para obtener categorias 
const sqlGalpon = `
SELECT * FROM  galpon

WHERE estadogalpon = 1;
`;
// Consulta SQL para obtener unidad 
const sqlAlmacen = `
SELECT * FROM  almacen

WHERE estadoalmacen = 1;
`;
  
  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [controlgalpon, controlgalponInactivos,galpon,almacen] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlInactivo),
      pool.promise().query(sqlGalpon),
      pool.promise().query(sqlAlmacen),
    ]);

    console.log("controlgalpon Activos:", controlgalpon[0]);
    console.log("controlgalpon Inactivos:", controlgalponInactivos[0]);
    console.log("Galpon:", galpon[0]);
    console.log("Almacen:", almacen[0]);

    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/lotes/controlgalpon", {
        controlgalpon: controlgalpon[0],
        controlgalponInactivos: controlgalponInactivos[0],
      galpon: galpon[0],
      almacen: almacen[0],
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};

const regiscontrolgalpon = async (req, res) => {
  try {
    const { idgalpon, idalmacen, cantidadpollo,fechallegada } = req.body;
    const estadocontrolgalpon = 1;


    // Inserta el usuario y la contraseña en la base de datos
    pool.query(
      "INSERT INTO controlgalpon (idgalpon, idalmacen, cantidadpollo,fechallegada,estadocontrolgalpon ) VALUES (?,?,?,?,?)",
      [idgalpon, idalmacen,cantidadpollo,fechallegada, estadocontrolgalpon],
      (error, results) => {
        if (error) {
          console.error("Error al registrar Productos:", error);
          res.status(500).json({ message: "Error al registrar Lotes" });
        } else {
          console.log("Lotes registrado correctamente");
          res.status(200).json({ message: "Lotes registrado correctamente" });
        }
      }
    );
  } catch (error) {
    console.error("Error en el registro de Lotes:", error);
    res.status(500).json({ message: "Error en el registro de Lotes" });
  }
};

const vistacontrolgalponid = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcontrolgalpon = req.params.id;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'SELECT * FROM controlgalpon WHERE idcontrolgalpon = ?';
  
  // Ejecuta la consulta SQL
  pool.query(sql, [idcontrolgalpon], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }
    console.log(results);
    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Lotes no encontrado' });
      return;
    }

    // Envía los resultados en formato JSON
    res.json(results[0]);
  });
};

const updatecontrolgalponPUT = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcontrolgalponobtenido = req.params.id;
  const { idgalpon1, idalmacen1, cantidadpollo1,fechallegada1 } = req.body;

  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE controlgalpon SET idgalpon = ?, idalmacen = ?, cantidadpollo = ?, fechallegada = ?, estadocontrolgalpon = 1 WHERE idcontrolgalpon = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [ idgalpon1, idalmacen1, cantidadpollo1,fechallegada1, idcontrolgalponobtenido], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Lotes no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Lotes actualizado con éxito' });

  });
};


const deletecontrolgalpon = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcontrolgalpon = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE controlgalpon SET estadocontrolgalpon = 0 WHERE idcontrolgalpon = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idcontrolgalpon], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.status(200).json({ mensaje: 'Producto eliminado con éxito' });

 
  });
};
const actcontrolgalpon = async (req, res) => {
  // Obtén el ID del perfil de los parámetros de la URL
  const idcontrolgalpon = req.params.id;


  // Consulta SQL para obtener un perfil por su ID
  const sql = 'UPDATE productos SET estado_producto = 1 WHERE idproducto = ?';

  // Ejecuta la consulta SQL
  pool.query(sql, [idcontrolgalpon], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      res.status(500).json({ error: 'Error en la consulta SQL' });
      return;
    }

    // Comprueba si se encontró un perfil con el ID proporcionado
    if (results.affectedRows > 0) {
      res.status(200).json({ mensaje: 'Producto restablecido con éxito' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado o no se realizó ninguna actualización' });
    }


  });
};

module.exports = { vistacontrolgalpon, regiscontrolgalpon,vistacontrolgalponid,updatecontrolgalponPUT, deletecontrolgalpon, actcontrolgalpon };
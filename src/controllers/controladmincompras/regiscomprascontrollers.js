const pool = require("../../../database/conexion");

const vistaregiscompras = async (req, res) => {
  const idusuario = req.session.user.idusuario;
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
  // Consulta SQL para obtener pisos activos (estado_piso=1)
  const sqlActivo = `
SELECT
proveedor.idproveedor,
proveedor.nombre_empresa,
proveedor.ruc,
proveedor.direccion,
proveedor.ciudad,
proveedor.pais,
proveedor.telefono,
proveedor.email,
proveedor.idcategoria,
categoria.nombre_categoria
FROM proveedor
JOIN categoria ON proveedor.idcategoria = categoria.idcategoria
WHERE proveedor.estado_proveedor = 1;
`;

  // Consulta SQL para obtener tipos de habitacion
  const sqlproductos = `SELECT
  productos.idproducto,
  productos.codigo_producto,
  productos.nombre_producto,
  categoria.nombre_categoria,
  unidad.nombre_unidad,
  productos.descripcion,
  productos.stock
  FROM productos
  JOIN categoria ON productos.idcategoria = categoria.idcategoria
  JOIN unidad ON productos.idunidad = unidad.idunidad
  WHERE estado_producto = 1;
`;

  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [proveedores, productos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlproductos),
    ]);

    console.log("Proveedores Activos:", proveedores[0]);
    console.log("Tipo:", productos[0]);
    console.log("idusuariologueado:", idusuario);
    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/compras/regiscompras", {
      proveedores: proveedores[0],
      productos: productos[0],
      idusuario: idusuario,
      nombre: nombre,
      perfil: perfil,
    
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};



const sumarcantidades = async (req, res) => {
  try {
    const { productos } = req.body;

    // Verifica si productos es un objeto y no un array
    if (!Array.isArray(productos)) {
      throw new Error("Productos no es un array iterable");
    }

    // Inserta los productos en la tabla "detalle_compra" utilizando el ID de compra
    const insertDetalleCompraQuery = `
      UPDATE productos SET stock = stock + ? WHERE idproducto = ?
    `;

    // Recorre la lista de productos y realiza la inserción en la base de datos
    for (const producto of productos) {
      await pool
        .promise()
        .execute(insertDetalleCompraQuery, [
          producto.cantidad,
          producto.idproducto,
        ]);
    }

    // Envía una respuesta exitosa
    res.json({ success: true });
  } catch (error) {
    console.error("Error al insertar los productos:", error);
    res.status(500).json({ error: "Error al insertar los productos" });
  }
};

const regcompras = async (req, res) => {
  const {
    fecha,
    ruc,
    serie,
    correlativo,
    subtotal,
    igv,
    total,
    idproveedor,
    idusuario,
    hora,
  } = req.body;

  // Inserta la compra en la tabla "compra" y obtiene el ID generado automáticamente
  const insertCompraQuery = `
      INSERT INTO compras (fecha_compra, tipo_comprobante, serie, numero_correlativo, subtotal, igv, totalcompra, estado_compra, idproveedor, idusuario,horacompra)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?,?);
  `;

  try {
    const [result] = await pool
      .promise()
      .execute(insertCompraQuery, [
        fecha,
        ruc,
        serie,
        correlativo,
        subtotal,
        igv,
        total,
        idproveedor,
        idusuario,
        hora,
      ]);
    const idCompra = result.insertId;

    // Envía el ID de la compra recién creada como respuesta
    res.json({ id_compra: idCompra });
    console.log("Query:", insertCompraQuery);
  } catch (error) {
    console.error("Error al insertar la compra:", error);
    res.status(500).json({ error: "Error al insertar la compra" });
  }
};

const regcompras2 = async (req, res) => {
  const { productos } = req.body;

  // Inserta los productos en la tabla "detalle_compra" utilizando el ID de compra
  const insertDetalleCompraQuery = `
      INSERT INTO detalle_compras (idcompra, idproducto, cantidad, precio_compra, total)
      VALUES (?, ?, ?, ?, ?);
  `;

  try {
    // Recorre la lista de productos y realiza la inserción en la base de datos
    for (const producto of productos) {
      await pool
        .promise()
        .execute(insertDetalleCompraQuery, [
          producto.id_compra,
          producto.idproducto,
          producto.cantidad,
          producto.precio,
          producto.subtotal,
        ]);
    }

    // Envía una respuesta exitosa
    res.json({ success: true });
    console.log("Query:", insertDetalleCompraQuery);
  } catch (error) {
    console.error("Error al insertar los productos:", error);
    res.status(500).json({ error: "Error al insertar los productos" });
  }
};

module.exports = {
  vistaregiscompras,
  sumarcantidades,
  regcompras,
  regcompras2,
};

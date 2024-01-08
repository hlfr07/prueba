const pool = require("../../../database/conexion")
const vistavisucompra = async (req, res) => {
  const nombre = req.session.user.nombreusuario;
  const perfil = req.session.user.nombreperfil;
  // Consulta SQL para obtener pisos activos (estado_piso=1)
  const sqlActivo = `SELECT 
  compras.idcompra,
  compras.fecha_compra,
  compras.tipo_comprobante,
  compras.serie,
  compras.numero_correlativo,
  compras.subtotal,
  compras.igv,
  compras.totalcompra,
  compras.estado_compra,
  proveedor.nombre_empresa,
  usuario.nombre,
  TIME_FORMAT(compras.horacompra, '%h:%i %p') AS horacompra_12h
FROM compras
JOIN proveedor ON compras.idproveedor = proveedor.idproveedor
JOIN usuario ON compras.idusuario = usuario.idusuario
WHERE compras.estado_compra = 1
ORDER BY compras.horacompra DESC;

`;
 // Consulta SQL para obtener tipos de habitacion
 const sqlproductos = `SELECT 
 detalle_compras.iddetalle,
 detalle_compras.idcompra,
 productos.nombre_producto,
 categoria.nombre_categoria,
 detalle_compras.cantidad,
 detalle_compras.precio_compra,
 detalle_compras.total
FROM 
 detalle_compras
JOIN 
 productos ON detalle_compras.idproducto = productos.idproducto
JOIN 
 categoria ON productos.idcategoria = categoria.idcategoria;

`;
// Consulta SQL para obtener categorias 
const sqlProveedor = `
SELECT * FROM  proveedor

WHERE estado_proveedor = 1;
`;
// Consulta SQL para obtener unidad 
const sqlUsuario = `
SELECT * FROM  usuario

WHERE estado = 1;
`;
  // Ejecuta ambas consultas SQL de manera asíncrona utilizando promesas
  try {
    const [compras,proveedor,usuario,productos] = await Promise.all([
      pool.promise().query(sqlActivo),
      pool.promise().query(sqlProveedor),
      pool.promise().query(sqlUsuario),
      pool.promise().query(sqlproductos),

    ]);

    console.log("Compras Activos:", compras[0]);
    console.log("Proveedor:",proveedor [0]);
    console.log("Usuario:", usuario[0]);
    console.log("Tipo:", productos[0]);

    // Envía los resultados de ambas consultas a la vista con los nombres pisosActivos y pisosInactivos
    res.render("vistaadmin/compras/visuacompras", {
      compras: compras[0],
      proveedor:proveedor[0],
      usuario: usuario[0],
      productos: productos[0],
      nombre: nombre,
      perfil: perfil 
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};
//


module.exports = { vistavisucompra};
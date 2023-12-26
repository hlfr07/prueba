const pool = require("../../database/conexion");
const bcrypt = require("bcryptjs");

const vistaadmin = async (req, res) => {
  const idusuario = req.session.user.idusuario;
  const idperfil = req.session.user.idperfil;
  const nombre = req.session.user.nombreusuario;
  let perfil = "";

  switch (idperfil) {
    case 1:
      perfil = "ADMINISTRADOR";
      break;
    case 2:
      perfil = "CAJERO";
      break;
    case 3:
      perfil = "SUPERVISOR";
      break;
    default:
      perfil = "GERENTE";
  }

  try {
    console.log("idusuario:", idusuario);
    console.log("idperfil:", idperfil);
    console.log("nombre:", nombre);
    console.log("perfil:", perfil);

    res.render("vistaadmin/vistaadmin", {
      idusuario: idusuario,
      idperfil: idperfil,
      nombre: nombre,
      perfil: perfil,
    });
  } catch (err) {
    console.error("Error al ejecutar las consultas SQL:", err);
    res.status(500).send("Error en las consultas SQL");
  }
};

module.exports = { vistaadmin };
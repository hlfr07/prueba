const express = require("express");
const multer = require("multer");
const pool = require("../../database/conexion");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const {
  vistaregiadmin,
  registrarUsuarios,
} = require("../controllers/registraradmincontrollers");
const { vistalogin } = require("../controllers/logincontrollers");
const { vistaadmin } = require("../controllers/vistaadmincontrollers");
const {
  vistasegperfil,
} = require("../controllers/controladmin/segperfilcontrollers");
const {
  vistasegusuarios,
  vistausuariosid,
  updateusuariosPUT,
  deleteUsuarios,
  actusuario,
} = require("../controllers/controladmin/segusuariocontrollers");
const {
  vistasegreguser,
  segreguser,
} = require("../controllers/controladmin/segregusercontrollers");
const {
  vistasegpasword,
  vistapasswordid,
  updatepasswordPUT,
} = require("../controllers/controladmin/segpasswordcontrollers");
const {
  vistaproveedores,
  regisproveedor,
  vistaproveedorid,
  updateproveedoresPUT,
  deleteproveedores,
  actproveedor,
} = require("../controllers/controladmincompras/proveedorescontrollers");
const {
  vistacategoria,
  regiscategoria,
  vistacategoriaid,
  updatecategoriaPUT,
  deletecategoria,
  actcategoria,
} = require("../controllers/contoladminalamcen/categoriacontrollers");
const {
  vistaunidad,
  regisunidad,
  vistaunidadid,
  updateunidadPUT,
  deleteunidad,
  actunidad,
} = require("../controllers/contoladminalamcen/unidadcontrollers");
const {
  vistaclientes,
  regisclientes,
  vistaclientesid,
  updateclientesPUT,
  deleteclientes,
  actclientes,
} = require("../controllers/controladminventas/clientescontrollers");
const {
  vistaproducto,
  regisproducto,
  updateproductoPUT,
  vistaproductoid,
  deleteproducto,
  actproducto,
} = require("../controllers/contoladminalamcen/productocontrollers");
const {
  vistagalpon,
  regisgalpon,
  vistagalponid,
  updategalponPUT,
  deletegalpon,
  actgalpon,
} = require("../controllers/controladminlote/galponcontrollers");
const {
  vistacontrolgalpon,
  regiscontrolgalpon,
  vistacontrolgalponid,
  updatecontrolgalponPUT,
  deletecontrolgalpon,
  actcontrolgalpon,
} = require("../controllers/controladminlote/controlgalponcontrollers");
const {
  vistaregiscompras, sumarcantidades, regcompras, regcompras2, productosporcate,
} = require("../controllers/controladmincompras/regiscomprascontrollers");
const { vistavisucompra } = require("../controllers/controladmincompras/visuacomprascontrollers");
const {vistaSupervisor2} = require("../controllers/controladorsupervisor/supervisorController");
const enviarGMAIL = require("../controllers/enviargmail");
const { uploadImage } = require("../controllers/subirimagen");

const router = express.Router();

//PARA PROTEGER LAS RUTAS SI NO ESTA LOGEADO LML
function protegerRutas(req, res, next) {
  const datosdelaSessiondeUsuario = req.session.user; // Obtener los datos del usuario de la sesión

  if (!datosdelaSessiondeUsuario) {
    // Si el usuario no ha iniciado sesión, redirigir a la página de login
    return res.redirect("/login");
  }

  const idperfil = datosdelaSessiondeUsuario.idperfil; // Corregir el acceso al campo 'cargo' en lugar de 'idperfil'
  const idusuario = datosdelaSessiondeUsuario.idusuario;
  if (
    (idperfil === 1 && req.path.startsWith("/admin")) ||
    (idperfil === 2 && req.path.startsWith("/caja")) ||
    (idperfil === 3 && req.path.startsWith("/supervisor")) ||
    (idperfil === 4 && req.path.startsWith("/gerente"))
  ) {
    req.idperfil = idperfil;
    req.idusuario = idusuario; // Agregar el ID del usuario // Agregar el ID del usuario al objeto de solicitud (req)
    next(); // Permitir el acceso
  } else {
    // Perfil no autorizado para acceder a esta ruta
    res.redirect("/login");
  }
}

//GUARDA SESION DE USUARIO
// Configurar express-session
router.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
  })
);

//PARA MI API DE SUBIDA DE IMAGENES

// Configurar el middleware multer para manejar la carga de archivos
const storage = multer.memoryStorage(); // Almacenar la imagen en memoria (puedes ajustar según tus necesidades)
// Configuración de Multer para manejar la carga de archivos

// Filtrar solo archivos de imagen
const filtro_de_archivo = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo no es una imagen'), false);
    
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filtro_de_archivo
});


router.post("/image", upload.single("imagen"), uploadImage);


//-------------------------------

//ADMIN
router.get("/registro", vistaregiadmin);
router.post("/registro", registrarUsuarios);

//ADMINSEGURIDADGPERFIL
router.get("/admin/perfiles", protegerRutas, vistasegperfil);

//ADMINSEGURIDADUSUARIO
router.get("/admin/usuarios", protegerRutas, vistasegusuarios);
router.get("/admin/usuarios/:id", protegerRutas, vistausuariosid);
router.put("/admin/usuarios/:id", protegerRutas, updateusuariosPUT);
router.delete("/admin/usuarios/:id", protegerRutas, deleteUsuarios);
router.delete("/admin/borrausuario/:id", protegerRutas, actusuario);
//ADMINSEGREGISTRARUSUARIO
router.get("/admin/reguser", protegerRutas, vistasegreguser);
router.post("/admin/reguser", protegerRutas, segreguser);
//ADMINSEGPASSWORD
router.get("/admin/password", protegerRutas, vistasegpasword);
router.get("/admin/password/:id", protegerRutas, vistapasswordid);
router.put("/admin/password/:id", protegerRutas, updatepasswordPUT);

//ADMINCOMPRAS-PROVEEDORES
router.get("/admin/proveedores",protegerRutas, vistaproveedores);
router.post("/admin/proveedores",protegerRutas, regisproveedor);
router.get("/admin/proveedores/:id",protegerRutas, vistaproveedorid);
router.put("/admin/proveedores/:id",protegerRutas, updateproveedoresPUT);
router.delete("/admin/proveedores/:id",protegerRutas, deleteproveedores);
router.delete("/admin/borraproveedor/:id", protegerRutas, actproveedor);

//ADMIALMACEN-CATEGORIAS
router.get("/admin/categoria", protegerRutas, vistacategoria);
router.post("/admin/categoria",protegerRutas, regiscategoria);
router.get("/admin/categoria/:id", protegerRutas, vistacategoriaid);
router.put("/admin/categoria/:id",protegerRutas, updatecategoriaPUT);
router.delete("/admin/categoria/:id",protegerRutas, deletecategoria);
router.delete("/admin/borracategoria/:id",protegerRutas, actcategoria);

//PRODUCTO
router.get("/admin/producto",protegerRutas,protegerRutas, vistaproducto);
router.post("/admin/producto",protegerRutas, regisproducto);
router.get("/admin/producto/:id",protegerRutas, vistaproductoid);
router.put("/admin/producto/:id",protegerRutas, updateproductoPUT);
router.delete("/admin/producto/:id",protegerRutas, deleteproducto);
router.delete("/admin/borraproducto/:id",protegerRutas, actproducto);

//ADMIALMACEN-CATEGORIAS
router.get("/admin/unidad",protegerRutas, vistaunidad);
router.post("/admin/unidad",protegerRutas, regisunidad);
router.get("/admin/unidad/:id",protegerRutas, vistaunidadid);
router.put("/admin/unidad/:id",protegerRutas, updateunidadPUT);
router.delete("/admin/unidad/:id",protegerRutas, deleteunidad);
router.delete("/admin/borraunidad/:id",protegerRutas, actunidad);

//CLIENTES
router.get("/admin/clientes",protegerRutas, vistaclientes);
router.post("/admin/clientes",protegerRutas, regisclientes);
router.get("/admin/clientes/:id",protegerRutas, vistaclientesid);
router.put("/admin/clientes/:id",protegerRutas, updateclientesPUT);
router.delete("/admin/clientes/:id",protegerRutas, deleteclientes);
router.delete("/admin/borracliente/:id",protegerRutas, actclientes);

//GALPON
router.get("/admin/galpon",protegerRutas, vistagalpon);
router.post("/admin/galpon",protegerRutas, regisgalpon);
router.get("/galpon/:id",protegerRutas, vistagalponid);
router.put("/admin/galpon/:id",protegerRutas, updategalponPUT);
router.delete("/admin/galpon/:id",protegerRutas, deletegalpon);
router.delete("/admin/borragalpon/:id",protegerRutas, actgalpon);

//CONTROL GALPON
router.get("/admin/controlgalpon",protegerRutas, vistacontrolgalpon);
router.post("/admin/controlgalpon",protegerRutas, regiscontrolgalpon);
router.get("/admin/controlgalpon/:id",protegerRutas, vistacontrolgalponid);
router.put("/admin/controlgalpon/:id",protegerRutas, updatecontrolgalponPUT);
router.delete("/admin/controlgalpon/:id",protegerRutas, deletecontrolgalpon);
router.delete("/admin/borracontrolgalpon/:id",protegerRutas, actcontrolgalpon);

//CONTROL COMPRAS
router.get("/admin/regcompras", protegerRutas,vistaregiscompras);
router.patch("/admin/sumarcantidad",protegerRutas, sumarcantidades);
router.post("/admin/regcompras",protegerRutas, regcompras);
router.post("/admin/regcompras2",protegerRutas, regcompras2);
//vista compras
router.get("/admin/vistacompra", protegerRutas, vistavisucompra);



// vista de SUPERVISOR HECHO POR UN INSANO TLV NO EDITES
router.get("/supervisor",protegerRutas, vistaSupervisor2);


//LOGIN
router.get("/", vistalogin);
router.get("/login", vistalogin);
//POST DE LOGIN PARA COMPARA LOS DATOOS DE LOGIN
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Busca el usuario en la base de datos por nombre de usuario
    pool.query(
      "SELECT * FROM usuario WHERE correo = ?"
      ,
      [correo],
      async (error, results) => {
        console.log(results);
        if (error) {
          console.error("Error en el servidor:", error);
          res.render("login", { message: "Error al buscar Usuario" });
        } else if (results.length === 0) {
          // El usuario no existe
          res.render("login", { message: "Correo no encontrado" });
        } else if (results[0].estado === 0) {
          // El usuario no existe
          res.render("login", { message: "Este correo esta Inactivo" });
        } else {
          // Compara la contraseña proporcionada con la almacenada en la base de datos
          const resultadodetablausuario = results[0];
          const contrasenaValida = await bcrypt.compare(
            password,
            resultadodetablausuario.password
          );

          if (contrasenaValida) {
            req.session.user = {
              idperfil: resultadodetablausuario.idperfil,
              nombreperfil: resultadodetablausuario.perfil,
              idusuario: resultadodetablausuario.idusuario,
              nombreusuario: resultadodetablausuario.nombre,
            };
            console.log(resultadodetablausuario.idperfil,resultadodetablausuario.perfil,resultadodetablausuario.idusuario,resultadodetablausuario.nombre);
            switch (resultadodetablausuario.idperfil) {
              case 1 :  // Cambiado de "1" a 1
                res.redirect("/admin");
                break;
              case 2: // Cambiado de "2" a 2
                res.redirect("/caja");
                break;
              case 3: // Cambiado de "3" a 3
                res.redirect("/supervisor");
                break;
              default:
                res.redirect("/gerente");
            }
          } else {
            // Contraseña incorrecta
            res.render("login", { message: "Contraseña Incorrecta" });
          }
        }
      }
    );
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
});

//VISTA DEL ADMIN DESPUES LOGEADO
router.get("/admin", protegerRutas, vistaadmin);

//PARA CERRAR SESION
router.get("/salir", (req, res) => {
  // Eliminar la sesión del usuario
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }

    // Redirigir al usuario a la página de inicio de sesión
    res.redirect("/login");
  });
});


//esto es para acarrear a loli


router.post("/send-email", enviarGMAIL);

module.exports = router;

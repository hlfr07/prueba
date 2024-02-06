const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const enviarGMAIL = async (req, res) => {
  const { correo, codigo } = req.body;

  const CLIENT_ID = "63785056239-g1rcr257ffduhe2ona7gmv26fih4t0p2.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URL = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04LBTfzrAJiMGCgYIARAAGAQSNwF-L9Ir87IAWM2TGjLHv_8XPP2Xc2L6CwijfkLMTjATWMiL-_JwhxH7Y8dAM-zPPE5HLLQ7dGw";

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

  oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  async function sendEmail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
      const transporte = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "lolijorddy@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const resetLink = "http://localhost/login/controlador/validar_codigo.php"; // Reemplaza esto con la URL real de reseteo de contraseña

      const payload = {
        contra: "luis",
      };


      const contentHTML = `
        <h1>Recuperación de contraseña</h1>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <br />
        <p>Guarda este Token  para generar tu nueva contraseña : </p>
        <h2> ${codigo} </h2>



        <h3>El token vence en un dia ten encuenta eso , si se vence ya tendras que generar otro restablecer</h3>
        
      `;

      const mailOptions = {
        from: "lolijorddy@gmail.com",
        to: correo,
        subject: "Recuperación de contraseña",
        html: contentHTML,
      };

      const respuesta = await transporte.sendMail(mailOptions);
      return respuesta;
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const respuesta = await sendEmail();
    res.status(200).send("Correo enviado");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al enviar el correo");
  }
};

module.exports = enviarGMAIL;

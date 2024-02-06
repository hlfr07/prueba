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
      <div style="max-width: 600px; margin: 50px auto; background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #3498db;">Recuperación de contraseña</h1>
      <p>Guarda este <strong style="color: #3498db;">CODIGO</strong> para generar tu nueva contraseña:</p>
      <input style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #3498db; margin-top: 10px; box-sizing: border-box; color: #3498db; font-size: 16px; text-align: center; outline: none;" type="text" value="${codigo}" readonly>
      <h3 style="color: #3498db;">El <strong style="color: #3498db;">CODIGO</strong> vence en 2 minutos. Tenlo en cuenta. Si expira, deberás generar otro restablecimiento.</h3>
      </div>
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

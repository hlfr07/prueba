const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary (reemplaza con tus propias credenciales)
cloudinary.config({
    cloud_name: 'dihnmcfc4',
    api_key: '552462268822729',
    api_secret: '-2Nit0NWEzuc2sjWFeJOjSHzb3c'
});

const uploadImage = (req, res) => {
    const { buffer } = req.file;
    const { nombre } = req.body; // Asegúrate de que el nombre se envíe en el cuerpo de la solicitud

    // Convierte el buffer a una cadena Base64
    const base64Image = buffer.toString('base64');

    // Subir imagen a Cloudinary
    cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, (error, result) => {
        if (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            res.status(500).json({ message: 'Error al subir la imagen' });
        } else {
            // Actualizar la URL de la imagen en la base de datos
            const imageUrl = result.secure_url;
            res.status(200).json({ imageUrl, nombre }); // Enviar la URL segura y el nombre como respuesta
        }
    });
};

module.exports = { uploadImage };

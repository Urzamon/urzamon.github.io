const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'akeladinelia@hotmail.com',
        pass: process.env.EMAIL_PASSWORD // Deberás configurar esta variable de entorno en Firebase
    }
});

exports.sendEmail = functions.https.onCall(async (data, context) => {
    // Verificar que el usuario esté autenticado
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado');
    }

    try {
        await transporter.sendMail(data);
        return { success: true };
    } catch (error) {
        console.error('Error al enviar email:', error);
        throw new functions.https.HttpsError('internal', 'Error al enviar el email');
    }
});

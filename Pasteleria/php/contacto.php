<?php
header('Content-Type: application/json');

// Configuración de correo
$destinatario = "info@dulcetentacion.com";
$asunto = "Nuevo mensaje de contacto - Dulce Tentación";

// Obtener datos del formulario
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$mensaje = $_POST['mensaje'] ?? '';

// Validar datos
if (empty($nombre) || empty($email) || empty($mensaje)) {
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, complete todos los campos requeridos.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, ingrese un email válido.'
    ]);
    exit;
}

// Preparar el mensaje
$contenido = "Nombre: $nombre\n";
$contenido .= "Email: $email\n";
$contenido .= "Teléfono: $telefono\n\n";
$contenido .= "Mensaje:\n$mensaje";

// Cabeceras del correo
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar el correo
try {
    if (mail($destinatario, $asunto, $contenido, $headers)) {
        // Guardar en base de datos (opcional)
        guardarMensaje($nombre, $email, $telefono, $mensaje);
        
        echo json_encode([
            'success' => true,
            'message' => '¡Gracias por tu mensaje! Te contactaremos pronto.'
        ]);
    } else {
        throw new Exception('Error al enviar el correo');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lo sentimos, hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.'
    ]);
}

// Función para guardar mensajes en base de datos (opcional)
function guardarMensaje($nombre, $email, $telefono, $mensaje) {
    // Aquí puedes implementar la conexión a tu base de datos
    // y guardar el mensaje si lo deseas
}
?> 
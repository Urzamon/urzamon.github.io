<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Habilitar reporte de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validar que todos los campos requeridos estén presentes
    if (empty($_POST['nombre']) || empty($_POST['email']) || empty($_POST['mensaje'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, complete todos los campos requeridos.'
        ]);
        exit;
    }

    // Validar formato de email
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, ingrese un email válido.'
        ]);
        exit;
    }

    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'] ?? 'No especificado';
    $mensaje = $_POST['mensaje'];

    $to = "akeladinelia@hotmail.com";
    $subject = "Nuevo mensaje de contacto de $nombre";
    
    $message = "Nombre: $nombre\n";
    $message .= "Email: $email\n";
    $message .= "Teléfono: $telefono\n";
    $message .= "Mensaje: $mensaje\n";
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    try {
        if(mail($to, $subject, $message, $headers)) {
            echo json_encode([
                'success' => true,
                'message' => 'Email enviado correctamente'
            ]);
        } else {
            throw new Exception('Error al enviar el email');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el email: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?> 
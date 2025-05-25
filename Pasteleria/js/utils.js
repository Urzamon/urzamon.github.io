export function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion-carrito notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

export function mostrarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

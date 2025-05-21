// Función para cargar el menú de navegación
async function loadNavbar() {
    try {
        const response = await fetch('components/navbar.html');
        const html = await response.text();
        document.getElementById('navbar-container').innerHTML = html;

        // Inicializar funcionalidades del menú
        initializeNavbar();
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// Función para inicializar las funcionalidades del menú
function initializeNavbar() {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Carrito
    const carritoPanel = document.getElementById('carrito-panel');
    const carritoOverlay = document.getElementById('carrito-overlay');
    const carritoToggle = document.getElementById('carrito-toggle');
    const carritoCerrar = document.getElementById('carrito-cerrar');

    if (carritoPanel && carritoOverlay && carritoToggle && carritoCerrar) {
        function toggleCarrito() {
            carritoPanel.classList.toggle('active');
            carritoOverlay.classList.toggle('active');
        }

        carritoToggle.addEventListener('click', toggleCarrito);
        carritoCerrar.addEventListener('click', toggleCarrito);
        carritoOverlay.addEventListener('click', toggleCarrito);
    }

    // Marcar enlace activo
    const currentPage = window.location.pathname.split('/').pop();
    const navLinksElements = document.querySelectorAll('.nav-links a');
    
    navLinksElements.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Cargar el menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavbar); 
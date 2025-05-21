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

    // Inicializar login Google
    setupGoogleLogin();
}

// Función para manejar login/logout con Google
function setupGoogleLogin() {
    // Esperar a que Firebase esté disponible
    if (typeof getAuth !== 'function' || typeof GoogleAuthProvider !== 'function') {
        console.warn('Firebase Auth no está disponible. Asegúrate de importar los módulos en la página.');
        return;
    }
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const googleLoginIcon = document.getElementById('google-login-icon');
    const userIcon = document.getElementById('user-icon');

    // Mostrar/ocultar íconos según el estado de autenticación
    function updateIcons(user) {
        if (user) {
            googleLoginIcon.style.display = 'none';
            userIcon.style.display = 'flex';
            userIcon.title = user.displayName || 'Mi perfil';
        } else {
            googleLoginIcon.style.display = 'flex';
            userIcon.style.display = 'none';
        }
    }

    // Escuchar cambios de estado
    auth.onAuthStateChanged(updateIcons);

    // Login con Google
    googleLoginIcon.addEventListener('click', async () => {
        try {
            await carrito.iniciarSesion();
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });

    // Logout al hacer clic en el ícono de usuario
    userIcon.addEventListener('click', async () => {
        try {
            await auth.signOut();
            alert('Sesión cerrada.');
        } catch (error) {
            alert('Error al cerrar sesión: ' + error.message);
        }
    });
}

// Cargar el menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavbar); 
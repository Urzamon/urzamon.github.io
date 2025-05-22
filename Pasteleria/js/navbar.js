// Esperar a que Firebase esté disponible
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
        console.error('Firebase no está disponible. Asegúrate de importar los módulos en la página.');
        return;
    }

    // Inicializar Firebase si no está inicializado
    if (!firebase.apps.length) {
        const firebaseConfig = {
            apiKey: "AIzaSyCbuHAKkLVfrQwrI5g7iLgpy_nK1OC7CZM",
            authDomain: "divina-tarta.firebaseapp.com",
            projectId: "divina-tarta",
            storageBucket: "divina-tarta.firebasestorage.app",
            messagingSenderId: "676183370068",
            appId: "1:676183370068:web:b6e4b8fb9c6122841d40c1",
            measurementId: "G-KH27KY66KR"
        };
        firebase.initializeApp(firebaseConfig);
    }

    // Cargar el menú de navegación
    loadNavbar();
});

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
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const googleLoginIcon = document.getElementById('google-login-icon');
    const userIcon = document.getElementById('user-icon');

    // Mostrar/ocultar íconos según el estado de autenticación
    function updateIcons(user) {
        if (user) {
            if (googleLoginIcon) googleLoginIcon.style.display = 'none';
            if (userIcon) {
                userIcon.style.display = 'flex';
                userIcon.title = user.displayName || 'Mi perfil';
                const userName = document.getElementById('user-name');
                if (userName) userName.textContent = user.displayName || 'Usuario';
            }
        } else {
            if (googleLoginIcon) googleLoginIcon.style.display = 'flex';
            if (userIcon) userIcon.style.display = 'none';
        }
    }

    // Escuchar cambios de estado
    auth.onAuthStateChanged(updateIcons);

    // Login con Google
    if (googleLoginIcon) {
        googleLoginIcon.addEventListener('click', async () => {
            try {
                const result = await auth.signInWithPopup(provider);
                if (result.user) {
                    console.log('Usuario autenticado:', result.user.displayName);
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
            }
        });
    }

    // Logout al hacer clic en el ícono de usuario
    if (userIcon) {
        const logoutButton = userIcon.querySelector('.logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                try {
                    await auth.signOut();
                    console.log('Sesión cerrada correctamente');
                } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                }
            });
        }
    }
} 
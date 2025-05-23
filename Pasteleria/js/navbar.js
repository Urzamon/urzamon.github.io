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

    // Cargar la barra de navegación
    loadNavbar();
});

// Función para cargar la barra de navegación
async function loadNavbar() {
    try {
        const response = await fetch('./components/navbar.html');
        if (!response.ok) {
            throw new Error('Error al cargar la barra de navegación');
        }
        const html = await response.text();
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = html;
            initNavbar();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para inicializar la funcionalidad de la barra de navegación
function initNavbar() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const carritoPanel = document.getElementById('carrito-panel');
    const carritoOverlay = document.getElementById('carrito-overlay');
    const carritoToggle = document.getElementById('carrito-toggle');
    const carritoCerrar = document.getElementById('carrito-cerrar');

    // Toggle del menú móvil
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
    }

    // Toggle del carrito
    if (carritoToggle) {
        carritoToggle.addEventListener('click', toggleCarrito);
    }

    // Cerrar carrito
    if (carritoCerrar) {
        carritoCerrar.addEventListener('click', toggleCarrito);
    }

    // Cerrar carrito al hacer clic en el overlay
    if (carritoOverlay) {
        carritoOverlay.addEventListener('click', toggleCarrito);
    }

    // Cerrar menú móvil al hacer clic en un enlace
    const navbarLinks = document.querySelectorAll('#navbar-menu a');
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu && navbarToggle) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    });

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

// Función para alternar la visibilidad del carrito
function toggleCarrito() {
    const carritoPanel = document.getElementById('carrito-panel');
    const carritoOverlay = document.getElementById('carrito-overlay');
    
    if (carritoPanel && carritoOverlay) {
        carritoPanel.classList.toggle('active');
        carritoOverlay.classList.toggle('active');
    }
} 
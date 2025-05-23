// Función para cargar los pasteles destacados
async function cargarPastelesDestacados() {
    try {
        const pastelesRef = db.collection("pasteles").where("destacado", "==", true);
        const snapshot = await pastelesRef.get();
        
        const gridPasteles = document.querySelector('.grid-pasteles');
        if (!gridPasteles) return;

        gridPasteles.innerHTML = '';

        snapshot.forEach(doc => {
            const pastel = doc.data();
            const pastelElement = document.createElement('div');
            pastelElement.className = 'pastel-card';
            pastelElement.innerHTML = `
                <img src="${pastel.imagen}" alt="${pastel.nombre}">
                <h3>${pastel.nombre}</h3>
                <p>${pastel.descripcion}</p>
                <span class="precio">${pastel.precio.toFixed(2)}€</span>
                <button onclick="carrito.agregarItem({
                    id: '${doc.id}',
                    nombre: '${pastel.nombre}',
                    precio: ${pastel.precio},
                    imagen: '${pastel.imagen}'
                })" class="btn-secondary">Añadir al Carrito</button>
            `;
            gridPasteles.appendChild(pastelElement);
        });
    } catch (error) {
        console.error("Error al cargar los pasteles destacados:", error);
    }
}

// Función para inicializar la página
function initPage() {
    // Cargar pasteles destacados
    cargarPastelesDestacados();

    // Inicializar el botón de inicio de sesión
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await auth.signInWithPopup(provider);
                if (window.carrito) {
                    window.carrito.userId = result.user.uid;
                    await window.carrito.cargarCarrito();
                }
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
            }
        });
    }

    // Observar cambios en el estado de autenticación
    auth.onAuthStateChanged(user => {
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            if (user) {
                loginButton.innerHTML = `
                    <i class="bi bi-person-circle"></i>
                    ${user.displayName}
                `;
                loginButton.onclick = () => auth.signOut();
            } else {
                loginButton.innerHTML = `
                    <i class="bi bi-google"></i>
                    Iniciar Sesión
                `;
                loginButton.onclick = async () => {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    try {
                        const result = await auth.signInWithPopup(provider);
                        if (window.carrito) {
                            window.carrito.userId = result.user.uid;
                            await window.carrito.cargarCarrito();
                        }
                    } catch (error) {
                        console.error("Error al iniciar sesión:", error);
                    }
                };
            }
        }
    });
}

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initPage); 
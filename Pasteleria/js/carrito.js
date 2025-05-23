// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbuHAKkLVfrQwrI5g7iLgpy_nK1OC7CZM",
    authDomain: "divina-tarta.firebaseapp.com",
    projectId: "divina-tarta",
    storageBucket: "divina-tarta.firebasestorage.app",
    messagingSenderId: "676183370068",
    appId: "1:676183370068:web:b6e4b8fb9c6122841d40c1",
    measurementId: "G-KH27KY66KR"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Clase Carrito
class Carrito {
    constructor() {
        this.items = [];
        this.userId = null;
        this.init();
    }

    async init() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.userId = user.uid;
                await this.cargarCarrito();
            }
        });
    }

    async cargarCarrito() {
        if (!this.userId) return;

        try {
            const carritoRef = db.collection("carritos").doc(this.userId);
            const carritoDoc = await carritoRef.get();

            if (carritoDoc.exists) {
                this.items = carritoDoc.data().items;
            } else {
                this.items = [];
                await this.guardarCarrito();
            }

            this.actualizarContador();
            this.renderizarCarrito();
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        }
    }

    async guardarCarrito() {
        if (!this.userId) return;

        try {
            const carritoRef = db.collection("carritos").doc(this.userId);
            await carritoRef.set({
                items: this.items,
                ultimaActualizacion: new Date()
            });
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
        }
    }

    async agregarItem(producto) {
        if (!this.userId) {
            const iniciado = await this.iniciarSesion();
            if (!iniciado) return;
        }

        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                imagen: producto.imagen
            });
        }
        
        await this.guardarCarrito();
        this.actualizarContador();
        this.renderizarCarrito();
        this.mostrarNotificacion('Producto agregado al carrito');
    }

    async eliminarItem(id) {
        if (!this.userId) return;

        this.items = this.items.filter(item => item.id !== id);
        await this.guardarCarrito();
        this.actualizarContador();
        this.renderizarCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito');
    }

    async actualizarCantidad(id, cantidad) {
        if (!this.userId) return;

        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad = cantidad;
            if (item.cantidad <= 0) {
                await this.eliminarItem(id);
            } else {
                await this.guardarCarrito();
                this.actualizarContador();
                this.renderizarCarrito();
            }
        }
    }

    async vaciarCarrito() {
        if (!this.userId) return;

        this.items = [];
        await this.guardarCarrito();
        this.actualizarContador();
        this.renderizarCarrito();
        this.mostrarNotificacion('Carrito vaciado');
    }

    actualizarContador() {
        const contador = document.getElementById('carrito-contador');
        if (contador) {
            const totalItems = this.items.reduce((total, item) => total + item.cantidad, 0);
            contador.textContent = totalItems;
        }
    }

    renderizarCarrito() {
        const listaCarrito = document.getElementById('carrito-lista');
        if (!listaCarrito) return;

        listaCarrito.innerHTML = '';
        
        if (this.items.length === 0) {
            listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            return;
        }

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>${item.precio.toFixed(2)}€</p>
                    <div class="carrito-item-cantidad">
                        <button onclick="carrito.actualizarCantidad('${item.id}', ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="carrito.actualizarCantidad('${item.id}', ${item.cantidad + 1})">+</button>
                    </div>
                </div>
                <button class="carrito-item-eliminar" onclick="carrito.eliminarItem('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            listaCarrito.appendChild(itemElement);
        });
    }

    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-carrito';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 2000);
    }
}

// Inicializar el carrito y hacerlo global
window.carrito = new Carrito();

// Carrito
document.addEventListener('DOMContentLoaded', function() {
    const carritoPanel = document.getElementById('carrito-panel');
    const carritoOverlay = document.getElementById('carrito-overlay');
    const carritoToggle = document.getElementById('carrito-toggle');
    const carritoCerrar = document.getElementById('carrito-cerrar');

    if (carritoToggle) {
        carritoToggle.addEventListener('click', toggleCarrito);
    }
    if (carritoCerrar) {
        carritoCerrar.addEventListener('click', toggleCarrito);
    }
    if (carritoOverlay) {
        carritoOverlay.addEventListener('click', toggleCarrito);
    }

    function toggleCarrito() {
        if (carritoPanel && carritoOverlay) {
            carritoPanel.classList.toggle('active');
            carritoOverlay.classList.toggle('active');
        }
    }
}); 
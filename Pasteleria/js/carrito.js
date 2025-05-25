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
        const totalElement = document.getElementById('carrito-total');
        if (!listaCarrito) return;

        listaCarrito.innerHTML = '';
        
        if (this.items.length === 0) {
            listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            if (totalElement) totalElement.textContent = '0€';
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

        // Actualizar el total
        if (totalElement) {
            const total = this.calcularTotal();
            totalElement.textContent = `${total.toFixed(2)}€`;
        }
    }

    mostrarNotificacion(mensaje, tipo = 'success') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion-carrito notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    async enviarPedido() {
        if (!this.userId) {
            this.mostrarNotificacion('Debes iniciar sesión para enviar el pedido', 'error');
            return;
        }

        if (this.items.length === 0) {
            this.mostrarNotificacion('El carrito está vacío', 'error');
            return;
        }

        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                this.mostrarNotificacion('Error: Usuario no autenticado', 'error');
                return;
            }

            // Crear el contenido del email
            const emailContent = {
                to: user.email,
                from: 'akeladinelia@hotmail.com',
                subject: 'Confirmación de Pedido - Divina Tarta',
                html: `
                    <h2>¡Gracias por tu pedido!</h2>
                    <p>Hola ${user.displayName},</p>
                    <p>Hemos recibido tu pedido. Aquí está el resumen:</p>
                    <ul>
                        ${this.items.map(item => `
                            <li>${item.nombre} - ${item.cantidad} x ${item.precio.toFixed(2)}€ = ${(item.cantidad * item.precio).toFixed(2)}€</li>
                        `).join('')}
                    </ul>
                    <p><strong>Total: ${this.calcularTotal().toFixed(2)}€</strong></p>
                    <p>Nos pondremos en contacto contigo pronto para confirmar los detalles del pedido.</p>
                    <p>Saludos,<br>El equipo de Divina Tarta</p>
                `
            };

            // Verificar si Firebase Functions está disponible
            if (typeof firebase.functions === 'function') {
                try {
                    // Enviar el email usando Firebase Cloud Functions
                    const sendEmail = firebase.functions().httpsCallable('sendEmail');
                    await sendEmail(emailContent);
                    this.mostrarNotificacion('Pedido enviado correctamente', 'success');
                } catch (functionsError) {
                    console.error('Error con Firebase Functions:', functionsError);
                    // Fallback: mostrar el contenido del email en la consola
                    console.log('Contenido del email:', emailContent);
                    this.mostrarNotificacion('Pedido procesado (modo de prueba)', 'success');
                }
            } else {
                // Fallback: mostrar el contenido del email en la consola
                console.log('Contenido del email:', emailContent);
                this.mostrarNotificacion('Pedido procesado (modo de prueba)', 'success');
            }

            await this.vaciarCarrito();
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            this.mostrarNotificacion('Error al enviar el pedido', 'error');
        }
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
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
class CarritoCompras {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.total = 0;
        this.actualizarTotal();
    }

    agregarItem(producto) {
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
        
        this.guardarCarrito();
        this.actualizarTotal();
        this.actualizarUI();
    }

    eliminarItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarTotal();
        this.actualizarUI();
    }

    actualizarCantidad(id, cantidad) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad = cantidad;
            if (item.cantidad <= 0) {
                this.eliminarItem(id);
            }
        }
        this.guardarCarrito();
        this.actualizarTotal();
        this.actualizarUI();
    }

    actualizarTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    actualizarUI() {
        const carritoContador = document.getElementById('carrito-contador');
        const carritoLista = document.getElementById('carrito-lista');
        const carritoTotal = document.getElementById('carrito-total');
        
        if (carritoContador) {
            const totalItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
            carritoContador.textContent = totalItems;
        }

        if (carritoLista) {
            carritoLista.innerHTML = this.items.map(item => `
                <div class="carrito-item">
                    <div class="carrito-item-imagen-container">
                        <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px !important; height: 50px !important; object-fit: cover;">
                    </div>
                    <div class="carrito-item-info">
                        <h4>${item.nombre}</h4>
                        <p>${item.precio}€ x ${item.cantidad}</p>
                    </div>
                    <div class="carrito-item-cantidad">
                        <button onclick="carrito.actualizarCantidad('${item.id}', ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="carrito.actualizarCantidad('${item.id}', ${item.cantidad + 1})">+</button>
                    </div>
                    <button class="eliminar" onclick="carrito.eliminarItem('${item.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        if (carritoTotal) {
            carritoTotal.textContent = `${this.total.toFixed(2)}€`;
        }
    }
}

// Inicializar carrito
const carrito = new CarritoCompras();

// Función para agregar al carrito desde cualquier página
function agregarAlCarrito(producto) {
    carrito.agregarItem(producto);
    mostrarNotificacion('Producto agregado al carrito');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
} 
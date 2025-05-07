// Datos de los materiales
const materialesData = {
    paneles: {
        titulo: 'Paneles Solares',
        imagen: 'img/paneles-solares.png',
        descripcion: 'Los paneles solares son el componente principal de cualquier instalación fotovoltaica. Convierten la luz solar en electricidad mediante el efecto fotovoltaico.',
        caracteristicas: [
            'Alta eficiencia de conversión',
            'Durabilidad garantizada de 25 años',
            'Resistencia a condiciones climáticas extremas',
            'Bajo mantenimiento',
            'Diseño estético y moderno'
        ],
        especificaciones: {
            potencia: '400W - 600W',
            eficiencia: '20% - 22%',
            dimensiones: '1.7m x 1.0m',
            peso: '20kg - 25kg'
        }
    },
    inversor: {
        titulo: 'Inversor Solar',
        imagen: 'img/inversor-solar.jpg',
        descripcion: 'El inversor es un componente crucial que convierte la corriente continua (DC) generada por los paneles en corriente alterna (AC) para uso doméstico.',
        caracteristicas: [
            'Alta eficiencia de conversión',
            'Monitoreo remoto integrado',
            'Protección contra sobrecargas',
            'Sistema de refrigeración avanzado',
            'Interfaz de usuario intuitiva'
        ],
        especificaciones: {
            potencia: '3kW - 10kW',
            eficiencia: '97% - 98%',
            garantia: '10 años',
            tipo: 'Híbrido'
        }
    },
    baterias: {
        titulo: 'Baterías Solares',
        imagen: 'img/baterias.jpg',
        descripcion: 'Las baterías almacenan la energía generada por los paneles solares para su uso posterior, especialmente durante la noche o en días nublados.',
        caracteristicas: [
            'Alta capacidad de almacenamiento',
            'Larga vida útil',
            'Bajo mantenimiento',
            'Ciclos de carga profundos',
            'Tecnología LiFePO4'
        ],
        especificaciones: {
            capacidad: '5kWh - 15kWh',
            voltaje: '48V',
            ciclos: '4000+ ciclos',
            garantia: '10 años'
        }
    }
};

// Función para mostrar el popup de materiales
function showMaterialDetails(materialId) {
    const material = materialesData[materialId];
    const popup = document.getElementById('materialPopup');
    const overlay = document.getElementById('popupOverlay');
    const content = document.getElementById('popupContent');

    // Crear el contenido del popup
    content.innerHTML = `
        <img src="${material.imagen}" alt="${material.titulo}">
        <h4>${material.titulo}</h4>
        <p>${material.descripcion}</p>
        
        <div class="caracteristicas">
            <h5>Características Principales</h5>
            <ul class="list-unstyled">
                ${material.caracteristicas.map(caracteristica => 
                    `<li><i class="bi bi-check-circle-fill text-success"></i> ${caracteristica}</li>`
                ).join('')}
            </ul>
        </div>

        <div class="especificaciones">
            <h5>Especificaciones Técnicas</h5>
            <div class="row">
                ${Object.entries(material.especificaciones).map(([key, value]) => `
                    <div class="col-6 mb-2">
                        <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        <span>${value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Mostrar el popup y el overlay
    popup.classList.add('active');
    overlay.classList.add('active');
}

// Función para cerrar el popup
function closeMaterialPopup() {
    const popup = document.getElementById('materialPopup');
    const overlay = document.getElementById('popupOverlay');
    
    popup.classList.remove('active');
    overlay.classList.remove('active');
}

// Cerrar popup al hacer clic en el overlay
document.getElementById('popupOverlay').addEventListener('click', closeMaterialPopup);

// Cerrar popup con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMaterialPopup();
    }
}); 
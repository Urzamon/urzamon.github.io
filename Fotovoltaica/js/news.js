// Función para formatear la fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para crear una tarjeta de noticia
function createNewsCard(news) {
    return `
        <div class="col-md-4" data-aos="fade-up">
            <div class="news-card">
                <div class="news-image">
                    <img src="${news.image}" alt="${news.title}">
                    <div class="news-date">${formatDate(news.date)}</div>
                </div>
                <div class="news-content">
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${news.excerpt}</p>
                    <div class="news-meta">
                        <span class="news-category">${news.category}</span>
                        <a href="${news.link}" class="news-read-more">
                            Leer más <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para cargar las noticias
async function loadNews() {
    try {
        // Aquí puedes reemplazar esta URL con tu API real
        const response = await fetch('https://api.example.com/news');
        const news = await response.json();
        
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = news.map(createNewsCard).join('');
        
        // Reiniciar AOS para las nuevas tarjetas
        AOS.refresh();
    } catch (error) {
        console.error('Error al cargar las noticias:', error);
        // Mostrar noticias de ejemplo en caso de error
        showExampleNews();
    }
}

// Función para mostrar noticias de ejemplo
function showExampleNews() {
    const exampleNews = [
        {
            title: "Nuevas Tecnologías en Paneles Solares",
            excerpt: "Descubre las últimas innovaciones en tecnología solar que están revolucionando el mercado.",
            image: "img/news1.jpg",
            date: "2024-03-15",
            category: "Tecnología",
            link: "#"
        },
        {
            title: "Guía de Mantenimiento Solar",
            excerpt: "Aprende cómo mantener tu sistema solar en óptimas condiciones durante todo el año.",
            image: "img/news2.webp",
            date: "2024-03-10",
            category: "Mantenimiento",
            link: "#"
        },
        {
            title: "Beneficios Fiscales 2024",
            excerpt: "Conoce las nuevas ayudas y subvenciones disponibles para instalaciones solares.",
            image: "img/news3.jpg",
            date: "2024-03-05",
            category: "Legislación",
            link: "#"
        }
    ];

    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = exampleNews.map(createNewsCard).join('');
    
    // Reiniciar AOS para las nuevas tarjetas
    AOS.refresh();
}

// Cargar noticias cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
}); 
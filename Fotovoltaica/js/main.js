// Slideshow
let slideIndex = 0;
let slideInterval;
const slideDuration = 10000; // 10 segundos por slide

let barraslideIndex = 0;
const barraslides = document.querySelectorAll('.barra-slides');

function showSlides() {
    const slides = document.getElementsByClassName("slides");
    const dots = document.getElementsByClassName("slideshow-dot");
    const progressBar = document.querySelector(".slideshow-progress-bar");
    
    // Verificar si los elementos existen
    if (!slides.length || !dots.length || !progressBar) return;
    
    // Ocultar todas las diapositivas
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        if (dots[i]) dots[i].classList.remove("active");
    }
    
    // Mostrar la diapositiva actual
    slides[slideIndex].classList.add("active");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
    
    // Actualizar la barra de progreso
    progressBar.style.width = "0%";
    progressBar.style.transition = "none";
    setTimeout(() => {
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = "100%";
    }, 50);
}

function showBarraSlides() {
    if (!barraslides.length) return;
    
    barraslides.forEach((slide, index) => {
        slide.style.display = index === barraslideIndex ? 'block' : 'none';
    });
    barraslideIndex = (barraslideIndex + 1) % barraslides.length;
}

// Función para cambiar a la siguiente diapositiva
function nextSlide() {
    const slides = document.getElementsByClassName("slides");
    if (!slides.length) return;
    
    slideIndex = (slideIndex + 1) % slides.length;
    showSlides();
}

// Función para cambiar a la diapositiva anterior
function prevSlide() {
    const slides = document.getElementsByClassName("slides");
    if (!slides.length) return;
    
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlides();
}

// Iniciar el slideshow automático
function startSlideshow() {
    const slides = document.getElementsByClassName("slides");
    if (!slides.length) return;
    
    showSlides();
    slideInterval = setInterval(nextSlide, slideDuration);
}

// Detener el slideshow automático
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Event listeners para los controles
document.addEventListener("DOMContentLoaded", function() {
    const slideshow = document.querySelector(".slideshow");
    if (!slideshow) return;
    
    const prevButton = slideshow.querySelector(".slideshow-prev");
    const nextButton = slideshow.querySelector(".slideshow-next");
    const dots = slideshow.getElementsByClassName("slideshow-dot");
    
    // Iniciar el slideshow
    startSlideshow();
    
    // Event listeners para los botones
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
    }
    
    // Event listeners para los dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].addEventListener("click", () => {
            stopSlideshow();
            slideIndex = i;
            showSlides();
            startSlideshow();
        });
    }
    
    // Pausar el slideshow cuando el mouse está sobre él
    slideshow.addEventListener("mouseenter", stopSlideshow);
    slideshow.addEventListener("mouseleave", startSlideshow);
});

// Iniciar slideshows solo si existen los elementos necesarios
if (document.querySelector('.barra-slides')) {
    setInterval(showBarraSlides, 6000);
}

if (document.querySelector('.slideshow')) {
    startSlideshow();
}

// FAQ Accordion
const faqItems = [
    {
        question: "¿Cuánto cuesta instalar paneles solares?",
        answer: "El costo de la instalación de paneles solares varía según el tamaño del sistema, la ubicación y los materiales utilizados. En promedio, el costo puede oscilar entre $10,000 y $30,000."
    },
    {
        question: "¿Cuánto tiempo tardará en pagarse el sistema solar?",
        answer: "El tiempo de retorno de la inversión (ROI) depende del costo del sistema, los ahorros en la factura de electricidad y los incentivos fiscales. En general, puede tardar entre 5 y 10 años en pagarse."
    },
    {
        question: "¿Los paneles solares funcionan en días nublados?",
        answer: "Sí, los paneles solares pueden generar energía incluso en días nublados, aunque su eficiencia puede disminuir. La luz difusa aún puede ser captada por los paneles."
    },
    {
        question: "¿Necesito baterías para un sistema solar?",
        answer: "No necesariamente. Las baterías son opcionales y se utilizan para almacenar energía para su uso durante la noche o en días nublados. Si no tienes baterías, el sistema estará conectado a la red eléctrica."
    },
    {
        question: "¿Puedo instalar paneles solares yo mismo?",
        answer: "Es posible instalar paneles solares tú mismo, pero se recomienda contar con la ayuda de profesionales para garantizar una instalación segura y eficiente. Además, algunas garantías pueden requerir una instalación profesional."
    },
    {
        question: "¿Cuánto tiempo duran los paneles solares?",
        answer: "La mayoría de los paneles solares tienen una vida útil de 25 a 30 años. Sin embargo, su eficiencia puede disminuir con el tiempo."
    },
    {
        question: "¿Qué sucede si hay una falla en el sistema solar?",
        answer: "Si hay una falla en el sistema solar, es importante contactar a un técnico especializado para diagnosticar y reparar el problema. Algunos inversores tienen luces de advertencia que indican fallas."
    },
    {
        question: "¿Los paneles solares requieren mantenimiento?",
        answer: "Sí, los paneles solares requieren un mantenimiento mínimo, como la limpieza periódica y la inspección de conexiones. Es recomendable realizar un mantenimiento regular para garantizar su eficiencia."
    },
    {
        question: "¿Puedo vender el exceso de energía generada?",
        answer: "En muchos lugares, puedes vender el exceso de energía generada a la red eléctrica a través de un programa de medición neta. Esto te permite recibir créditos en tu factura de electricidad."
    }
];

const faqAccordion = document.getElementById('faqAccordion');
faqItems.forEach((item, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.innerHTML = `
        <h2 class="accordion-header">
            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}">
                ${item.question}
            </button>
        </h2>
        <div id="faq${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
                ${item.answer}
            </div>
        </div>
    `;
    faqAccordion.appendChild(accordionItem);
});

// Material Popups
document.addEventListener('DOMContentLoaded', function() {
    const materialItems = document.querySelectorAll('.material-item');
    const popupOverlay = document.querySelector('.popup-overlay');
    const closeButtons = document.querySelectorAll('.close-popup');

    materialItems.forEach(item => {
        item.addEventListener('click', function() {
            const materialType = this.getAttribute('data-material');
            const popup = document.getElementById(`${materialType}-popup`);
            popup.classList.add('active');
            popupOverlay.classList.add('active');
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.material-popup');
            popup.classList.remove('active');
            popupOverlay.classList.remove('active');
        });
    });

    popupOverlay.addEventListener('click', function() {
        document.querySelectorAll('.material-popup').forEach(popup => {
            popup.classList.remove('active');
        });
        this.classList.remove('active');
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Funcionalidad para la página FAQ
document.addEventListener('DOMContentLoaded', function() {
    // Búsqueda de preguntas
    const faqSearch = document.getElementById('faqSearch');
    if (faqSearch) {
        faqSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const questions = document.querySelectorAll('.accordion-item');
            
            questions.forEach(question => {
                const questionText = question.querySelector('.accordion-button').textContent.toLowerCase();
                const answerText = question.querySelector('.accordion-body').textContent.toLowerCase();
                
                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    question.style.display = '';
                } else {
                    question.style.display = 'none';
                }
            });
        });
    }

    // Filtrado por categorías
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remover clase active de todas las tarjetas
                categoryCards.forEach(c => c.classList.remove('active'));
                // Añadir clase active a la tarjeta clickeada
                this.classList.add('active');
                
                const category = this.dataset.category;
                const questions = document.querySelectorAll('.faq-category');
                
                questions.forEach(question => {
                    if (category === 'all' || question.dataset.category === category) {
                        question.style.display = '';
                    } else {
                        question.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Manejo del video de fondo
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.play();
    }
}); 
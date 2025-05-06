// Slideshow
let slideIndex = 0;
const slides = document.querySelectorAll('.slides');

let barraslideIndex = 0;
const barraslides = document.querySelectorAll('.barra-slides');

function showSlides() {
    slides.forEach((slide, index) => {
        slide.style.display = index === slideIndex ? 'block' : 'none';
    });
    slideIndex = (slideIndex + 1) % slides.length;
}

function showBarraSlides() {
    barraslides.forEach((slide, index) => {
        slide.style.display = index === barraslideIndex ? 'block' : 'none';
    });
    barraslideIndex = (barraslideIndex + 1) % barraslides.length;
}

// Iniciar slideshows
setInterval(showBarraSlides, 3000);
setInterval(showSlides, 3000);
showSlides();

// FAQ Accordion
const faqItems = [
    {
        question: "¿Cuánto cuesta instalar paneles solares?",
        answer: "El costo de la instalación de paneles solares varía según el tamaño del sistema, la ubicación y los materiales utilizados. En promedio, el costo puede oscilar entre $10,000 y $30,000."
    }
    // ... add more FAQ items ...
];

const faqAccordion = document.getElementById('faqAccordion');
faqItems.forEach((item, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.innerHTML = `
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}">
                ${item.question}
            </button>
        </h2>
        <div id="faq${index}" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
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
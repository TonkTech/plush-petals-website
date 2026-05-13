// EmailJS Configuration
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with your actual EmailJS public key
})();

// DOM Elements
const placeOrderButtons = document.querySelectorAll('.place-order-btn');
const previewButtons = document.querySelectorAll('.preview-btn');
const productCards = document.querySelectorAll('.product-card');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contact-form');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Place order functionality
    placeOrderButtons.forEach(button => {
        button.addEventListener('click', placeOrder);
    });

    // Preview functionality
    console.log('Preview buttons found:', previewButtons.length);
    previewButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, button);
        button.addEventListener('click', function(e) {
            console.log('Preview button clicked:', e.target);
            openPreview(e);
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function placeOrder(e) {
    const button = e.target;
    const product = button.dataset.product;
    
    // Redirect to contact section with product info
    const contactSection = document.getElementById('contact');
    const contactForm = document.querySelector('.contact-form');
    const messageTextarea = contactForm.querySelector('textarea');
    
    // Pre-fill the message with product information
    messageTextarea.value = `I would like to place an order for: ${product}\n\nPlease let me know more about availability and ordering details.`;
    
    // Smooth scroll to contact section
    contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    showNotification(`Redirecting to order form for: ${product}`);
}


function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const message = formData.get('message');
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Send email using EmailJS
    emailjs.send('service_default', 'template_default', {
        from_name: name,
        from_email: email,
        message: message,
        to_email: 'pamu.niss@gmail.com'
    })
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showNotification('Thank you for your message! We\'ll get back to you soon.');
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, function(error) {
        console.log('FAILED...', error);
        showNotification('Oops! Something went wrong. Please try again or email us directly at pamu.niss@gmail.com');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification with cute pastel theme
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%) scale(0.3);
            opacity: 0;
        }
    }
`;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        notification.style.animation = 'bounceOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function openPreview(e) {
    const button = e.target;
    const assortmentNumber = button.dataset.assortment;
    
    // Open preview page in new tab
    window.open(`preview.html?assortment=${assortmentNumber}`, '_blank');
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .feature, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add hover effect for product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Animations (Intersection Observer)
    const animElements = document.querySelectorAll('.scroll-anim');
    
    // Add visible class immediately to hero elements so they animate on load
    document.querySelectorAll('.hero .fade-in-up').forEach(el => {
        el.classList.add('visible');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animElements.forEach(el => {
        observer.observe(el);
    });

    // Form Validation
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const errorMsg = document.getElementById('formError');
    const successMsg = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (name === '') {
            showError('Please enter your name.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Simulate form submission
        successMsg.style.display = 'block';
        form.reset();
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

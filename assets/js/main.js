//
// --- Anchor Scrolling Fix ---
//

// Function to get the height of the navbar
function getNavbarHeight() {
    const navbar = document.querySelector('.navbar.fixed-top');
    const height = navbar ? navbar.offsetHeight : 0;
    return height;
}

// Function to scroll to an anchor with a vertical offset
function scrollToAnchor(selector, behavior = 'smooth') {
    const target = document.querySelector(selector);
    if (target) {
        // Add a small buffer to the offset so the title isn't flush against the navbar
        const buffer = 20; // 20px buffer for more space
        const yOffset = -getNavbarHeight() - buffer;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: behavior });
    }
}

// Handle anchor scrolling on page load
function handleInitialAnchorScroll() {
    if (window.location.hash) {
        const selector = window.location.hash;
        // The multiple timeouts ensure that scrolling happens correctly
        // even if the page content loads slowly or shifts.
        setTimeout(() => scrollToAnchor(selector, 'auto'), 100);
        setTimeout(() => scrollToAnchor(selector, 'auto'), 500);
    }
}

// Handle clicks on in-page anchor links
function handleAnchorLinkClicks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const selector = this.getAttribute('href');
            if (selector.length > 1) { // Make sure it's not just "#"
                e.preventDefault();
                scrollToAnchor(selector, 'smooth');
                // Update the URL hash without causing a page jump
                if (history.pushState) {
                    history.pushState(null, null, selector);
                } else {
                    window.location.hash = selector;
                }
            }
        });
    });
}

// --- Event Listeners ---

// Run when the initial HTML document has been completely loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    handleAnchorLinkClicks();
});

// Run after the whole page has fully loaded, including all dependent resources
window.addEventListener('load', () => {
    handleInitialAnchorScroll();
});

// Add fade-in animation to cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .section').forEach(el => {
    observer.observe(el);
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-white');
            navbar.classList.add('bg-transparent');
        }
    });
}

// Tooltip initialization
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('btn-loading')) {
            this.classList.add('btn-loading');
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
            
            // Reset after 2 seconds (adjust as needed)
            setTimeout(() => {
                this.classList.remove('btn-loading');
                this.innerHTML = originalText;
            }, 2000);
        }
    });
});

/*
// Typing effect for hero section
const heroTitle = document.querySelector('.hero-section h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid white';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            heroTitle.style.borderRight = 'none';
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}
*/

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to publication cards
document.querySelectorAll('.publication-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    });
});

// Social links hover effect
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add counter animation for statistics (if any)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// Add CSS for loading button state
const style = document.createElement('style');
style.textContent = `
    .btn-loading {
        pointer-events: none;
        opacity: 0.8;
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-in;
    }
    
    @keyframes fadeIn {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
document.head.appendChild(style);

// Prevent default anchor jump and handle scrolling manually
function preventDefaultAnchorJump() {
    // Store the hash before the browser jumps to it
    const hash = window.location.hash;
    if (hash) {
        // Remove the hash temporarily to prevent browser jump
        const url = window.location.href.split('#')[0];
        window.history.replaceState(null, null, url);
        
        // Now handle the scroll manually
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                const navbarHeight = getNavbarHeight();
                const y = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                console.log('[ScrollFix] Manual scroll to', hash, 'at y=', y);
                window.scrollTo({ top: y, behavior: 'auto' });
                
                // Restore the hash in the URL
                window.history.replaceState(null, null, url + hash);
            }
        }, 10);
    }
}

// Run the fix immediately and after page load
preventDefaultAnchorJump();

document.addEventListener('DOMContentLoaded', function() {
    preventDefaultAnchorJump();
});

window.addEventListener('load', function() {
    preventDefaultAnchorJump();
});

// Aggressive scroll fix for research, publications, and talks pages
function aggressiveScrollFix() {
    const hash = window.location.hash;
    if (hash && (hash === '#research' || hash === '#publications' || hash === '#talks')) {
        console.log('[ScrollFix] Aggressive fix for', hash);
        const target = document.querySelector(hash);
        if (target) {
            const navbarHeight = getNavbarHeight();
            const y = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            console.log('[ScrollFix] Scrolling to', hash, 'at y=', y);
            window.scrollTo({ top: y, behavior: 'auto' });
        }
    }
}

// Run aggressive fix immediately and after a short delay
aggressiveScrollFix();
setTimeout(aggressiveScrollFix, 50);
setTimeout(aggressiveScrollFix, 100); 
/**
 * Paid Growth System - Core Interactive Scripts
 * Lightweight, Vanilla JavaScript for accessibility, animations and performance
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mainHeader = document.querySelector('.main-header');
    const scrollProgress = document.getElementById('scrollProgress');
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const revealElements = document.querySelectorAll('.scroll-reveal');

    /* ==========================================================================
       1. Mobile Menu Navigation (Hamburger Toggle)
       ========================================================================== */
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Prevent body scroll when menu is active
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close menu on clicking outside header areas
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                mainNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==========================================================================
       2. Scroll Indicators (Sticky Header & Progress Bar)
       ========================================================================== */
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update Scroll Progress bar
        if (docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Toggle scrolled styling on main header
        if (scrollTop > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Back to Top button visibility
        if (scrollTop > 400) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    /* ==========================================================================
       3. Back to Top Smooth Scrolling
       ========================================================================== */
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       4. Active Navigation Links Highlighting on Scroll (Intersection Observer)
       ========================================================================== */
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies main center viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update active navigation link
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    // Observe all target landing sections
    const targetSections = document.querySelectorAll('section[id]');
    targetSections.forEach(section => sectionObserver.observe(section));

    /* ==========================================================================
       5. Scroll Reveal Animation Trigger (Intersection Observer)
       ========================================================================== */
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters viewport
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once animated to avoid layout computations on scroll
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       6. Fallback/Graceful Degradation for CSS Scroll Behavior
       ========================================================================== */
    // Smooth scrolling click handler for older browsers or specific anchor links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }

                // Scroll to target element offset minus header height
                const headerHeight = mainHeader.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

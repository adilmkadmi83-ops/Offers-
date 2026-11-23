/**
 * Award-Winning Cinematic Experience Scripts
 * Three.js WebGL Background, GSAP Scroll Animations, Custom Cursor, Magnetic Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Detection (Disable heavy WebGL/3D on mobile for 60FPS)
    const isMobile = window.innerWidth <= 768;

    // 2. Custom Magnetic Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!isMobile && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows exactly
            cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
            
            // Outline follows with a slight delay using GSAP for smoothness
            gsap.to(cursorOutline, {
                x: posX,
                y: posY,
                duration: 0.15,
                ease: "power2.out"
            });
        });

        // Magnetic Buttons & Links Hover
        const interactables = document.querySelectorAll('a, button, .problem-card, .deliverable-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
                gsap.to(el, {x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)"});
            });

            // Magnetic Pull for specific primary CTA buttons
            if(el.classList.contains('btn') || el.classList.contains('nav-toggle')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const distanceX = e.clientX - centerX;
                    const distanceY = e.clientY - centerY;
                    
                    // Pull button slightly towards cursor
                    gsap.to(el, {
                        x: distanceX * 0.2,
                        y: distanceY * 0.2,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    // 3. Ultra-Smooth Scrolling & Reveal Physics (GSAP + ScrollTrigger)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Fade & Blur Reveal for Sections
        const revealSections = document.querySelectorAll('section');
        revealSections.forEach((section) => {
            gsap.fromTo(section, 
                { opacity: 0, y: 50, filter: 'blur(10px)' },
                { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Staggered Entrance for Cards
        const cardContainers = [
            { trigger: '.problem-grid', targets: '.problem-card' },
            { trigger: '.deliverables-grid', targets: '.deliverable-card' },
            { trigger: '.steps-timeline', targets: '.step-card' },
            { trigger: '.why-grid', targets: '.why-card' },
            { trigger: '.resp-grid', targets: '.resp-card' },
            { trigger: '.testing-grid', targets: '.test-card-simple' }
        ];

        cardContainers.forEach(group => {
            const triggerEl = document.querySelector(group.trigger);
            const targets = document.querySelectorAll(group.targets);
            
            if(triggerEl && targets.length > 0) {
                gsap.fromTo(targets,
                    { opacity: 0, y: 30, filter: 'blur(5px)' },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: triggerEl,
                            start: 'top 85%',
                        }
                    }
                );
            }
        });

        // 5. Alive Metrics & Animated Counters
        const priceElements = document.querySelectorAll('.price-value, .metric .m-val, .platform-pricing-item span:last-child');
        priceElements.forEach(el => {
            const text = el.innerText;
            const numberMatch = text.match(/(\d+)/);
            if (numberMatch && numberMatch[1]) {
                const originalNum = parseInt(numberMatch[1], 10);
                
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => {
                        let obj = { val: 0 };
                        gsap.to(obj, {
                            val: originalNum,
                            duration: 2,
                            ease: "power2.out",
                            onUpdate: () => {
                                el.innerText = text.replace(numberMatch[1], Math.floor(obj.val));
                            }
                        });
                    }
                });
            }
        });

        // Animate Chart Bars with Stagger and Neon Pulsing
        gsap.fromTo('.bar', 
            { height: '0%' },
            { 
                height: (index, target) => target.style.height || '50%', 
                duration: 1.5, 
                stagger: 0.2, 
                ease: "bounce.out",
                scrollTrigger: {
                    trigger: '.bar-chart',
                    start: 'top 85%'
                }
            }
        );
    }

    // 4. Hyper-Realistic 3D Tilt (VanillaTilt) for all cards
    if (!isMobile && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".problem-card, .deliverable-card, .step-card, .why-card, .resp-card, .test-card-simple, .art-card, .platform-pricing-item"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            perspective: 1000,
            scale: 1.02
        });
    }

    // 6. Interactive WebGL Background (Three.js)
    const initThreeJSBackground = () => {
        const canvas = document.getElementById('webgl-bg');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Particles Cyber Mesh Field
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = isMobile ? 300 : 1200;
        
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2,
            color: '#B38F4D', 
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        const gridHelper = new THREE.GridHelper(100, 40, '#0C3C37', '#0C3C37');
        gridHelper.position.y = -15;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.05;
            mouseY = (event.clientY - windowHalfY) * 0.05;
        });

        let scrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();

            const positions = particlesGeometry.attributes.position.array;
            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const x = particlesGeometry.attributes.position.array[i3];
                positions[i3 + 1] += Math.sin(elapsedTime + x) * 0.01;
            }
            particlesGeometry.attributes.position.needsUpdate = true;

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            particlesMesh.rotation.y += 0.001 + (targetX - particlesMesh.rotation.y) * 0.05;
            particlesMesh.rotation.x += 0.0005 + (targetY - particlesMesh.rotation.x) * 0.05;
            
            camera.position.y = -scrollY * 0.01;

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initThreeJSBackground();
});

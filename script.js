document.addEventListener('DOMContentLoaded', () => {
    // --- GSAP INTRO TIMELINE ---
    const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Set initial states to avoid flash of content
    gsap.set('.avatar-container', { scale: 0.7, opacity: 0, rotate: -15 });
    gsap.set('.profile-info > *', { y: 25, opacity: 0 });
    gsap.set('.bento-card', { y: 45, opacity: 0, rotateX: 12 });
    gsap.set('.profile-footer', { y: 15, opacity: 0 });
    
    introTl
        .to('.avatar-container', { scale: 1, opacity: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' })
        .to('.profile-info > *', { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, '-=0.8')
        .to('.bento-card', { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.08, transformPerspective: 1000 }, '-=0.6')
        .to('.profile-footer', { y: 0, opacity: 1, duration: 0.8 }, '-=0.4');

    // --- CURRENT YEAR FOR FOOTER ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- CAIRO LIVE CLOCK WIDGET ---
    function updateClock() {
        const clockSpan = document.getElementById('clock-time');
        if (!clockSpan) return;
        
        const now = new Date();
        const options = {
            timeZone: 'Africa/Cairo',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        try {
            const cairoTimeStr = now.toLocaleTimeString('en-US', options);
            clockSpan.textContent = cairoTimeStr;
        } catch (e) {
            // Fallback if timeZone isn't supported
            const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            clockSpan.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- INTERACTIVE MOUSE TRACKING BACKGROUND ---
    const meshBg = document.querySelector('.bg-mesh');
    if (meshBg) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            meshBg.style.setProperty('--mouse-x', `${x}%`);
            meshBg.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // --- GSAP MAGNETIC AVATAR EFFECT ---
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        avatarContainer.addEventListener('mousemove', (e) => {
            const rect = avatarContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            gsap.to(avatarContainer, {
                x: x * 0.35,
                y: y * 0.35,
                rotateX: -y * 0.1,
                rotateY: x * 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        avatarContainer.addEventListener('mouseleave', () => {
            gsap.to(avatarContainer, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    }

    // --- GSAP 3D CARD TILT & PARALLAX HOVER ---
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const normalizeX = (x / rect.width) - 0.5;
            const normalizeY = (y / rect.height) - 0.5;
            
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            
            gsap.to(card, {
                rotateY: normalizeX * 15,
                rotateX: -normalizeY * 15,
                transformPerspective: 1000,
                ease: 'power2.out',
                duration: 0.3
            });
            
            const icon = card.querySelector('.card-icon-wrapper');
            const content = card.querySelector('.card-content');
            const arrow = card.querySelector('.card-arrow');
            
            if (icon) gsap.to(icon, { x: normalizeX * 8, y: normalizeY * 8, z: 20, duration: 0.3, ease: 'power2.out' });
            if (content) gsap.to(content, { x: normalizeX * 5, y: normalizeY * 5, z: 12, duration: 0.3, ease: 'power2.out' });
            if (arrow) gsap.to(arrow, { x: normalizeX * 7, y: normalizeY * 7, z: 18, duration: 0.3, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                ease: 'power3.out',
                duration: 0.5
            });
            
            const icon = card.querySelector('.card-icon-wrapper');
            const content = card.querySelector('.card-content');
            const arrow = card.querySelector('.card-arrow');
            
            if (icon) gsap.to(icon, { x: 0, y: 0, z: 0, duration: 0.5, ease: 'power3.out' });
            if (content) gsap.to(content, { x: 0, y: 0, z: 0, duration: 0.5, ease: 'power3.out' });
            if (arrow) gsap.to(arrow, { x: 0, y: 0, z: 0, duration: 0.5, ease: 'power3.out' });
        });
    });

    // --- TYPEWRITER EFFECT ---
    const typingSpan = document.getElementById('typing-text');
    const roles = [
        'Software Engineer',
        'Front-End React Developer',
        'Creative Tech Creator',
        'Problem Solver'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 120;
    let erasingDelay = 60;
    let newTextDelay = 2200;
    let nextWordDelay = 500;

    function type() {
        if (!typingSpan) return;
        const currentRole = roles[roleIndex];
        let delay = typingDelay;

        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            delay = erasingDelay;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            delay = typingDelay;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            delay = newTextDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = nextWordDelay;
        }

        setTimeout(type, delay);
    }
    setTimeout(type, 1200);

    // --- WEB AUDIO SYNTHESIZED SOUND EFFECTS ---
    const soundEnabled = true;
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function triggerHapticTick() {
        if (!soundEnabled) return;
        initAudioContext();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    }

    function triggerHapticPop() {
        if (!soundEnabled) return;
        initAudioContext();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    }

    const clickables = document.querySelectorAll('a, .bento-card');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            triggerHapticTick();
        });
        item.addEventListener('click', () => {
            triggerHapticPop();
        });
    });
});

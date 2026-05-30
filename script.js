document.addEventListener('DOMContentLoaded', () => {
    // --- STAGGER LOAD ANIMATIONS ---
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 80}ms`;
    });
    // Add loaded class to trigger animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // --- CURRENT YEAR FOR FOOTER ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

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
    let typingDelay = 150; // Constant typing speed
    let erasingDelay = 75;  // Constant erasing speed
    let newTextDelay = 2500; // Pause at the end of word
    let nextWordDelay = 600; // Pause before typing next word

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
    // Start typing
    setTimeout(type, 1000);

    // --- WEB AUDIO SYNTHESIZED SOUND EFFECTS ---
    const soundEnabled = true; // Always enabled by default
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Synthesize Mechanical Hover Tick
    function triggerHapticTick() {
        if (!soundEnabled) return;
        initAudioContext();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime); // very subtle
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    }

    // Synthesize Mechanical Click Pop
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

    // Attach sound events to all interactive elements
    const clickables = document.querySelectorAll('a, .link-card');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            triggerHapticTick();
        });
        item.addEventListener('click', () => {
            triggerHapticPop();
        });
    });
});

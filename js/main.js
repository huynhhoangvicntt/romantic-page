// ===== CANCER ROMANTIC PAGE - MAIN JAVASCRIPT =====

class CancerRomanticPage {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupMusicPlayer();
        this.createFloatingElements();
    }

    // ===== INITIALIZATION =====
    init() {
        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 1000);
                }
            }, 2000);
        });

        // Setup intersection observer for scroll animations
        this.setupScrollAnimations();

        // Setup smooth scrolling
        this.setupSmoothScrolling();

        // Setup navigation active states
        this.setupNavigationStates();
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Surprise button
        const surpriseBtn = document.getElementById('surpriseBtn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => this.showSurprise());
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // CTA buttons
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('onclick');
                if (action && action.includes('scrollToSection')) {
                    e.preventDefault();
                    const match = action.match(/scrollToSection\('([^']+)'\)/);
                    if (match) {
                        this.scrollToSection(match[1]);
                    }
                } else if (action && action.includes('playMusic')) {
                    e.preventDefault();
                    this.toggleMusic();
                }
            });
        });

        // Trait cards hover effects
        document.querySelectorAll('.trait-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.animateTraitCard(card));
            card.addEventListener('mouseleave', () => this.resetTraitCard(card));
        });

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('surpriseModal');
            if (modal && modal.classList.contains('active') && e.target === modal) {
                this.closeSurprise();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSurprise();
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    setupSmoothScrolling() {
        // Polyfill for browsers that don't support smooth scrolling
        if (!('scrollBehavior' in document.documentElement.style)) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
            document.head.appendChild(script);
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // ===== NAVIGATION STATES =====
    setupNavigationStates() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');

                    // Update active nav link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.trait-card, .message-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ===== TRAIT CARDS ANIMATIONS =====
    animateTraitCard(card) {
        const icon = card.querySelector('.trait-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }

        // Add water ripple effect
        this.createRippleEffect(card);
    }

    resetTraitCard(card) {
        const icon = card.querySelector('.trait-icon');
        if (icon) {
            icon.style.transform = '';
        }
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(74, 144, 226, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ===== FLOATING ELEMENTS =====
    createFloatingElements() {
        const elements = ['🌙', '⭐', '💫', '🌊', '🐚', '💧'];
        const container = document.querySelector('.floating-elements');

        if (!container) return;

        setInterval(() => {
            if (document.querySelectorAll('.floating-element').length < 10) {
                this.createFloatingElement(container, elements);
            }
        }, 3000);
    }

    createFloatingElement(container, elements) {
        const element = document.createElement('div');
        const emoji = elements[Math.floor(Math.random() * elements.length)];

        element.className = 'floating-element';
        element.textContent = emoji;
        element.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            opacity: ${Math.random() * 0.5 + 0.3};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: 1;
            animation: floatAround ${Math.random() * 10 + 15}s linear infinite;
        `;

        container.appendChild(element);

        // Remove element after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 25000);
    }

    // ===== MUSIC PLAYER =====
    setupMusicPlayer() {
        this.musicPlaying = false;
        this.backgroundMusic = document.getElementById('backgroundMusic');

        // Create a simple romantic melody using Web Audio API as fallback
        this.createAudioContext();
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    toggleMusic() {
        if (!this.musicPlaying) {
            this.playMusic();
        } else {
            this.pauseMusic();
        }
    }

    playMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.play().catch(() => {
                // Fallback to Web Audio API melody
                this.playWebAudioMelody();
            });
        } else {
            this.playWebAudioMelody();
        }
        this.musicPlaying = true;
        this.updateMusicButton('🔇 Tắt nhạc');
    }

    pauseMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        if (this.melodyInterval) {
            clearInterval(this.melodyInterval);
        }
        this.musicPlaying = false;
        this.updateMusicButton('🎵 Phát nhạc');
    }

    updateMusicButton(text) {
        const musicButtons = document.querySelectorAll('.cta-button.secondary');
        musicButtons.forEach(button => {
            const textSpan = button.querySelector('.btn-text');
            if (textSpan) {
                textSpan.textContent = text.split(' ')[1];
            }
        });
    }

    playWebAudioMelody() {
        if (!this.audioContext) return;

        // Romantic melody notes (C major scale)
        const notes = [
            { freq: 261.63, duration: 800 }, // C
            { freq: 293.66, duration: 400 }, // D
            { freq: 329.63, duration: 800 }, // E
            { freq: 293.66, duration: 400 }, // D
            { freq: 261.63, duration: 1200 }, // C
            { freq: 392.00, duration: 600 }, // G
            { freq: 349.23, duration: 600 }, // F
            { freq: 329.63, duration: 1200 }, // E
        ];

        let noteIndex = 0;

        const playNote = () => {
            if (noteIndex >= notes.length) {
                noteIndex = 0; // Loop melody
            }

            const note = notes[noteIndex];
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + note.duration / 1000);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + note.duration / 1000);

            noteIndex++;
        };

        playNote(); // Play first note immediately
        this.melodyInterval = setInterval(playNote, 1000);
    }

    // ===== SURPRISE MODAL =====
    showSurprise() {
        const modal = document.getElementById('surpriseModal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';

            // Trigger hearts explosion animation
            this.triggerHeartsExplosion();

            // Add body class to prevent scrolling
            document.body.style.overflow = 'hidden';

            // Play surprise sound effect
            this.playSurpriseSound();
        }
    }

    closeSurprise() {
        const modal = document.getElementById('surpriseModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);

            // Remove body class to restore scrolling
            document.body.style.overflow = '';
        }
    }

    triggerHeartsExplosion() {
        const hearts = document.querySelectorAll('.hearts-explosion .heart');
        hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.style.animation = 'none';
                setTimeout(() => {
                    heart.style.animation = 'heartExplode 2s ease-out infinite';
                }, 10);
            }, index * 100);
        });
    }

    playSurpriseSound() {
        if (this.audioContext) {
            // Create a bell-like sound for surprise
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }

    // ===== SURPRISE RESPONSES =====
    acceptLove() {
        this.showCelebration();
        setTimeout(() => {
            alert('🎉 Yayyy! Anh yêu em nhiều lắm! 💙💙💙\n\nCảm ơn em đã đồng ý! Anh sẽ yêu thương và che chở em mãi mãi như cách mặt trăng che chở đại dương! 🌙🌊');
            this.closeSurprise();
            this.createMassiveHeartRain();
        }, 1000);
    }

    needTime() {
        alert('💙 Không sao em ạ, anh hiểu mà! \n\nGiống như thủy triều cần thời gian để lên xuống, tình yêu cũng cần thời gian để thấm sâu vào trái tim. Anh sẽ kiên nhẫn chờ đợi! 🌊⏰');
        this.closeSurprise();
        this.createGentleWaterEffect();
    }

    showCelebration() {
        // Create fireworks effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFirework();
            }, i * 100);
        }

        // Play celebration sound
        this.playCelebrationSound();
    }

    createFirework() {
        const colors = ['#4A90E2', '#7BB3F0', '#2E8B57', '#008B8B', '#FFB6C1'];
        const firework = document.createElement('div');

        firework.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            animation: fireworkExplode 1s ease-out forwards;
        `;

        document.body.appendChild(firework);

        setTimeout(() => {
            firework.remove();
        }, 1000);
    }

    playCelebrationSound() {
        if (this.audioContext) {
            // Create celebration chord
            const frequencies = [261.63, 329.63, 392.00, 523.25]; // C major chord

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'sine';

                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);

                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 1.5);
                }, index * 100);
            });
        }
    }

    createMassiveHeartRain() {
        const heartEmojis = ['💙', '💖', '💕', '💗', '💝', '💘'];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

                heart.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 30 + 20}px;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -50px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: heartFall ${Math.random() * 3 + 4}s linear forwards;
                `;

                document.body.appendChild(heart);

                setTimeout(() => {
                    heart.remove();
                }, 7000);
            }, i * 100);
        }
    }

    createGentleWaterEffect() {
        const waterEmojis = ['💧', '🌊', '💙', '🌙'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const water = document.createElement('div');
                water.textContent = waterEmojis[Math.floor(Math.random() * waterEmojis.length)];

                water.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 25 + 15}px;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -50px;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0.7;
                    animation: gentleWaterFall ${Math.random() * 2 + 5}s ease-in-out forwards;
                `;

                document.body.appendChild(water);

                setTimeout(() => {
                    water.remove();
                }, 7000);
            }, i * 200);
        }
    }

    // ===== ZODIAC SPECIAL EFFECTS =====
    createMoonPhaseEffect() {
        const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
        let phaseIndex = 0;

        const moonElement = document.querySelector('.moon.full-moon');
        if (moonElement) {
            setInterval(() => {
                moonElement.textContent = moonPhases[phaseIndex];
                phaseIndex = (phaseIndex + 1) % moonPhases.length;
            }, 2000);
        }
    }

    createTidalEffect() {
        const waterDrops = document.querySelectorAll('.water-drop');

        waterDrops.forEach((drop, index) => {
            setInterval(() => {
                drop.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 10}px)`;
            }, 100);
        });
    }

    // ===== CANCER PERSONALITY TRAITS =====
    initializeCancerTraits() {
        const traits = {
            caring: {
                message: "Sự quan tâm của em như ánh trăng dịu dàng, luôn soi sáng cho những người xung quanh",
                color: "#FFB6C1"
            },
            intuitive: {
                message: "Trực giác nhạy bén giúp em hiểu được cảm xúc sâu thẳm nhất của mọi người",
                color: "#E6E6FA"
            },
            loyal: {
                message: "Lòng trung thành của em như đại dương - sâu thẳm và bất tận",
                color: "#4A90E2"
            },
            emotional: {
                message: "Cảm xúc phong phú khiến em trở nên chân thực và đáng yêu biết bao",
                color: "#7BB3F0"
            },
            protective: {
                message: "Em bảo vệ những người yêu thương như con cua bảo vệ chiếc vỏ mềm mại",
                color: "#2E8B57"
            },
            creative: {
                message: "Trí tưởng tượng phong phú giúp em nhìn thế giới qua lăng kính đặc biệt",
                color: "#008B8B"
            }
        };

        document.querySelectorAll('.trait-card').forEach(card => {
            const traitType = card.getAttribute('data-trait');
            if (traits[traitType]) {
                card.addEventListener('click', () => {
                    this.showTraitMessage(traits[traitType]);
                });
            }
        });
    }

    showTraitMessage(trait) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 400px;
            text-align: center;
            border-left: 5px solid ${trait.color};
            animation: notificationSlide 0.5s ease-out;
        `;

        notification.innerHTML = `
            <p style="font-size: 1.1rem; color: #1E3A8A; line-height: 1.6; margin: 0;">
                ${trait.message}
            </p>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.5s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== ACCESSIBILITY =====
    setupAccessibility() {
        // Add keyboard navigation for interactive elements
        document.querySelectorAll('.trait-card, .surprise-button').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // Add ARIA labels
        document.querySelectorAll('.trait-card').forEach((card, index) => {
            card.setAttribute('aria-label', `Trait card ${index + 1}`);
            card.setAttribute('role', 'button');
        });

        // Reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-smooth', 'none');
            document.documentElement.style.setProperty('--transition-gentle', 'none');
        }
    }

    // ===== INITIALIZATION METHOD =====
    initializeAll() {
        this.createMoonPhaseEffect();
        this.createTidalEffect();
        this.initializeCancerTraits();
        this.setupAccessibility();

        // Add dynamic CSS animations
        this.addDynamicStyles();
    }

    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fireworkExplode {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(0); opacity: 0; }
            }
            
            @keyframes heartFall {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            
            @keyframes gentleWaterFall {
                0% { transform: translateY(-50px); opacity: 0.7; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
            
            @keyframes floatAround {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(50px, -30px) rotate(90deg); }
                50% { transform: translate(-20px, -60px) rotate(180deg); }
                75% { transform: translate(-50px, -30px) rotate(270deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
            }
            
            @keyframes notificationSlide {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            
            @keyframes notificationSlideOut {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            }
            
            @keyframes ripple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK EVENTS =====
function scrollToSection(sectionId) {
    if (window.cancerPage) {
        window.cancerPage.scrollToSection(sectionId);
    }
}

function playMusic() {
    if (window.cancerPage) {
        window.cancerPage.toggleMusic();
    }
}

function closeSurprise() {
    if (window.cancerPage) {
        window.cancerPage.closeSurprise();
    }
}

function acceptLove() {
    if (window.cancerPage) {
        window.cancerPage.acceptLove();
    }
}

function needTime() {
    if (window.cancerPage) {
        window.cancerPage.needTime();
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.cancerPage = new CancerRomanticPage();
    window.cancerPage.initializeAll();
});

// ===== SERVICE WORKER REGISTRATION (FOR PWA SUPPORT) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

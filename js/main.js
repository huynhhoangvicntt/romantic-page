// ===== CANCER ROMANTIC PAGE - MAIN JAVASCRIPT =====

// Prevent duplicate class declaration
if (typeof window.CancerRomanticPage !== 'undefined') {
    delete window.CancerRomanticPage;
}

window.CancerRomanticPage = class CancerRomanticPage {
    constructor() {
        this.musicPlaying = false;
        this.audioContext = null;
        this.melodyInterval = null;
        this.backgroundMusic = null;
        this.userInteracted = false;
        this.musicStarted = false;
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPage());
        } else {
            this.setupPage();
        }
    }

    setupPage() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupMusicPlayer();
        this.createFloatingElements();
        this.initializeCancerEffects();
    }

    // ===== LOADING SCREEN =====
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Don't attempt autoplay here - wait for user interaction
                    this.showMusicStatus('🎵 Click để bắt đầu nhạc...');
                }, 1000);
            }, 2000);
        }
    }

    // ===== MUSIC SETUP =====
    setupMusicPlayer() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.createAudioContext();

        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;

            // Set up event listeners
            this.backgroundMusic.addEventListener('loadeddata', () => {
                console.log('Music file loaded successfully');
                this.showMusicStatus('🎵 Nhạc đã sẵn sàng - Click để phát');
            });

            this.backgroundMusic.addEventListener('error', (e) => {
                console.log('Music file not found, Web Audio fallback ready');
                this.showMusicStatus('🎵 Click để phát nhạc');
            });

            this.backgroundMusic.addEventListener('ended', () => {
                if (this.musicPlaying) {
                    this.backgroundMusic.currentTime = 0;
                    this.backgroundMusic.play().catch(() => {
                        // Fallback if replay fails
                        this.useWebAudioFallback();
                    });
                }
            });
        }
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    attemptAutoplay() {
        // Only attempt if user has interacted
        if (!this.userInteracted || this.musicStarted) {
            return;
        }

        this.musicStarted = true;

        if (this.backgroundMusic && !this.musicPlaying) {
            // Unmute the audio first
            this.backgroundMusic.muted = false;

            this.backgroundMusic.play()
                .then(() => {
                    this.musicPlaying = true;
                    this.updateMusicButton('🔇');
                    this.showMusicStatus('🎵 Nhạc nền đang phát...');
                    console.log('Background music started successfully');
                })
                .catch((error) => {
                    console.log('File music failed, using Web Audio:', error.message);
                    this.useWebAudioFallback();
                });
        } else if (!this.backgroundMusic) {
            this.useWebAudioFallback();
        }
    }

    useWebAudioFallback() {
        if (!this.userInteracted) {
            this.showMusicStatus('🎵 Click để bắt đầu nhạc...');
            return;
        }

        this.playWebAudioMelody();
        this.musicPlaying = true;
        this.musicStarted = true;
        this.updateMusicButton('🔇');
        this.showMusicStatus('🎵 Giai điệu lãng mạn...');
    }

    playWebAudioMelody() {
        if (!this.audioContext) return;

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const melody = [
            { freq: 261.63, duration: 600 }, // C
            { freq: 293.66, duration: 400 }, // D
            { freq: 329.63, duration: 800 }, // E
            { freq: 293.66, duration: 400 }, // D
            { freq: 261.63, duration: 900 }, // C
            { freq: 0, duration: 300 }, // Rest
            { freq: 392.00, duration: 600 }, // G
            { freq: 349.23, duration: 600 }, // F
            { freq: 329.63, duration: 1200 } // E
        ];

        let noteIndex = 0;
        const playNote = () => {
            if (!this.musicPlaying) return; // Stop if music is paused

            if (noteIndex >= melody.length) noteIndex = 0;

            const note = melody[noteIndex];
            if (note.freq > 0) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + note.duration / 1000);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + note.duration / 1000);
            }
            noteIndex++;
        };

        if (this.melodyInterval) clearInterval(this.melodyInterval);
        playNote();
        this.melodyInterval = setInterval(playNote, 500);
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    playMusic() {
        // Mark user interaction
        this.userInteracted = true;

        if (this.backgroundMusic && !this.musicStarted) {
            this.backgroundMusic.muted = false;
            this.backgroundMusic.play()
                .then(() => {
                    this.musicPlaying = true;
                    this.musicStarted = true;
                    this.updateMusicButton('🔇');
                    this.showMusicStatus('🎵 Nhạc nền đang phát...');
                })
                .catch((error) => {
                    console.log('Background music failed:', error.message);
                    this.useWebAudioFallback();
                });
        } else if (!this.musicStarted) {
            this.useWebAudioFallback();
        } else {
            // Resume existing music
            if (this.backgroundMusic) {
                this.backgroundMusic.play().catch(() => {
                    this.useWebAudioFallback();
                });
            } else {
                this.playWebAudioMelody();
            }
            this.musicPlaying = true;
            this.updateMusicButton('🔇');
            this.showMusicStatus('🎵 Nhạc đang phát...');
        }
    }

    pauseMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        if (this.melodyInterval) {
            clearInterval(this.melodyInterval);
        }

        this.musicPlaying = false;
        this.updateMusicButton('🎵');
        this.showMusicStatus('🔇 Nhạc đã tắt');
    }

    updateMusicButton(icon) {
        const musicBtn = document.getElementById('musicToggle');
        if (musicBtn) {
            const iconElement = musicBtn.querySelector('.music-icon');
            if (iconElement) iconElement.textContent = icon;
            musicBtn.classList.toggle('paused', !this.musicPlaying);
        }
    }

    showMusicStatus(text) {
        const statusElement = document.querySelector('.music-status-text') || document.getElementById('musicStatus');
        if (statusElement) {
            statusElement.textContent = text;
            statusElement.style.opacity = '0';
            setTimeout(() => statusElement.style.opacity = '1', 100);
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Surprise button
        const surpriseBtn = document.getElementById('surpriseBtn');
        if (surpriseBtn) surpriseBtn.addEventListener('click', () => this.showSurprise());

        // Music toggle
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) musicToggle.addEventListener('click', () => this.toggleMusic());

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Trait cards
        document.querySelectorAll('.trait-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.animateTraitCard(card));
            card.addEventListener('mouseleave', () => this.resetTraitCard(card));
            card.addEventListener('click', () => this.showTraitMessage(card));
        });

        // Close modal
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('surpriseModal');
            if (modal && modal.classList.contains('active') && e.target.classList.contains('modal-overlay')) {
                this.closeSurprise();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSurprise();
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                this.toggleMusic();
            }
        });

        // User interaction detection - only set flag, don't auto-start music
        const markUserInteraction = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                this.showMusicStatus('🎵 Click nút nhạc để phát');
            }
        };

        document.addEventListener('click', markUserInteraction, { once: true });
        document.addEventListener('touchstart', markUserInteraction, { once: true });
        document.addEventListener('keydown', markUserInteraction, { once: true });
    }

    // ===== NAVIGATION =====
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.trait-card, .message-card');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('visible'));
        }
    }

    // ===== TRAIT CARDS =====
    animateTraitCard(card) {
        const icon = card.querySelector('.trait-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
        this.createRippleEffect(card);
    }

    resetTraitCard(card) {
        const icon = card.querySelector('.trait-icon');
        if (icon) icon.style.transform = '';
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
            z-index: 1;
        `;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 600);
    }

    showTraitMessage(card) {
        const title = card.querySelector('.trait-title').textContent;
        const messages = {
            'Quan Tâm': 'Sự quan tâm của em như ánh trăng dịu dàng 🌙',
            'Trực Giác': 'Trực giác nhạy bén hiểu được cảm xúc sâu thẳm 🔮',
            'Trung Thành': 'Lòng trung thành như đại dương bất tận 💙',
            'Cảm Xúc Phong Phú': 'Cảm xúc phong phú làm em chân thực 🌊',
            'Bảo Vệ': 'Em bảo vệ người yêu như con cua 🛡️',
            'Sáng Tạo': 'Trí tưởng tượng phong phú đặc biệt 🎨'
        };

        const message = messages[title] || 'Đặc điểm tuyệt vời của Cancer 💙';
        this.showNotification(message);
    }

    showNotification(message) {
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
            border-left: 5px solid #4A90E2;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        notification.innerHTML = `<p style="font-size: 1.1rem; color: #1E3A8A; margin: 0;">${message}</p>`;
        document.body.appendChild(notification);

        setTimeout(() => notification.style.opacity = '1', 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // ===== FLOATING ELEMENTS =====
    createFloatingElements() {
        const elements = ['🌙', '⭐', '💫', '🌊', '💧'];
        const container = document.querySelector('.floating-elements');
        if (!container) return;

        setInterval(() => {
            if (document.querySelectorAll('.floating-element').length < 6) {
                this.createFloatingElement(container, elements);
            }
        }, 4000);
    }

    createFloatingElement(container, elements) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
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
        setTimeout(() => {
            if (element.parentNode) element.parentNode.removeChild(element);
        }, 25000);
    }

    // ===== SURPRISE MODAL =====
    showSurprise() {
        const modal = document.getElementById('surpriseModal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            this.triggerHeartsExplosion();
            document.body.style.overflow = 'hidden';
            this.playSurpriseSound();
        }
    }

    closeSurprise() {
        const modal = document.getElementById('surpriseModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
            document.body.style.overflow = '';
        }
    }

    triggerHeartsExplosion() {
        const hearts = document.querySelectorAll('.hearts-explosion .heart');
        hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.style.animation = 'none';
                setTimeout(() => heart.style.animation = 'heartExplode 2s ease-out infinite', 10);
            }, index * 100);
        });
    }

    playSurpriseSound() {
        if (this.audioContext) {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }

    // ===== SURPRISE RESPONSES =====
    acceptLove() {
        this.showCelebration();
        setTimeout(() => {
            alert('🎉 Yayyy! Anh yêu em nhiều lắm! 💙💙💙\n\nAnh sẽ yêu thương và che chở em mãi mãi như mặt trăng che chở đại dương! 🌙🌊');
            this.closeSurprise();
            this.createHeartRain();
        }, 1000);
    }

    needTime() {
        alert('💙 Không sao em ạ! Như thủy triều cần thời gian, tình yêu cũng cần thời gian để thấm sâu. Anh sẽ kiên nhẫn chờ đợi! 🌊⏰');
        this.closeSurprise();
        this.createWaterEffect();
    }

    showCelebration() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => this.createFirework(), i * 100);
        }
    }

    createFirework() {
        const colors = ['#4A90E2', '#7BB3F0', '#2E8B57', '#FFB6C1'];
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
            if (firework.parentNode) firework.parentNode.removeChild(firework);
        }, 1000);
    }

    createHeartRain() {
        const heartEmojis = ['💙', '💖', '💕', '💗', '💝'];
        for (let i = 0; i < 30; i++) {
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
                    if (heart.parentNode) heart.parentNode.removeChild(heart);
                }, 7000);
            }, i * 100);
        }
    }

    createWaterEffect() {
        const waterEmojis = ['💧', '🌊', '💙', '🌙'];
        for (let i = 0; i < 15; i++) {
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
                    animation: gentleWaterFall ${Math.random() * 2 + 5}s ease-out forwards;
                `;

                document.body.appendChild(water);
                setTimeout(() => {
                    if (water.parentNode) water.parentNode.removeChild(water);
                }, 7000);
            }, i * 200);
        }
    }

    // ===== CANCER EFFECTS =====
    initializeCancerEffects() {
        this.createMoonPhaseEffect();
        this.createTidalEffect();
        this.addDynamicStyles();
    }

    createMoonPhaseEffect() {
        const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
        let phaseIndex = 0;

        const moonElement = document.querySelector('.moon.full-moon');
        if (moonElement) {
            setInterval(() => {
                moonElement.textContent = moonPhases[phaseIndex];
                phaseIndex = (phaseIndex + 1) % moonPhases.length;
            }, 3000);
        }
    }

    createTidalEffect() {
        const waterDrops = document.querySelectorAll('.water-drop');
        waterDrops.forEach((drop, index) => {
            setInterval(() => {
                const tidalForce = Math.sin(Date.now() / 1000 + index) * 8;
                drop.style.transform = `translateY(${tidalForce}px)`;
            }, 100);
        });
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
                25% { transform: translate(30px, -20px) rotate(90deg); }
                50% { transform: translate(-15px, -40px) rotate(180deg); }
                75% { transform: translate(-30px, -20px) rotate(270deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
            }
            @keyframes ripple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== GLOBAL FUNCTIONS =====
function scrollToSection(sectionId) {
    if (window.cancerPage) window.cancerPage.scrollToSection(sectionId);
}

function playMusic() {
    if (window.cancerPage) window.cancerPage.toggleMusic();
}

function closeSurprise() {
    if (window.cancerPage) window.cancerPage.closeSurprise();
}

function acceptLove() {
    if (window.cancerPage) window.cancerPage.acceptLove();
}

function needTime() {
    if (window.cancerPage) window.cancerPage.needTime();
}

// Global function for HTML onclick
function startMusic() {
    if (window.cancerPage) {
        window.cancerPage.userInteracted = true;
        window.cancerPage.attemptAutoplay();

        // Remove trigger overlay
        const trigger = document.getElementById('musicTrigger');
        if (trigger) trigger.style.display = 'none';
    }
}

// ===== INITIALIZE =====
// Prevent duplicate initialization
if (window.cancerPage) {
    // Clean up existing instance
    if (window.cancerPage.melodyInterval) clearInterval(window.cancerPage.melodyInterval);
    if (window.cancerPage.backgroundMusic) window.cancerPage.backgroundMusic.pause();
    if (window.cancerPage.audioContext) window.cancerPage.audioContext.close();
    delete window.cancerPage;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.cancerPage) {
        window.cancerPage = new window.CancerRomanticPage();
    }
});

// Fallback initialization
if (document.readyState !== 'loading' && !window.cancerPage) {
    window.cancerPage = new window.CancerRomanticPage();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.cancerPage) {
        if (window.cancerPage.melodyInterval) clearInterval(window.cancerPage.melodyInterval);
        if (window.cancerPage.backgroundMusic) window.cancerPage.backgroundMusic.pause();
        if (window.cancerPage.audioContext) window.cancerPage.audioContext.close();
    }
});

let currentPage = 1;
const totalPages = 7;
let musicPlaying = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📖 Compact handwritten book loaded for iPhone 15!');
    initializeAudio();
    updateNavigation();
    addHandwritingEffects();
    optimizeForMobile();
});

function optimizeForMobile() {
    const isIPhone15 = /iPhone.*OS 17/.test(navigator.userAgent) ||
                       window.screen.height >= 852; // iPhone 15 and larger

    if (isIPhone15) {
        console.log('📱 iPhone 15 detected - applying optimizations');
        document.body.classList.add('iphone-15');

        addTouchOptimizations();
    }

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

function addTouchOptimizations() {
    const buttons = document.querySelectorAll('button, .page');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }

            this.style.transform = this.style.transform + ' scale(0.98)';
        });

        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = this.style.transform.replace(' scale(0.98)', '');
            }, 100);
        });
    });
}

function initializeAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    if (!bgMusic || !musicToggle) {
        console.error('❌ Audio elements not found');
        return;
    }

    bgMusic.volume = 0.2;

    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
            musicToggle.classList.remove('muted');
            console.log('🎵 Music started');
        }).catch(error => {
            musicPlaying = false;
            musicToggle.textContent = '🔇';
            musicToggle.classList.add('muted');
            console.log('🔇 Auto-play blocked (expected on mobile)');
            showMusicNotification();
        });
    }
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    if (!bgMusic || !musicToggle) return;

    if (musicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
        musicPlaying = false;
        console.log('🔇 Music paused');
    } else {
        bgMusic.play().then(() => {
            musicToggle.textContent = '🔊';
            musicToggle.classList.remove('muted');
            musicPlaying = true;
            console.log('🎵 Music playing');
        }).catch(error => {
            console.log('❌ Could not play music');
        });
    }
}

function showMusicNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 15px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-family: 'Patrick Hand', cursive;
        z-index: 1001;
        cursor: pointer;
        transition: all 0.3s ease;
        transform: rotate(-1deg);
        max-width: 200px;
    `;
    notification.innerHTML = '🎵 Chạm để bật nhạc! 💕';

    notification.addEventListener('click', function() {
        toggleMusic();
        notification.remove();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

function addHandwritingEffects() {
    const lines = document.querySelectorAll('.line');

    lines.forEach((line, index) => {
        const randomRotation = (Math.random() - 0.5) * 0.8; // Smaller rotation for mobile
        line.style.transform = `rotate(${randomRotation}deg)`;

        const randomOffset = (Math.random() - 0.5) * 1;
        line.style.marginLeft = `${randomOffset}px`;

        line.style.animationDelay = `${index * 0.05}s`;
    });
}

function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#eb4d4b', '#6c5ce7'];

    console.log('🎆 Creating mobile-optimized fireworks!');

    for (let burst = 0; burst < 3; burst++) {
        setTimeout(() => {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * (window.innerHeight * 0.5) + 100;

            for (let i = 0; i < 8; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = centerX + 'px';
                firework.style.top = centerY + 'px';
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

                const angle = (i / 8) * 2 * Math.PI;
                const distance = 30 + Math.random() * 40; // Smaller explosion radius
                const finalX = centerX + Math.cos(angle) * distance;
                const finalY = centerY + Math.sin(angle) * distance;

                firework.style.setProperty('--final-x', finalX + 'px');
                firework.style.setProperty('--final-y', finalY + 'px');

                fireworksContainer.appendChild(firework);

                setTimeout(() => {
                    if (firework.parentNode) {
                        firework.parentNode.removeChild(firework);
                    }
                }, 1000);
            }
        }, burst * 300);
    }
}

function createFallingLanterns() {
    const lanternsContainer = document.getElementById('falling-lanterns');
    const lanternEmojis = ['🏮', '🎋', '🥮', '🌙', '✨'];

    console.log('🏮 Creating mobile-optimized falling lanterns!');

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const lantern = document.createElement('div');
            lantern.className = 'falling-lantern';
            lantern.textContent = lanternEmojis[Math.floor(Math.random() * lanternEmojis.length)];
            lantern.style.left = Math.random() * window.innerWidth + 'px';
            lantern.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
            lantern.style.animationDelay = Math.random() * 0.3 + 's';

            lanternsContainer.appendChild(lantern);

            setTimeout(() => {
                if (lantern.parentNode) {
                    lantern.parentNode.removeChild(lantern);
                }
            }, 3500);
        }, i * 150);
    }
}

function nextPage() {
    if (currentPage >= totalPages) {
        console.log('📖 Already at the last page');
        return;
    }

    const currentPageEl = document.querySelector(`[data-page="${currentPage}"]`);
    if (currentPageEl) {
        playPageFlipSound();
        currentPageEl.classList.add('flipped');
        console.log(`📖 Flipped page ${currentPage} -> ${currentPage + 1}`);
    }

    currentPage++;

    const nextPageEl = document.querySelector(`[data-page="${currentPage}"]`);
    if (nextPageEl) {
        nextPageEl.style.display = 'block';
        nextPageEl.style.zIndex = '10';
    }

    if (currentPage > 1) {
        const book = document.querySelector('.compact-book');
        const bookWrapper = document.querySelector('.book-wrapper');
        const container = document.querySelector('.container');

        book.classList.add('has-flipped-pages');
        bookWrapper.classList.add('has-flipped');
        container.classList.add('has-flipped');

        if (window.innerWidth <= 430) {
            console.log('📱 Applied mobile dual-page positioning');
        } else {
            console.log('🖥️ Applied desktop dual-page centering');
        }
    }

    updateNavigation();
}

function prevPage() {
    if (currentPage <= 1) {
        console.log('📖 Already at the first page');
        return;
    }

    const currentPageEl = document.querySelector(`[data-page="${currentPage}"]`);
    if (currentPageEl) {
        currentPageEl.style.display = 'none';
    }

    currentPage--;

    const pageToUnflip = document.querySelector(`[data-page="${currentPage}"]`);
    if (pageToUnflip) {
        playPageFlipSound();
        pageToUnflip.classList.remove('flipped');
        pageToUnflip.style.display = 'block';
        pageToUnflip.style.zIndex = '10';
        console.log(`📖 Unflipped page ${currentPage} (going back to page ${currentPage})`);
    }

    if (currentPage === 1) {
        const book = document.querySelector('.compact-book');
        const bookWrapper = document.querySelector('.book-wrapper');
        const container = document.querySelector('.container');

        book.classList.remove('has-flipped-pages');
        bookWrapper.classList.remove('has-flipped');
        container.classList.remove('has-flipped');

        if (window.innerWidth <= 430) {
            console.log('📱 Restored mobile single-page positioning');
        } else {
            console.log('🖥️ Restored desktop centering');
        }
    }

    updateNavigation();
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');

    if (prevBtn && nextBtn && pageIndicator) {
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
        pageIndicator.textContent = `${currentPage}/${totalPages}`;

        prevBtn.setAttribute('aria-label', currentPage <= 1 ? 'Trang đầu' : 'Trang trước');
        nextBtn.setAttribute('aria-label', currentPage >= totalPages ? 'Trang cuối' : 'Trang sau');
    }
}

function playPageFlipSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); // Quieter
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('📄 Page flip (silent mode)');
    }
}

function showAnswer1() {
    console.log('🎉 Answer 1 - Creating mobile effects!');

    addInkSpreadEffect();
    createFireworks();
    animateButtons();

    setTimeout(() => {
        nextPage();
    }, 1500);
}

function showAnswer2() {
    console.log('💖 Answer 2 - Creating romantic mobile effects!');

    addHeartEffect();
    createFallingLanterns();
    animateButtons();

    setTimeout(() => {
        nextPage();
    }, 1500);
}

function showFinalAnswer() {
    console.log('🌟 Final answer - Creating ultimate mobile effects!');

    addStarEffect();
    createFireworks();
    setTimeout(() => createFallingLanterns(), 300);
    animateButtons();

    setTimeout(() => {
        nextPage();
    }, 1800);
}

function addInkSpreadEffect() {
    const currentPageEl = document.querySelector(`[data-page="${currentPage}"]`);
    if (!currentPageEl) return;

    const inkDot = document.createElement('div');
    inkDot.style.cssText = `
        position: absolute;
        top: 45%;
        left: 55%;
        width: 3px;
        height: 3px;
        background: rgba(0, 100, 200, 0.4);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: inkSpreadMobile 0.8s ease-out;
        pointer-events: none;
        z-index: 10;
    `;

    if (!document.getElementById('mobile-ink-style')) {
        const style = document.createElement('style');
        style.id = 'mobile-ink-style';
        style.textContent = `
            @keyframes inkSpreadMobile {
                0% { width: 3px; height: 3px; opacity: 0.8; }
                100% { width: 25px; height: 25px; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    currentPageEl.appendChild(inkDot);

    setTimeout(() => {
        if (inkDot.parentNode) {
            inkDot.parentNode.removeChild(inkDot);
        }
    }, 800);
}

function addHeartEffect() {
    const currentPageEl = document.querySelector(`[data-page="${currentPage}"]`);
    if (!currentPageEl) return;

    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.cssText = `
        position: absolute;
        top: 25%;
        right: 15%;
        font-size: 0px;
        animation: heartDrawMobile 1s ease-out;
        pointer-events: none;
        z-index: 10;
    `;

    if (!document.getElementById('mobile-heart-style')) {
        const style = document.createElement('style');
        style.id = 'mobile-heart-style';
        style.textContent = `
            @keyframes heartDrawMobile {
                0% { font-size: 0px; transform: rotate(-90deg) scale(0); opacity: 0; }
                50% { font-size: 14px; transform: rotate(-45deg) scale(1.1); opacity: 0.8; }
                100% { font-size: 16px; transform: rotate(0deg) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    currentPageEl.appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 1200);
}

function addStarEffect() {
    const currentPageEl = document.querySelector(`[data-page="${currentPage}"]`);
    if (!currentPageEl) return;

    const stars = ['✨', '🌟', '⭐'];

    stars.forEach((starEmoji, i) => {
        setTimeout(() => {
            const star = document.createElement('div');
            star.innerHTML = starEmoji;
            star.style.cssText = `
                position: absolute;
                top: ${15 + i * 12}%;
                left: ${20 + i * 15}%;
                font-size: 0px;
                animation: starDrawMobile 0.8s ease-out;
                animation-fill-mode: both;
                pointer-events: none;
                z-index: 10;
            `;

            currentPageEl.appendChild(star);

            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 1000);
        }, i * 150);
    });

    if (!document.getElementById('mobile-star-style')) {
        const style = document.createElement('style');
        style.id = 'mobile-star-style';
        style.textContent = `
            @keyframes starDrawMobile {
                0% { font-size: 0px; transform: rotate(90deg) scale(0); opacity: 0; }
                70% { font-size: 12px; transform: rotate(5deg) scale(1.2); opacity: 0.9; }
                100% { font-size: 10px; transform: rotate(0deg) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function animateButtons() {
    const buttons = document.querySelectorAll(`[data-page="${currentPage}"] .answer-btn`);
    buttons.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.animation = 'buttonGlowMobile 0.4s ease-out';
        }, index * 80);
    });

    if (!document.getElementById('mobile-button-style')) {
        const style = document.createElement('style');
        style.id = 'mobile-button-style';
        style.textContent = `
            @keyframes buttonGlowMobile {
                0% { box-shadow: 0 0 0 rgba(102, 126, 234, 0); }
                50% { box-shadow: 0 0 15px rgba(102, 126, 234, 0.5); }
                100% { box-shadow: 0 0 0 rgba(102, 126, 234, 0); }
            }
        `;
        document.head.appendChild(style);
    }
}

function restart() {
    console.log('🔄 Restarting compact book');

    const book = document.querySelector('.compact-book');
    const bookWrapper = document.querySelector('.book-wrapper');
    const container = document.querySelector('.container');

    if (book && bookWrapper && container) {
        book.classList.remove('has-flipped-pages');
        bookWrapper.classList.remove('has-flipped');
        container.classList.remove('has-flipped');

        if (window.innerWidth <= 430) {
            console.log('📱 Removed mobile positioning classes');
        } else {
            console.log('🖥️ Removed desktop positioning classes');
        }
    }

    const allPages = document.querySelectorAll('.page');
    allPages.forEach((page) => {
        page.classList.remove('flipped');
        page.style.display = 'none';
    });

    const firstPage = document.querySelector('[data-page="1"]');
    if (firstPage) {
        firstPage.style.display = 'block';
        firstPage.style.zIndex = '10';
    }

    currentPage = 1;
    updateNavigation();

    console.log('📖 Reset to page 1 - All states cleared');

    setTimeout(() => {
        if (book) {
            book.style.animation = 'welcomeBackGentle 0.6s ease-out';
            setTimeout(() => {
                book.style.animation = '';
            }, 600);
        }
    }, 100);
}

if (!document.getElementById('welcome-back-gentle-style')) {
    const style = document.createElement('style');
    style.id = 'welcome-back-gentle-style';
    style.textContent = `
        @keyframes welcomeBackGentle {
            0% { 
                transform: scale(0.98); 
                opacity: 0.9; 
            }
            50% { 
                transform: scale(1.01); 
                opacity: 0.95; 
            }
            100% { 
                transform: scale(1); 
                opacity: 1; 
            }
        }
    `;
    document.head.appendChild(style);
}

function addWelcomeBackEffect() {
    const firstPage = document.querySelector('[data-page="1"]');
    const book = document.querySelector('.compact-book');

    if (firstPage && book) {
        book.style.animation = 'welcomeBackMobile 0.8s ease-out';

        if (!document.getElementById('welcome-back-style')) {
            const style = document.createElement('style');
            style.id = 'welcome-back-style';
            style.textContent = `
                @keyframes welcomeBackMobile {
                    0% { transform: scale(0.96); opacity: 0.8; }
                    50% { transform: scale(1.01); opacity: 0.95; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            book.style.animation = '';
        }, 800);
    }
}

function optimizePerformance() {
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 ||
                          navigator.deviceMemory <= 4;

    if (isLowEndDevice) {
        console.log('📱 Low-end device detected - reducing animations');
        document.body.classList.add('reduced-motion');

        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.5s !important;
                transition-duration: 0.2s !important;
            }
            .reduced-motion .sparkle,
            .reduced-motion .background * {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function addTouchGestures() {
    let startX = 0;
    let startY = 0;
    const book = document.querySelector('.compact-book');

    book.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    book.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = startX - endX;
        const diffY = startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    if (currentPage < totalPages) {
                        nextPage();
                    }
                } else {
                    if (currentPage > 1) {
                        prevPage();
                    }
                }
            }
        }

        startX = 0;
        startY = 0;
    }, { passive: true });
}

function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const backgroundElements = document.querySelectorAll('.background *');
    backgroundElements.forEach(el => observer.observe(el));
}

document.addEventListener('touchstart', function enableAudio() {
    const bgMusic = document.getElementById('bgMusic');
    if (!musicPlaying && bgMusic && bgMusic.paused) {
        bgMusic.play().then(() => {
            musicPlaying = true;
            const musicToggle = document.getElementById('musicToggle');
            if (musicToggle) {
                musicToggle.textContent = '🔊';
                musicToggle.classList.remove('muted');
            }
            console.log('🎵 Music enabled by touch');
        }).catch(() => {
            console.log('❌ Still cannot play music');
        });
    }
}, { once: true, passive: true });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function() {
    optimizePerformance();
    addTouchGestures();
    setupIntersectionObserver();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic && musicPlaying) {
                bgMusic.pause();
            }
        } else {
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic && musicPlaying) {
                bgMusic.play().catch(() => {
                    console.log('Could not resume music');
                });
            }
        }
    });

    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            const book = document.querySelector('.compact-book');
            const container = document.querySelector('.container');
            const bookWrapper = document.querySelector('.book-wrapper');

            if (book) {
                const hasFlippedPages = currentPage > 1;
                if (hasFlippedPages) {
                    book.classList.remove('has-flipped-pages');
                    bookWrapper.classList.remove('has-flipped');
                    container.classList.remove('has-flipped');

                    setTimeout(() => {
                        book.classList.add('has-flipped-pages');
                        bookWrapper.classList.add('has-flipped');
                        container.classList.add('has-flipped');
                        console.log('📱 Orientation changed - repositioned for dual-page view');
                    }, 100);
                } else {
                    console.log('📱 Orientation changed - single page view maintained');
                }
            }
        }, 100);
    });
});

window.addEventListener('error', function(e) {
    console.error('📱 Mobile error:', e.error);
    // Graceful degradation - disable animations if errors occur
    document.body.classList.add('error-mode');
});

function cleanupEffects() {
    const oldFireworks = document.querySelectorAll('.firework');
    const oldLanterns = document.querySelectorAll('.falling-lantern');

    oldFireworks.forEach(fw => {
        if (fw.parentNode) fw.parentNode.removeChild(fw);
    });

    oldLanterns.forEach(ln => {
        if (ln.parentNode) ln.parentNode.removeChild(ln);
    });
}

setInterval(cleanupEffects, 10000);

function adjustForMobile(immediate = false) {
    if (window.innerWidth <= 375) {
        const book = document.querySelector('.compact-book');
        const wrapper = document.querySelector('.book-wrapper');
        const container = document.querySelector('.container');

        if (book && wrapper && container) {
            const hasFlipped = book.classList.contains('has-flipped-pages');

            if (!book.style.transition.includes('width')) {
                book.style.transition = 'transform 0.3s ease, width 0.3s ease, height 0.3s ease';
                wrapper.style.transition = 'all 0.3s ease, max-width 0.3s ease';
                container.style.transition = 'justify-content 0.3s ease, padding 0.3s ease, transform 0.3s ease';
            }

            if (immediate) {
                book.style.transition = 'none';
                wrapper.style.transition = 'none';
                container.style.transition = 'none';
            }

            if (!hasFlipped) {

                book.style.width = '231px';
                book.style.height = '280px';
                wrapper.style.maxWidth = '224px';
                wrapper.style.gap = '8.4px';
                container.style.padding = '10.5px 3.5px';
            } else {
                book.style.width = '330px';
                book.style.height = '400px';
                wrapper.style.maxWidth = '320px';
                wrapper.style.gap = '12px';
                container.style.padding = '15px 5px';
            }

            if (immediate) {
                requestAnimationFrame(() => {
                    book.style.transition = 'transform 0.3s ease, width 0.3s ease, height 0.3s ease';
                    wrapper.style.transition = 'all 0.3s ease, max-width 0.3s ease';
                    container.style.transition = 'justify-content 0.3s ease, padding 0.3s ease, transform 0.3s ease';
                });
            }
        }
    } else {
        const book = document.querySelector('.compact-book');
        const wrapper = document.querySelector('.book-wrapper');
        const container = document.querySelector('.container');

        if (book && wrapper && container) {
            book.style.width = '';
            book.style.height = '';
            wrapper.style.maxWidth = '';
            wrapper.style.gap = '';
            container.style.padding = '';
            book.style.transition = '';
            wrapper.style.transition = '';
            container.style.transition = '';
        }
    }
}

function updateMobileSizeAfterFlip() {
    if (window.innerWidth <= 375) {
        setTimeout(() => {
            adjustForMobile();
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', adjustForMobile);

window.addEventListener('resize', adjustForMobile);

window.addEventListener('orientationchange', () => {
    setTimeout(adjustForMobile, 100);
});

const originalNextPage = window.nextPage;
const originalPrevPage = window.prevPage;
const originalShowAnswer1 = window.showAnswer1;
const originalShowAnswer2 = window.showAnswer2;
const originalShowFinalAnswer = window.showFinalAnswer;
const originalRestart = window.restart;

if (typeof nextPage === 'function') {
    window.nextPage = function() {
        if (originalNextPage) {
            originalNextPage();
        }
        updateMobileSizeAfterFlip();
    };
}

if (typeof prevPage === 'function') {
    window.prevPage = function() {
        if (originalPrevPage) {
            originalPrevPage();
        }
        updateMobileSizeAfterFlip();
    };
}

if (typeof showAnswer1 === 'function') {
    window.showAnswer1 = function() {
        if (originalShowAnswer1) {
            originalShowAnswer1();
        }
        updateMobileSizeAfterFlip();
    };
}

if (typeof showAnswer2 === 'function') {
    window.showAnswer2 = function() {
        if (originalShowAnswer2) {
            originalShowAnswer2();
        }
        updateMobileSizeAfterFlip();
    };
}

if (typeof showFinalAnswer === 'function') {
    window.showFinalAnswer = function() {
        if (originalShowFinalAnswer) {
            originalShowFinalAnswer();
        }
        updateMobileSizeAfterFlip();
    };
}

if (typeof restart === 'function') {
    window.restart = function() {
        if (originalRestart) {
            originalRestart();
        }
        updateMobileSizeAfterFlip();
    };
}

if (!originalNextPage) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('compact-book') ||
                    target.classList.contains('book-wrapper') ||
                    target.classList.contains('container')) {
                    updateMobileSizeAfterFlip();
                }
            }
        });
    });

    const elementsToObserve = document.querySelectorAll('.compact-book, .book-wrapper, .container');
    elementsToObserve.forEach(element => {
        observer.observe(element, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

console.log('Mobile size adjustment loaded for iPhone SE');
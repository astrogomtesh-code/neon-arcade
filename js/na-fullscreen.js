(function (global) {
    'use strict';

    function naInitFullscreen(options) {
        const opts = options || {};
        const gameContainer = document.getElementById('game-container');
        const maxIcon = document.getElementById('max-icon');

        if (!gameContainer || !maxIcon) return;

        function updateMaximizeIcon(overrideState) {
            const isFullscreen = (typeof overrideState === 'boolean')
                ? overrideState
                : !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || gameContainer.classList.contains('pseudo-fullscreen'));

            if (isFullscreen) {
                maxIcon.innerHTML = `<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>`;
            } else {
                maxIcon.innerHTML = `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>`;
            }
        }

        async function toggleFullscreen() {
            if (typeof opts.onToggle === 'function') opts.onToggle();

            const isFullscreen = !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || gameContainer.classList.contains('pseudo-fullscreen'));

            if (!isFullscreen) {
                try {
                    if (gameContainer.requestFullscreen) {
                        await gameContainer.requestFullscreen();
                    } else if (gameContainer.webkitRequestFullscreen) {
                        await gameContainer.webkitRequestFullscreen();
                    } else if (gameContainer.msRequestFullscreen) {
                        await gameContainer.msRequestFullscreen();
                    } else if (gameContainer.mozRequestFullScreen) {
                        await gameContainer.mozRequestFullScreen();
                    } else {
                        gameContainer.classList.add('pseudo-fullscreen');
                        updateMaximizeIcon(true);
                    }
                } catch (err) {
                    console.warn('Native fullscreen blocked, applying pseudo-fullscreen mode instead:', err);
                    gameContainer.classList.add('pseudo-fullscreen');
                    updateMaximizeIcon(true);
                }
            } else {
                if (gameContainer.classList.contains('pseudo-fullscreen')) {
                    gameContainer.classList.remove('pseudo-fullscreen');
                    updateMaximizeIcon(false);
                } else {
                    try {
                        if (document.exitFullscreen) {
                            await document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            await document.webkitExitFullscreen();
                        } else if (document.msExitFullscreen) {
                            await document.msExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            await document.mozCancelFullScreen();
                        }
                    } catch (err) {
                        gameContainer.classList.remove('pseudo-fullscreen');
                        updateMaximizeIcon(false);
                    }
                }
            }
            // pseudo-fullscreen doesn't fire fullscreenchange, so force a
            // recalculation once the layout settles either way
            setTimeout(() => {
                if (typeof opts.onAfterToggle === 'function') opts.onAfterToggle();
            }, 60);
        }

        // Exposed globally so the inline onclick="toggleFullscreen()" button
        // bindings used by some games keep resolving to this function.
        global.toggleFullscreen = toggleFullscreen;

        document.addEventListener('fullscreenchange', () => updateMaximizeIcon());
        document.addEventListener('webkitfullscreenchange', () => updateMaximizeIcon());
        document.addEventListener('mozfullscreenchange', () => updateMaximizeIcon());
        document.addEventListener('MSFullscreenChange', () => updateMaximizeIcon());
    }

    global.naInitFullscreen = naInitFullscreen;
})(window);

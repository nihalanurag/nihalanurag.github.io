(function () {
    // Apply saved theme immediately to prevent flash
    var saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        document.documentElement.style.colorScheme = saved;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.querySelector('.theme-toggle');
        var icon = btn ? btn.querySelector('.theme-icon') : null;

        function getTheme() {
            return document.documentElement.getAttribute('data-theme') || 'light';
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.style.colorScheme = theme;
            localStorage.setItem('theme', theme);
            if (icon) {
                icon.textContent = theme === 'dark' ? '\u2600' : '\u263D';
            }
        }

        // Set initial icon
        if (icon) {
            icon.textContent = getTheme() === 'dark' ? '\u2600' : '\u263D';
        }

        if (btn) {
            btn.addEventListener('click', function () {
                setTheme(getTheme() === 'dark' ? 'light' : 'dark');
            });
        }

        // Fisher-Yates shuffle
        function shuffle(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
            }
            return a;
        }

        // Animated sorting unscramble for a single email
        function animateUnscramble(emailSpan, scrambled, target, realEmail, btn) {
            btn.style.display = 'none';
            var current = scrambled.slice();
            var sorted = 0;

            function step() {
                if (sorted >= target.length) {
                    emailSpan.innerHTML = '<a href="mailto:' + realEmail + '">' + realEmail + '</a>';
                    return;
                }
                var correctChar = target[sorted];
                var foundAt = -1;
                for (var i = sorted; i < current.length; i++) {
                    if (current[i] === correctChar) { foundAt = i; break; }
                }
                if (foundAt !== sorted) {
                    var tmp = current[sorted];
                    current[sorted] = current[foundAt];
                    current[foundAt] = tmp;
                }
                sorted++;
                emailSpan.textContent = current.join('');
                setTimeout(step, 60);
            }
            step();
        }

        // Magnifier lens — clone-and-scale approach
        var magBtn = document.querySelector('.magnifier-toggle');
        var lens = document.getElementById('magnifier-lens');
        var magActive = false;
        var LENS_SIZE = 180;
        var ZOOM = 2;
        var lensContent = null;

        if (magBtn && lens) {
            function buildLensContent() {
                // Remove old clone if exists
                if (lensContent) lens.removeChild(lensContent);

                // Clone the entire page body
                lensContent = document.body.cloneNode(true);
                lensContent.style.position = 'absolute';
                lensContent.style.top = '0';
                lensContent.style.left = '0';
                lensContent.style.width = document.documentElement.scrollWidth + 'px';
                lensContent.style.minHeight = document.documentElement.scrollHeight + 'px';
                lensContent.style.transform = 'scale(' + ZOOM + ')';
                lensContent.style.transformOrigin = '0 0';
                lensContent.style.pointerEvents = 'none';
                lensContent.style.margin = '0';
                lensContent.style.padding = '0';

                // Remove the lens clone from within the cloned body to avoid recursion
                var clonedLens = lensContent.querySelector('#magnifier-lens');
                if (clonedLens) clonedLens.remove();
                var clonedSkip = lensContent.querySelector('.skip-link');
                if (clonedSkip) clonedSkip.remove();

                lens.appendChild(lensContent);
            }

            magBtn.addEventListener('click', function () {
                magActive = !magActive;
                magBtn.classList.toggle('active', magActive);
                lens.classList.toggle('active', magActive);
                if (magActive) {
                    buildLensContent();
                }
            });

            document.addEventListener('mousemove', function (e) {
                if (!magActive || !lensContent) return;

                var x = e.clientX;
                var y = e.clientY;

                // Position lens centered on cursor
                lens.style.left = (x - LENS_SIZE / 2) + 'px';
                lens.style.top = (y - LENS_SIZE / 2) + 'px';

                // Offset the cloned content so the area under cursor is centered in lens
                var pageX = x + window.scrollX;
                var pageY = y + window.scrollY;
                lensContent.style.left = -(pageX * ZOOM - LENS_SIZE / 2) + 'px';
                lensContent.style.top = -(pageY * ZOOM - LENS_SIZE / 2) + 'px';
            });

            // Rebuild clone periodically to catch content changes (theme toggle, etc.)
            var rebuildTimer;
            document.addEventListener('scroll', function () {
                if (!magActive) return;
                clearTimeout(rebuildTimer);
                rebuildTimer = setTimeout(buildLensContent, 200);
            });
        }

        // Init all scrambled emails
        var scrambleItems = document.querySelectorAll('.scramble-item');
        var scrambleBtns = document.querySelectorAll('.scramble-btn');
        for (var i = 0; i < scrambleItems.length; i++) {
            (function (span, btn) {
                var realEmail = span.getAttribute('data-email');
                var chars = realEmail.split('');
                var scrambled = shuffle(chars);
                span.textContent = scrambled.join('');

                btn.addEventListener('click', function () {
                    animateUnscramble(span, scrambled.slice(), chars, realEmail, btn);
                });
            })(scrambleItems[i], scrambleBtns[i]);
        }
    });
})();

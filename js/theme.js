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

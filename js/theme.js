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

        // Email scramble & animated unscramble
        var unscrambleBtn = document.getElementById('unscramble-btn');
        var emailSpan = document.getElementById('scrambled-email');
        if (unscrambleBtn && emailSpan) {
            var realEmail = emailSpan.getAttribute('data-email');
            var chars = realEmail.split('');

            // Fisher-Yates shuffle seeded by current time (different every refresh)
            function shuffle(arr) {
                var a = arr.slice();
                for (var i = a.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                }
                return a;
            }

            var scrambled = shuffle(chars);
            emailSpan.textContent = scrambled.join('');

            unscrambleBtn.addEventListener('click', function () {
                unscrambleBtn.style.display = 'none';
                var current = scrambled.slice();
                var target = chars.slice();
                var sorted = 0;

                // Animate: each step, find the next correct char and swap it into place
                function step() {
                    if (sorted >= target.length) {
                        // Done — make it a clickable mailto link
                        emailSpan.innerHTML = '<a href="mailto:' + realEmail + '">' + realEmail + '</a>';
                        return;
                    }

                    // Find where the correct character for position `sorted` currently is
                    var correctChar = target[sorted];
                    var foundAt = -1;
                    for (var i = sorted; i < current.length; i++) {
                        if (current[i] === correctChar) {
                            foundAt = i;
                            break;
                        }
                    }

                    if (foundAt !== sorted) {
                        // Swap into place
                        var tmp = current[sorted];
                        current[sorted] = current[foundAt];
                        current[foundAt] = tmp;
                    }

                    sorted++;
                    emailSpan.textContent = current.join('');
                    setTimeout(step, 60);
                }

                step();
            });
        }
    });
})();

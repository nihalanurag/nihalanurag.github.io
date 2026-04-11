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
    });
})();

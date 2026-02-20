(function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const createThemeToggle = () => {
        let nav = document.querySelector('nav');
        if (!nav) {
            // If no nav, create a fixed one just for the toggle if we're on signin/register
            const header = document.querySelector('header');
            if (header) {
                nav = document.createElement('nav');
                header.appendChild(nav);
            } else {
                return;
            }
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        toggleBtn.setAttribute('title', 'Toggle Dark Mode');

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });

        nav.insertBefore(toggleBtn, nav.firstChild);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemeToggle);
    } else {
        createThemeToggle();
    }
})();

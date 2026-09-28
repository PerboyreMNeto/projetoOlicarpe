const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-navigation');
const serviceDropdown = navigation.querySelector('.services-dropdown');

menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navigation.addEventListener('click', (event) => {
    if (event.target.closest('.services-submenu a')) {
        serviceDropdown.open = false;
    }

    if (event.target.closest('a')) {
        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
});

document.addEventListener('click', (event) => {
    if (!serviceDropdown.contains(event.target)) {
        serviceDropdown.open = false;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && serviceDropdown.open) {
        serviceDropdown.open = false;
        serviceDropdown.querySelector('summary').focus();
    }
});

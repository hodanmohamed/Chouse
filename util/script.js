// JAVASCRIPT TO TOGGLE BURGER MENU
const toggleButton = document.getElementsByClassName('toggle-btn')[0];
const navbarLinks = document.getElementsByClassName('nav-links')[0];

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});
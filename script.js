document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const slideIns = document.querySelectorAll('.slide-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.style.animation = 'slideIn 0.8s ease forwards';
    });
}, { threshold: 0.1 });
slideIns.forEach(el => observer.observe(el));

document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    alert(`Thanks! I'll get back to you soon!`);
    e.target.reset();
});

const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');
menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('click', () => {
        const desc = item.querySelector('.description');
        desc.classList.toggle('hidden');
    });
});
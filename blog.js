document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

const slideIns = document.querySelectorAll('.slide-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.style.animation = 'slideIn 0.8s ease forwards';
    });
}, { threshold: 0.1 });
slideIns.forEach(el => observer.observe(el));

const blogPostsContainer = document.getElementById('blog-posts');
const loginForm = document.getElementById('login-form');
const loginModal = document.getElementById('login-modal');
const loginBtn = document.getElementById('login-btn');
const closeModal = document.getElementById('close-modal');
let currentUser = null;

function loadBlogs() {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [
        { title: "Chasing Creativity", content: "My journey into blending art and code to create something unique.", image: "https://images.unsplash.com/photo-1516321310768-61c5e24d8f75", likes: 3, comments: [{ user: "Guest", text: "Loved this!" }] },
        { title: "Why I Game", content: "Gaming isn't just fun; it's a way to explore new worlds and stories.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e", likes: 2, comments: [] }
    ];
    blogPostsContainer.innerHTML = '';
    blogs.forEach((blog, index) => {
        const blogElement = document.createElement('div');
        blogElement.className = 'card p-4 sm:p-6 rounded-lg shadow-lg interactive-card';
        blogElement.innerHTML = `
            <h3 class="text-lg sm:text-xl font-semibold text-[#1A237E]">${blog.title}</h3>
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="w-full h-32 sm:h-40 object-cover rounded-lg my-4 lazy">` : ''}
            <p class="text-sm sm:text-base my-4 text-[#1A237E]">${blog.content.substring(0, 80)}...</p>
            <button class="view-blog text-[#FF6F61] hover:underline" data-index="${index}">Read More</button>
            <div class="mt-4 flex space-x-4">
                <button class="like-btn text-[#FF6F61] text-sm" data-index="${index}"><i class="fas fa-heart"></i> ${blog.likes || 0}</button>
                <button class="comment-btn text-[#FF6F61] text-sm" data-index="${index}"><i class="fas fa-comment"></i> ${blog.comments ? blog.comments.length : 0}</button>
            </div>
        `;
        blogPostsContainer.appendChild(blogElement);
    });

    document.querySelectorAll('.view-blog').forEach(btn => {
        btn.addEventListener('click', e => {
            const index = e.target.dataset.index;
            showBlogModal(blogs[index], index);
        });
    });
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (!currentUser) return alert('Please login to like posts.');
            const index = e.target.dataset.index;
            blogs[index].likes = (blogs[index].likes || 0) + 1;
            localStorage.setItem('blogs', JSON.stringify(blogs));
            loadBlogs();
        });
    });
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (!currentUser) return alert('Please login to comment.');
            const index = e.target.dataset.index;
            showCommentModal(index);
        });
    });
}

function showBlogModal(blog, index) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="text-lg sm:text-xl font-bold mb-4 text-[#1A237E]">${blog.title}</h3>
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="w-full h-32 sm:h-48 object-cover rounded-lg mb-4 lazy">` : ''}
            <p class="text-sm sm:text-base text-[#1A237E]">${blog.content}</p>
            <div class="mt-4">
                <p class="text-sm text-[#1A237E]">${blog.comments ? blog.comments.map(c => `<strong>${c.user}:</strong> ${c.text}`).join('<br>') : 'No comments yet.'}</p>
            </div>
            <button class="mt-4 text-[#FF6F61] hover:underline" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showCommentModal(index) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="text-lg sm:text-xl font-bold mb-4 text-[#1A237E]">Add Comment</h3>
            <textarea id="comment-text" class="w-full p-2 border rounded mb-4 text-sm sm:text-base bg-[#F8F9FA] text-[#1A237E]" rows="4" required></textarea>
            <button class="coral-button text-white px-6 py-2 rounded" onclick="submitComment(${index})">Submit</button>
            <button class="mt-4 text-[#FF6F61] hover:underline" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

window.submitComment = function(index) {
    const commentText = document.getElementById('comment-text').value;
    if (!commentText) return alert('Comment cannot be empty.');
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs[index].comments = blogs[index].comments || [];
    blogs[index].comments.push({ user: currentUser, text: commentText });
    localStorage.setItem('blogs', JSON.stringify(blogs));
    document.querySelector('.modal').remove();
    loadBlogs();
};

loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});
closeModal.addEventListener('click', () => {
    loginModal.classList.remove('active');
});
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        user = { username, password };
    }
    currentUser = username;
    loginModal.classList.remove('active');
    loginBtn.textContent = `Hi, ${username}!`;
    alert(`Welcome, ${username}! You can now like and comment.`);
});

const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');
menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

loadBlogs();
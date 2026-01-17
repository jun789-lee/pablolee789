/**
 * Main JavaScript - Navigation, Data Loading, Markdown Rendering
 */

// ============================================
// DATA LOADER
// ============================================
async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Failed to load ' + path);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function loadMarkdown(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Failed to load ' + path);
        return await response.text();
    } catch (error) {
        console.error(error);
        return '';
    }
}

// ============================================
// SIMPLE MARKDOWN PARSER
// ============================================
function parseMarkdown(md) {
    let html = md
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold & Italic
        .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Unordered lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Images
        .replace(/\!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1">')
        // Line breaks
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    // Fix list items
    html = html.replace(/<\/li><br><li>/g, '</li><li>');
    html = html.replace(/<p><li>/g, '<ul><li>');
    html = html.replace(/<\/li><\/p>/g, '</li></ul>');

    // Fix consecutive blockquotes
    html = html.replace(/<\/blockquote><br><blockquote>/g, '</blockquote><blockquote>');

    return html;
}

// ============================================
// PROJECTS PAGE
// ============================================
async function initPortfolioPage() {
    const grid = document.getElementById('projects-grid');
    const filters = document.querySelectorAll('.filter-btn');

    if (!grid) return;

    const projects = await loadJSON('data/projects.json');

    function renderProjects(filter = 'all') {
        const filtered = filter === 'all'
            ? projects
            : projects.filter(p => p.category === filter);

        grid.innerHTML = filtered.map((project, i) => `
      <a href="${project.link || '#'}" class="card fade-in" style="animation-delay: ${i * 0.1}s" target="_blank" rel="noopener">
        <div class="card-category">${project.category}</div>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-description">${project.description}</p>
      </a>
    `).join('');
    }

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });

    renderProjects();
}

// ============================================
// BLOG PAGE
// ============================================
async function initBlogPage() {
    const grid = document.getElementById('posts-grid');
    const filters = document.querySelectorAll('.filter-btn');

    if (!grid) return;

    const posts = await loadJSON('data/posts.json');

    function renderPosts(filter = 'all') {
        const filtered = filter === 'all'
            ? posts
            : posts.filter(p => p.category === filter);

        grid.innerHTML = filtered.map((post, i) => `
      <a href="post.html?id=${post.id}" class="card fade-in" style="animation-delay: ${i * 0.1}s">
        <div class="card-category">${post.category}</div>
        <h3 class="card-title">${post.title}</h3>
        <p class="card-description">${post.summary}</p>
        <div class="card-date">${post.date}</div>
      </a>
    `).join('');
    }

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPosts(btn.dataset.filter);
        });
    });

    renderPosts();
}

// ============================================
// POST VIEW PAGE
// ============================================
async function initPostPage() {
    const container = document.getElementById('post-content');
    const titleEl = document.getElementById('post-title');
    const categoryEl = document.getElementById('post-category');
    const dateEl = document.getElementById('post-date');

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
    }

    const posts = await loadJSON('data/posts.json');
    const post = posts.find(p => p.id === postId);

    if (!post) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
    }

    // Update meta
    if (titleEl) titleEl.textContent = post.title;
    if (categoryEl) categoryEl.textContent = post.category;
    if (dateEl) dateEl.textContent = post.date;
    document.title = `${post.title} - Pablolee789`;

    // Load and render markdown
    const markdown = await loadMarkdown(`posts/${post.file}`);
    container.innerHTML = parseMarkdown(markdown);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we're on and init accordingly
    const page = document.body.dataset.page;

    switch (page) {
        case 'portfolio':
            initPortfolioPage();
            break;
        case 'blog':
            initBlogPage();
            break;
        case 'post':
            initPostPage();
            break;
    }

    initScrollAnimations();
});

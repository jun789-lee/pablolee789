async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';

    // Determine link - for essays it might be a markdown view, for projects a link
    let link = '#';
    if (item.file) {
        link = `post.html?id=${item.id}`;
    } else if (item.link) {
        link = item.link;
    }

    card.innerHTML = `
        <a href="${link}">
            <span class="card-meta">${item.date} | ${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.summary || item.description || ''}</p>
        </a>
    `;
    return card;
}

// Global functions for pages
window.loadRecent = async function () {
    const projects = await fetchData('data/projects.json');
    const posts = await fetchData('data/posts.json');

    // Combine and sort by date desc
    const all = [...projects, ...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = all.slice(0, 3);

    const container = document.getElementById('latest-posts');
    if (container) {
        container.innerHTML = '';
        recent.forEach(item => {
            container.appendChild(createCard(item));
        });
    }
};

window.loadPortfolio = async function () {
    const projects = await fetchData('data/projects.json');
    // Filter for non-Data Analysis projects
    const portfolioItems = projects.filter(p => p.category !== 'Data Analysis');

    const container = document.getElementById('portfolio-grid');
    if (container) {
        container.innerHTML = '';
        portfolioItems.forEach(item => {
            container.appendChild(createCard(item));
        });
    }
};

window.loadDataAnalysis = async function () {
    const projects = await fetchData('data/projects.json');
    const analysisItems = projects.filter(p => p.category === 'Data Analysis');

    const container = document.getElementById('analysis-grid');
    if (container) {
        container.innerHTML = '';
        analysisItems.forEach(item => {
            container.appendChild(createCard(item));
        });
    }
};

window.loadEssays = async function () {
    const posts = await fetchData('data/posts.json');
    const essayItems = posts.filter(p => p.category === 'Essay');

    const container = document.getElementById('essay-grid');
    if (container) {
        container.innerHTML = '';
        essayItems.forEach(item => {
            container.appendChild(createCard(item));
        });
    }
};

window.loadMathStats = async function () {
    const posts = await fetchData('data/posts.json');
    const mathItems = posts.filter(p => p.category === 'Mathematical Statistics');

    const container = document.getElementById('mathstats-grid');
    if (container) {
        container.innerHTML = '';
        mathItems.forEach(item => {
            container.appendChild(createCard(item));
        });
    }
};

window.loadPost = async function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('post-title').innerText = 'Post not found';
        return;
    }

    // Search in both data files
    const projects = await fetchData('data/projects.json');
    const posts = await fetchData('data/posts.json');
    const allItems = [...projects, ...posts];

    const item = allItems.find(i => i.id === id);

    if (!item) {
        document.getElementById('post-title').innerText = 'Post not found';
        return;
    }

    // Update Header
    document.title = `${item.title} - My Portfolio`;
    document.getElementById('post-title').innerText = item.title;
    const meta = document.getElementById('post-meta');
    if (meta) meta.innerText = `${item.date} | ${item.category}`;

    // Load Content
    if (item.file) {
        try {
            const res = await fetch(item.file);
            if (!res.ok) throw new Error('Failed to load markdown');
            const markdown = await res.text();

            // Check if marked is available
            if (window.marked) {
                document.getElementById('post-content').innerHTML = marked.parse(markdown);

                // Trigger MathJax to render math
                if (window.MathJax) {
                    MathJax.typesetPromise([document.getElementById('post-content')]).catch((err) => console.log(err));
                }
            } else {
                document.getElementById('post-content').innerHTML = '<pre>' + markdown + '</pre>';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('post-content').innerText = 'Error loading post content.';
        }
    } else if (item.link) {
        document.getElementById('post-content').innerHTML = `<p>This project is hosted externally. <a href="${item.link}">Click here to visit</a>.</p>`;
    } else {
        document.getElementById('post-content').innerText = item.description || item.summary;
    }
};

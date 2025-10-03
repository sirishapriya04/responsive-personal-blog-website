// Example posts
const SAMPLE_POSTS = [
  {
    id: 'p1',
    title: 'Designing for Simplicity',
    author: 'A. Writer',
    date: '2025-09-20',
    excerpt: 'Simplicity isn\'t the absence of features — it\'s the right features done well.',
    content: 'Simplicity is one of the hardest things to design for. It requires clarity of thought...'
  },
  {
    id: 'p2',
    title: 'Getting started with modern JS',
    author: 'A. Writer',
    date: '2025-08-11',
    excerpt: 'A gentle introduction to modern JavaScript workflows, tools, and patterns.',
    content: 'JavaScript has evolved fast — from callbacks to promises to async/await. This article will...'
  }
];

let posts = [];

// Load & Save
function loadPosts() {
  const raw = localStorage.getItem('pb_posts');
  posts = raw ? JSON.parse(raw) : SAMPLE_POSTS.slice();
}
function savePosts() {
  localStorage.setItem('pb_posts', JSON.stringify(posts));
}

// Render
function renderPosts() {
  const container = document.getElementById('postsList');
  container.innerHTML = '';

  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="card empty">No posts found</div>';
    return;
  }

  filtered.forEach(p => {
    const node = document.createElement('article');
    node.className = 'card';
    node.innerHTML = `
      <div class="post-meta">
        <div class="avatar">${p.author[0]}</div>
        <div style="flex:1">
          <h3 class="title">${p.title}</h3>
          <div class="sub">by ${p.author} • ${new Date(p.date).toLocaleDateString()}</div>
        </div>
        <button class="btn ghost" onclick="openRead('${p.id}')">Read</button>
      </div>
      <p class="excerpt">${p.excerpt}</p>
      <div class="post-actions">
        <button class="btn ghost" onclick="editPost('${p.id}')">Edit</button>
        <button class="btn ghost" onclick="deletePost('${p.id}')">Delete</button>
      </div>
    `;
    container.appendChild(node);
  });
}

// Modal
function openRead(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('modalContent');
  modal.innerHTML = `
    <h2>${p.title}</h2>
    <div class="sub">by ${p.author} • ${new Date(p.date).toLocaleDateString()}</div>
    <p style="margin-top:10px">${p.content}</p>
    <button class="btn ghost" onclick="closeModal()">Close</button>
  `;
  document.getElementById('modalBackdrop').style.display = 'flex';
}
function closeModal() {
  document.getElementById('modalBackdrop').style.display = 'none';
}

// Add Post
function newPost() {
  const modal = document.getElementById('modalContent');
  modal.innerHTML = `
    <h2>New Post</h2>
    <input id="pTitle" class="input" placeholder="Title">
    <input id="pAuthor" class="input" placeholder="Author" value="You">
    <textarea id="pContent" class="input" placeholder="Write something..."></textarea>
    <div style="margin-top:10px;display:flex;gap:8px">
      <button class="btn ghost" onclick="closeModal()">Cancel</button>
      <button class="btn" onclick="saveNewPost()">Save</button>
    </div>
  `;
  document.getElementById('modalBackdrop').style.display = 'flex';
}
function saveNewPost() {
  const title = document.getElementById('pTitle').value.trim();
  const author = document.getElementById('pAuthor').value.trim() || 'You';
  const content = document.getElementById('pContent').value.trim();
  if (!title || !content) return alert('Title and content required');
  const newPost = {
    id: 'p' + Date.now(),
    title,
    author,
    date: new Date().toISOString(),
    excerpt: content.slice(0, 80) + '...',
    content
  };
  posts.unshift(newPost);
  savePosts();
  renderPosts();
  closeModal();
}

// Edit Post
function editPost(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('modalContent');
  modal.innerHTML = `
    <h2>Edit Post</h2>
    <input id="pTitle" class="input" value="${p.title}">
    <input id="pAuthor" class="input" value="${p.author}">
    <textarea id="pContent" class="input">${p.content}</textarea>
    <div style="margin-top:10px;display:flex;gap:8px">
      <button class="btn ghost" onclick="closeModal()">Cancel</button>
      <button class="btn" onclick="saveEditedPost('${p.id}')">Update</button>
    </div>
  `;
  document.getElementById('modalBackdrop').style.display = 'flex';
}
function saveEditedPost(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  p.title = document.getElementById('pTitle').value.trim();
  p.author = document.getElementById('pAuthor').value.trim() || 'You';
  p.content = document.getElementById('pContent').value.trim();
  p.excerpt = p.content.slice(0, 80) + '...';
  savePosts();
  renderPosts();
  closeModal();
}

// Delete Post
function deletePost(id) {
  if (!confirm('Delete this post?')) return;
  posts = posts.filter(x => x.id !== id);
  savePosts();
  renderPosts();
}

// Init
window.addEventListener('load', () => {
  loadPosts();
  renderPosts();

  document.getElementById('searchInput').addEventListener('input', renderPosts);
  document.getElementById('newPostBtn').addEventListener('click', newPost);
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target.id === 'modalBackdrop') closeModal();
  });
});

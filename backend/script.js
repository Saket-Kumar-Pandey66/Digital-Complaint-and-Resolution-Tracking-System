/* ===================================================
   DCRTS – script.js
   Features:
     - Signup / Login with localStorage persistence
     - Passwords hashed — never displayed in UI
     - Complaints tied to logged-in username
     - Regular users see only their own complaints
     - Admin sees all complaints + "Submitted By" column
     - Pre-seeded admin account: admin / admin123
   =================================================== */

// ── Storage keys ─────────────────────────────────────
const KEY_USERS      = 'dcrts_users';
const KEY_COMPLAINTS = 'dcrts_complaints';
const KEY_SESSION    = 'dcrts_session';

// ── Runtime state ─────────────────────────────────────
let currentUser  = null;
let complaintSeq = 1;

// ── Helpers ───────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function loadUsers()        { return JSON.parse(localStorage.getItem(KEY_USERS)      || '[]'); }
function saveUsers(arr)     { localStorage.setItem(KEY_USERS,      JSON.stringify(arr)); }
function loadComplaints()   { return JSON.parse(localStorage.getItem(KEY_COMPLAINTS) || '[]'); }
function saveComplaints(arr){ localStorage.setItem(KEY_COMPLAINTS, JSON.stringify(arr)); }

// One-way hash — keeps passwords off plain sight in localStorage
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h.toString(16);
}

function today() {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function padId(n) { return 'CMP-' + String(n).padStart(4, '0'); }
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showMsg(elId, text, type) {
  const el = $(elId);
  el.textContent = text;
  el.className = 'msg-box ' + (type === 'success' ? 'is-success' : 'is-error');
  el.classList.remove('hidden');
}
function clearMsg(elId) {
  const el = $(elId);
  el.classList.add('hidden');
  el.textContent = '';
}

// ── Page / Section navigation ─────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(pageId).classList.add('active');
}

function showSection(name, linkEl) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  $('section-' + name).classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  if (name === 'track') renderTable();
}

// ── Auth toggle ───────────────────────────────────────
function toggleAuth(mode) {
  if (mode === 'signup') {
    $('form-login').classList.add('hidden');
    $('form-signup').classList.remove('hidden');
  } else {
    $('form-signup').classList.add('hidden');
    $('form-login').classList.remove('hidden');
  }
  clearMsg('login-msg');
  clearMsg('signup-msg');
}

// ── Seed admin on first load ──────────────────────────
function seedAdmin() {
  const users = loadUsers();
  if (!users.find(u => u.username === 'admin')) {
    users.push({
      username: 'admin',
      passwordHash: simpleHash('admin123'),
      name: 'Administrator',
      email: 'admin@institution.edu',
      role: 'admin'
    });
    saveUsers(users);
  }
}

// ── SIGNUP ────────────────────────────────────────────
function doSignup() {
  const name  = $('s-name').value.trim();
  const email = $('s-email').value.trim();
  const user  = $('s-user').value.trim().toLowerCase();
  const pass  = $('s-pass').value;
  const pass2 = $('s-pass2').value;

  clearMsg('signup-msg');

  if (!name || !email || !user || !pass || !pass2)        { showMsg('signup-msg', 'All fields are required.', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))          { showMsg('signup-msg', 'Please enter a valid email address.', 'error'); return; }
  if (user.length < 3)                                     { showMsg('signup-msg', 'Username must be at least 3 characters.', 'error'); return; }
  if (user === 'admin')                                    { showMsg('signup-msg', 'That username is reserved.', 'error'); return; }
  if (pass.length < 6)                                     { showMsg('signup-msg', 'Password must be at least 6 characters.', 'error'); return; }
  if (pass !== pass2)                                      { showMsg('signup-msg', 'Passwords do not match.', 'error'); return; }

  const users = loadUsers();
  if (users.find(u => u.username === user))                { showMsg('signup-msg', 'That username is already taken.', 'error'); return; }

  users.push({ username: user, passwordHash: simpleHash(pass), name, email, role: 'user' });
  saveUsers(users);

  showMsg('signup-msg', '✓ Account created! Redirecting to login…', 'success');
  ['s-name','s-email','s-user','s-pass','s-pass2'].forEach(id => $(id).value = '');
  setTimeout(() => toggleAuth('login'), 1500);
}

// ── LOGIN ─────────────────────────────────────────────
function doLogin() {
  const user = $('l-user').value.trim().toLowerCase();
  const pass = $('l-pass').value;

  clearMsg('login-msg');

  if (!user || !pass) { showMsg('login-msg', 'Please enter your username and password.', 'error'); return; }

  const found = loadUsers().find(u => u.username === user && u.passwordHash === simpleHash(pass));
  if (!found)         { showMsg('login-msg', 'Incorrect username or password.', 'error'); return; }

  // Store session — username, name, email, role only. Password never stored.
  currentUser = { username: found.username, name: found.name, email: found.email, role: found.role };
  sessionStorage.setItem(KEY_SESSION, JSON.stringify(currentUser));

  syncSeq();
  applySession();
}

// ── Restore session on reload ─────────────────────────
function restoreSession() {
  const saved = sessionStorage.getItem(KEY_SESSION);
  if (saved) {
    currentUser = JSON.parse(saved);
    syncSeq();
    applySession();
  }
}

function syncSeq() {
  const complaints = loadComplaints();
  if (complaints.length > 0) {
    complaintSeq = complaints.reduce((m, c) => Math.max(m, parseInt(c.seq || 0)), 0) + 1;
  }
}

// ── Apply session to UI ───────────────────────────────
function applySession() {
  const isAdmin = currentUser.role === 'admin';

  // Status bar — username & role badge only, no password ever
  $('status-user').textContent = currentUser.username;
  $('status-role-badge').innerHTML = isAdmin
    ? '<span class="role-badge role-admin">ADMIN</span>'
    : '<span class="role-badge role-user">USER</span>';

  // Hide Submit nav for admin
  if (isAdmin) {
    $('nav-submit-link').classList.add('hidden');
  } else {
    $('nav-submit-link').classList.remove('hidden');
    // Pre-fill with registered info
    $('c-name').value  = currentUser.name  || '';
    $('c-email').value = currentUser.email || '';
  }

  $('track-desc').textContent = isAdmin
    ? 'All complaints from every user are shown below.'
    : 'Only your submitted complaints are shown below.';

  updateStatusCount();
  showPage('page-dashboard');

  if (isAdmin) {
    // Admin lands on tracker
    const trackLink = document.querySelector('.nav-link:not(.nav-logout):not(#nav-submit-link)');
    showSection('track', trackLink);
  } else {
    showSection('submit', $('nav-submit-link'));
  }
}

// ── LOGOUT ────────────────────────────────────────────
function doLogout() {
  currentUser = null;
  sessionStorage.removeItem(KEY_SESSION);
  $('l-user').value = '';
  $('l-pass').value = '';
  clearMsg('login-msg');
  toggleAuth('login');
  showPage('page-auth');
}

// ── SUBMIT COMPLAINT ──────────────────────────────────
function submitComplaint() {
  const name     = $('c-name').value.trim();
  const email    = $('c-email').value.trim();
  const category = $('c-category').value;
  const desc     = $('c-desc').value.trim();
  const priority = (document.querySelector('input[name="priority"]:checked') || {}).value || '';

  $('form-error').classList.add('hidden');
  $('form-success').classList.add('hidden');

  if (!name || !email || !category || !priority || !desc) {
    $('form-error').classList.remove('hidden'); return;
  }

  const seq = complaintSeq++;
  const complaints = loadComplaints();
  complaints.push({
    id:          padId(seq),
    seq,
    submittedBy: currentUser.username,   // username only — no password
    name,
    email,
    category,
    priority,
    status:      'Submitted',
    desc,
    date:        today()
  });
  saveComplaints(complaints);

  $('form-success').classList.remove('hidden');
  setTimeout(() => $('form-success').classList.add('hidden'), 3000);

  // Reset form but keep pre-filled name/email
  $('c-category').value = '';
  $('c-desc').value     = '';
  const checked = document.querySelector('input[name="priority"]:checked');
  if (checked) checked.checked = false;
  $('form-error').classList.add('hidden');

  updateStatusCount();
}

function clearForm() {
  $('c-name').value     = currentUser ? currentUser.name  || '' : '';
  $('c-email').value    = currentUser ? currentUser.email || '' : '';
  $('c-category').value = '';
  $('c-desc').value     = '';
  const checked = document.querySelector('input[name="priority"]:checked');
  if (checked) checked.checked = false;
  $('form-error').classList.add('hidden');
  $('form-success').classList.add('hidden');
}

// ── STATUS COUNT ──────────────────────────────────────
function updateStatusCount() {
  if (!currentUser) return;
  const all  = loadComplaints();
  const mine = currentUser.role === 'admin' ? all : all.filter(c => c.submittedBy === currentUser.username);
  $('status-count').innerHTML = 'Complaints: <strong>' + mine.length + '</strong>';
}

// ── RENDER TABLE ──────────────────────────────────────
function renderTable() {
  if (!currentUser) return;

  const isAdmin    = currentUser.role === 'admin';
  const filterCat  = $('filter-cat').value;
  const filterPri  = $('filter-pri').value;
  const filterUser = isAdmin ? ($('filter-user').value || 'All') : currentUser.username;

  const all = loadComplaints();

  // Populate admin user-filter dropdown
  if (isAdmin) {
    $('filter-user-group').classList.remove('hidden');
    const sel       = $('filter-user');
    const current   = sel.value;
    const usernames = [...new Set(all.map(c => c.submittedBy))].sort();
    const existing  = [...sel.options].slice(1).map(o => o.value);
    if (JSON.stringify(existing) !== JSON.stringify(usernames)) {
      while (sel.options.length > 1) sel.remove(1);
      usernames.forEach(u => { const o = document.createElement('option'); o.value = u; o.textContent = u; sel.appendChild(o); });
      sel.value = current;
    }
  }

  // Inject "Submitted By" column header for admin (once)
  const headRow = $('table-head-row');
  if (isAdmin && !headRow.querySelector('.th-user')) {
    const th = document.createElement('th');
    th.className   = 'th-user';
    th.textContent = 'Submitted By';
    headRow.insertBefore(th, headRow.children[1]);
  }

  // Filter
  const filtered = all.filter(c => {
    const own      = isAdmin ? true : c.submittedBy === currentUser.username;
    const byUser   = filterUser === 'All' ? true : c.submittedBy === filterUser;
    const byCat    = filterCat  === 'All' ? true : c.category    === filterCat;
    const byPri    = filterPri  === 'All' ? true : c.priority    === filterPri;
    return own && byUser && byCat && byPri;
  });

  // Chips
  $('chip-total').textContent   = 'Showing: '   + filtered.length;
  $('chip-high').textContent    = 'High: '      + filtered.filter(c => c.priority === 'High').length;
  $('chip-pending').textContent = 'Submitted: ' + filtered.filter(c => c.status   === 'Submitted').length;

  const tbody    = $('table-body');
  const emptyDiv = $('empty-state');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  emptyDiv.classList.add('hidden');

  // Render newest first — never expose passwords
  tbody.innerHTML = [...filtered].reverse().map(c => `
    <tr>
      <td class="col-id">${escHtml(c.id)}</td>
      ${isAdmin ? `<td class="col-user">${escHtml(c.submittedBy)}</td>` : ''}
      <td>${escHtml(c.name)}</td>
      <td>${escHtml(c.category)}</td>
      <td><span class="badge badge-${c.priority.toLowerCase()}">${escHtml(c.priority)}</span></td>
      <td><span class="badge badge-status">${escHtml(c.status)}</span></td>
      <td class="col-desc" title="${escHtml(c.desc)}">${escHtml(c.desc)}</td>
      <td style="font-size:12px;color:var(--muted);font-family:var(--font-mono);white-space:nowrap">${escHtml(c.date)}</td>
    </tr>
  `).join('');

  updateStatusCount();
}

// ── Keyboard shortcuts ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  $('l-user').addEventListener('keydown', e => { if (e.key === 'Enter') $('l-pass').focus(); });
  $('l-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  $('s-pass2').addEventListener('keydown', e => { if (e.key === 'Enter') doSignup(); });

  seedAdmin();
  restoreSession();
});

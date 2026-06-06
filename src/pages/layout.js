import { supabase } from '../api/supabaseClient';

export function renderSidebar(currentPath) {
  return `
    <div class="sidebar">
      <div class="sidebar-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Station Hub</span>
      </div>
      <nav>
        <a href="/dashboard" class="nav-link ${currentPath === '/dashboard' ? 'active' : ''}" data-link>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </a>
        <a href="/stations" class="nav-link ${currentPath === '/stations' ? 'active' : ''}" data-link>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Station Profile
        </a>
        <a href="/manpower" class="nav-link ${currentPath === '/manpower' ? 'active' : ''}" data-link>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Data Karyawan
        </a>
      </nav>
      <div style="margin-top: auto;">
        <button id="logout-btn" class="nav-link" style="width: 100%; text-align: left; background: none; border: none;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Sign Out
        </button>
      </div>
    </div>
  `;
}

export function attachLayoutListeners(routerNavigate) {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      document.getElementById('loader-overlay').classList.remove('hidden');
      await supabase.auth.signOut();
      document.getElementById('loader-overlay').classList.add('hidden');
      routerNavigate('/login');
    });
  }
}

export function renderLayout(content, currentPath) {
  return `
    <div class="app-container">
      ${renderSidebar(currentPath)}
      <main class="main-content">
        ${content}
      </main>
    </div>
  `;
}

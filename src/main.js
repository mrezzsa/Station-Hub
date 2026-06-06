import './style.css';
import { supabase } from './api/supabaseClient';
import { renderLogin, attachLoginListeners } from './pages/login';
import { renderLayout, attachLayoutListeners } from './pages/layout';
import { renderDashboard, attachDashboardListeners } from './pages/dashboard';
import { renderStationProfile, attachStationProfileListeners } from './pages/stationProfile';
import { renderManpower, attachManpowerListeners } from './pages/manpower';

const appDiv = document.getElementById('app');

// Simple Router
const routes = {
  '/login': async () => {
    appDiv.innerHTML = renderLogin();
    attachLoginListeners(navigateTo);
  },
  '/dashboard': async () => {
    const content = await renderDashboard();
    appDiv.innerHTML = renderLayout(content, '/dashboard');
    attachLayoutListeners(navigateTo);
    attachDashboardListeners(navigateTo);
  },
  '/stations': async () => {
    const content = await renderStationProfile();
    appDiv.innerHTML = renderLayout(content, '/stations');
    attachLayoutListeners(navigateTo);
    attachStationProfileListeners(navigateTo);
  },
  '/manpower': async () => {
    const content = await renderManpower();
    appDiv.innerHTML = renderLayout(content, '/manpower');
    attachLayoutListeners(navigateTo);
    attachManpowerListeners(navigateTo);
  }
};

async function navigateTo(path) {
  window.history.pushState({}, path, window.location.origin + path);
  await handleRoute();
}

async function handleRoute() {
  let path = window.location.pathname;

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && path !== '/login') {
    navigateTo('/login');
    return;
  }

  if (session && path === '/login') {
    navigateTo('/dashboard');
    return;
  }

  if (path === '/') {
    navigateTo('/dashboard');
    return;
  }

  const route = routes[path] || routes['/dashboard'];
  await route();

  // Attach link listeners for SPA navigation
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(e.currentTarget.getAttribute('href'));
    });
  });
}

// Handle back/forward buttons
window.addEventListener('popstate', handleRoute);

// Initial load
handleRoute();

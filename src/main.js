import './style.css';
import { supabase } from './api/supabaseClient';

// Initialize Theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
import { renderLogin, attachLoginListeners } from './pages/login';
import { renderLayout, attachLayoutListeners } from './pages/layout';
import { renderDashboard, attachDashboardListeners } from './pages/dashboard';
import { renderStationProfile, attachStationProfileListeners } from './pages/stationProfile';
import { renderManpower, attachManpowerListeners } from './pages/manpower';
import { renderSettings, attachSettingsListeners } from './pages/settings';
import { renderStationDetails, attachStationDetailsListeners } from './pages/stationDetails';

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
  },
  '/settings': async () => {
    const content = await renderSettings();
    appDiv.innerHTML = renderLayout(content, '/settings');
    attachLayoutListeners(navigateTo);
    attachSettingsListeners(navigateTo);
  },
  '/station-details': async () => {
    const content = await renderStationDetails();
    appDiv.innerHTML = renderLayout(content, '/stations');
    attachLayoutListeners(navigateTo);
    attachStationDetailsListeners(navigateTo);
  }
};

async function navigateTo(path) {
  window.history.pushState({}, path, window.location.origin + path);
  await handleRoute();
}

async function handleRoute() {
  let path = window.location.pathname;
  let search = window.location.search;

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
      const href = e.currentTarget.getAttribute('href');
      // For links with search params
      if (href.includes('?')) {
        const [p, s] = href.split('?');
        window.history.pushState({}, href, window.location.origin + p + '?' + s);
        handleRoute();
      } else {
        navigateTo(href);
      }
    });
  });
}

// Handle back/forward buttons
window.addEventListener('popstate', handleRoute);

// Initial load
handleRoute();

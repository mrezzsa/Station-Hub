import { supabase } from '../api/supabaseClient';

export function renderLogin() {
  return `
    <div class="auth-container">
      <div class="auth-card">
        <div style="text-align:center; margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center;">
          <img src="/logo.png" alt="Angkasa Aviasi Servis" style="max-width: 140px; height: auto; object-fit: contain; margin-bottom: 1rem;" />
          <h2 style="color: var(--primary); font-size: 1.5rem; margin-bottom: 0.5rem;">Station Profile Hub</h2>
          <p style="color: var(--text-secondary);">Sign in to your account</p>
        </div>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Enter password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign In</button>
        </form>
        <div id="login-error" style="color: var(--status-danger); margin-top: 1rem; text-align: center; display: none;"></div>
      </div>
    </div>
  `;
}

export function attachLoginListeners(routerNavigate) {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      document.getElementById('loader-overlay').classList.remove('hidden');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      document.getElementById('loader-overlay').classList.add('hidden');

      if (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
      } else {
        routerNavigate('/dashboard');
      }
    });
  }
}

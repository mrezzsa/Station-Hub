import { supabase } from '../api/supabaseClient';

export async function renderSettings() {
  let users = [];
  try {
    const { data, error } = await supabase.from('tbl_users').select('*').order('created_at', { ascending: false });
    if (!error && data) users = data;
  } catch (e) {
    console.error("Could not fetch users", e);
  }

  const rows = users.map(user => {
    let roleBadge = 'badge-valid';
    if (user.role === 'Admin') roleBadge = 'badge-danger';
    if (user.role === 'Station Manager') roleBadge = 'badge-warning';

    return `
      <tr>
        <td>${user.email}</td>
        <td><strong>${user.full_name}</strong></td>
        <td><span class="badge ${roleBadge}">${user.role}</span></td>
        <td>${user.assigned_station || 'ALL'}</td>
        <td>
          <button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;" onclick="alert('Feature coming soon!')">Edit</button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <header style="margin-bottom: 2rem;">
      <h1>Settings & User Management</h1>
      <p style="color: var(--text-secondary);">Manage system access and assign roles to employees</p>
    </header>

    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: start;">
      
      <!-- Form Add User -->
      <div class="bento-card">
        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">Add New User Role</h3>
        <form id="add-user-form">
          <div class="form-group">
            <label for="user-email">Email Address</label>
            <input type="email" id="user-email" class="form-control" placeholder="employee@bandara.com" required>
          </div>
          <div class="form-group">
            <label for="user-name">Full Name</label>
            <input type="text" id="user-name" class="form-control" placeholder="Budi Santoso" required>
          </div>
          <div class="form-group">
            <label for="user-password">Password (For Login)</label>
            <input type="password" id="user-password" class="form-control" placeholder="Create a password" required>
          </div>
          <div class="form-group">
            <label for="user-role">Role</label>
            <select id="user-role" class="form-control" required>
              <option value="Viewer">Viewer (Read-Only)</option>
              <option value="Station Manager">Station Manager</option>
              <option value="Admin">Super Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-station">Assigned Station ID</label>
            <input type="text" id="user-station" class="form-control" placeholder="STN-CGK (or ALL)">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Save User Role</button>
        </form>
        <div id="user-message" style="margin-top: 1rem; text-align: center; font-size: 0.875rem; display: none;"></div>
      </div>

      <!-- Table Users -->
      <div class="table-container">
        <h3 style="margin-bottom: 1rem;">Registered User Roles</h3>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Station</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length > 0 ? rows : '<tr><td colspan="5" style="text-align: center;">No users registered yet.</td></tr>'}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

export function attachSettingsListeners(routerNavigate) {
  const form = document.getElementById('add-user-form');
  const msgDiv = document.getElementById('user-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('user-email').value;
      const full_name = document.getElementById('user-name').value;
      const password = document.getElementById('user-password').value;
      const role = document.getElementById('user-role').value;
      const assigned_station = document.getElementById('user-station').value || 'ALL';

      document.getElementById('loader-overlay').classList.remove('hidden');

      // 1. Create User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        document.getElementById('loader-overlay').classList.add('hidden');
        msgDiv.style.display = 'block';
        msgDiv.textContent = 'Error creating account: ' + authError.message;
        msgDiv.style.color = 'var(--status-danger)';
        return;
      }

      // 2. Save Role to tbl_users
      const { data, error } = await supabase
        .from('tbl_users')
        .insert([{ email, full_name, role, assigned_station }]);

      document.getElementById('loader-overlay').classList.add('hidden');

      msgDiv.style.display = 'block';
      if (error) {
        msgDiv.textContent = 'Auth created, but error saving role: ' + error.message;
        msgDiv.style.color = 'var(--status-danger)';
      } else {
        msgDiv.textContent = 'User successfully created! They can now log in.';
        msgDiv.style.color = 'var(--status-success)';
        form.reset();
        
        // Soft reload by pushing current path
        setTimeout(() => {
            routerNavigate('/settings');
        }, 2000);
      }
    });
  }
}

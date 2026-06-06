import { supabase } from '../api/supabaseClient';

export async function renderManpower() {
  let manpowerList = [];
  try {
    const { data, error } = await supabase.from('tbl_manpower').select(`
      id, employee_name, position, training_status, license_expiry,
      tbl_stations ( station_name )
    `).order('created_at', { ascending: false });
    if (!error && data) manpowerList = data;
  } catch (e) {
    console.error("Could not fetch manpower", e);
  }

  // Mock data if DB is empty
  if (manpowerList.length === 0) {
    manpowerList = [
      { id: 'EMP-001', employee_name: 'Budi Santoso', position: 'Avsec', training_status: 'Warning', license_expiry: '2026-07-06', tbl_stations: { station_name: 'Soekarno-Hatta' } },
      { id: 'EMP-002', employee_name: 'Siti Aminah', position: 'Ramp Handling', training_status: 'Valid', license_expiry: '2027-01-15', tbl_stations: { station_name: 'Juanda' } },
      { id: 'EMP-003', employee_name: 'Wayan Dipta', position: 'Admin', training_status: 'Expired', license_expiry: '2025-12-01', tbl_stations: { station_name: 'Ngurah Rai' } }
    ];
  }

  const rows = manpowerList.map(emp => {
    let statusClass = 'badge-valid';
    if (emp.training_status === 'Warning') statusClass = 'badge-warning';
    if (emp.training_status === 'Expired') statusClass = 'badge-danger';

    return `
      <tr>
        <td><strong>${emp.id}</strong></td>
        <td>${emp.employee_name}</td>
        <td>${emp.position}</td>
        <td>${emp.tbl_stations?.station_name || '-'}</td>
        <td><span class="badge ${statusClass}">${emp.training_status}</span></td>
        <td>${emp.license_expiry || '-'}</td>
        <td>
          <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View</button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Data Karyawan</h1>
        <p style="color: var(--text-secondary);">Manage employee competencies and licenses</p>
      </div>
      <button class="btn btn-primary">+ Add Employee</button>
    </header>

    <div class="table-container">
      <div style="margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center;">
        <input type="text" id="search-emp" class="form-control" style="max-width: 300px;" placeholder="Search employee...">
        <select id="filter-status" class="form-control" style="max-width: 200px;">
          <option value="all">All Status</option>
          <option value="valid">Valid</option>
          <option value="warning">Warning</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Station</th>
            <th>Status</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="emp-table-body">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

export function attachManpowerListeners(routerNavigate) {
  const searchInput = document.getElementById('search-emp');
  const filterSelect = document.getElementById('filter-status');

  const filterTable = () => {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    const statusFilter = filterSelect ? filterSelect.value.toLowerCase() : 'all';
    
    const rows = document.querySelectorAll('#emp-table-body tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const statusText = row.querySelector('.badge').textContent.toLowerCase();
      
      const matchesSearch = text.includes(term);
      const matchesStatus = statusFilter === 'all' || statusText === statusFilter;
      
      row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
  };

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (filterSelect) filterSelect.addEventListener('change', filterTable);
}

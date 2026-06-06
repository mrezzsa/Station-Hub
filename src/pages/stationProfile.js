import { supabase } from '../api/supabaseClient';

export async function renderStationProfile() {
  let stations = [];
  try {
    const { data, error } = await supabase.from('tbl_stations').select('*').order('created_at', { ascending: false });
    if (!error && data) stations = data;
  } catch (e) {
    console.error("Could not fetch stations", e);
  }

  // Mock data if DB is empty
  if (stations.length === 0) {
    stations = [
      { id: 'STN-CGK', station_name: 'Soekarno-Hatta', iata_code: 'CGK', manager_name: 'Budi Santoso' },
      { id: 'STN-SUB', station_name: 'Juanda', iata_code: 'SUB', manager_name: 'Siti Aminah' },
      { id: 'STN-DPS', station_name: 'Ngurah Rai', iata_code: 'DPS', manager_name: 'Wayan Dipta' }
    ];
  }

  const rows = stations.map(station => `
    <tr>
      <td><strong>${station.id}</strong></td>
      <td>${station.station_name}</td>
      <td><span class="badge badge-accent">${station.iata_code}</span></td>
      <td>${station.manager_name || '-'}</td>
      <td>
        <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Edit</button>
      </td>
    </tr>
  `).join('');

  return `
    <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Station Profile Explorer</h1>
        <p style="color: var(--text-secondary);">Manage airport stations data</p>
      </div>
      <button class="btn btn-primary">+ Add Station</button>
    </header>

    <div class="table-container">
      <div style="margin-bottom: 1.5rem; max-width: 400px;">
        <input type="text" id="search-station" class="form-control" placeholder="Search by station name or manager...">
      </div>
      <table>
        <thead>
          <tr>
            <th>Station ID</th>
            <th>Name</th>
            <th>IATA</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="station-table-body">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

export function attachStationProfileListeners(routerNavigate) {
  const searchInput = document.getElementById('search-station');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#station-table-body tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }
}

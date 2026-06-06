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

  const cards = stations.map(station => `
    <div class="bento-card station-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <span class="badge badge-accent">${station.iata_code}</span>
          <span style="font-size: 0.875rem; color: var(--text-secondary);"><strong>${station.id}</strong></span>
        </div>
        <h3 style="color: var(--text-primary); font-size: 1.25rem; margin-bottom: 0.25rem;">${station.station_name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.5rem;">Manager: <strong>${station.manager_name || '-'}</strong></p>
      </div>
      <a href="/station-details?id=${station.id}" data-link class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem; width: 100%;">View Details</a>
    </div>
  `).join('');

  return `
    <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Station Profile Explorer</h1>
        <p style="color: var(--text-secondary);">Manage airport stations data</p>
      </div>
      <button id="toggle-add-station-btn" class="btn btn-primary">+ Add Station</button>
    </header>

    <!-- Form Add Station (Hidden by default) -->
    <div id="add-station-section" class="bento-card hidden" style="margin-bottom: 2rem; border-color: var(--primary);">
      <h3 style="margin-bottom: 1rem;">Add New Station</h3>
      <form id="add-station-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div class="form-group">
          <label>Station ID</label>
          <input type="text" id="stn-id" class="form-control" placeholder="STN-CGK" required>
        </div>
        <div class="form-group">
          <label>Station Name</label>
          <input type="text" id="stn-name" class="form-control" placeholder="Soekarno-Hatta" required>
        </div>
        <div class="form-group">
          <label>IATA Code</label>
          <input type="text" id="stn-iata" class="form-control" placeholder="CGK" required>
        </div>
        <div class="form-group">
          <label>Manager Name</label>
          <input type="text" id="stn-manager" class="form-control" placeholder="Budi Santoso">
        </div>
        <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 1rem;">
          <button type="button" id="cancel-add-stn-btn" class="btn" style="background: none; border: 1px solid var(--border); color: var(--text-secondary);">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Station</button>
        </div>
        <div id="add-stn-error" style="grid-column: 1 / -1; color: var(--status-danger); text-align: right; display: none;"></div>
      </form>
    </div>

    <!-- Station Grid -->
    <div style="margin-bottom: 1.5rem; max-width: 400px;">
      <input type="text" id="search-station" class="form-control" placeholder="Search by station name or manager...">
    </div>
    
    <div class="bento-grid" id="station-grid-container">
      ${cards}
    </div>
  `;
}

export function attachStationProfileListeners(routerNavigate) {
  const searchInput = document.getElementById('search-station');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.station-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? 'flex' : 'none';
      });
    });
  }

  // Toggle Form Visibility
  const toggleBtn = document.getElementById('toggle-add-station-btn');
  const cancelBtn = document.getElementById('cancel-add-stn-btn');
  const addSection = document.getElementById('add-station-section');

  if (toggleBtn && addSection) {
    toggleBtn.addEventListener('click', () => addSection.classList.remove('hidden'));
  }
  if (cancelBtn && addSection) {
    cancelBtn.addEventListener('click', () => addSection.classList.add('hidden'));
  }

  // Handle Form Submit
  const addForm = document.getElementById('add-station-form');
  const errorDiv = document.getElementById('add-stn-error');

  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('stn-id').value;
      const station_name = document.getElementById('stn-name').value;
      const iata_code = document.getElementById('stn-iata').value;
      const manager_name = document.getElementById('stn-manager').value;

      document.getElementById('loader-overlay').classList.remove('hidden');

      const { error } = await supabase
        .from('tbl_stations')
        .insert([{ id, station_name, iata_code, manager_name }]);

      document.getElementById('loader-overlay').classList.add('hidden');

      if (error) {
        errorDiv.textContent = 'Error: ' + error.message;
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';
        addForm.reset();
        addSection.classList.add('hidden');
        routerNavigate('/stations');
      }
    });
  }
}

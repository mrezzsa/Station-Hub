import { supabase } from '../api/supabaseClient';

export async function renderStationDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const stationId = urlParams.get('id');

  if (!stationId) {
    return `<div style="text-align: center; padding: 3rem;"><h2>Station Not Found</h2><a href="/stations" data-link class="btn btn-primary">Back to Stations</a></div>`;
  }

  // Fetch Station Data
  let station = null;
  let manpower = [];
  let assets = [];

  try {
    const { data: stnData } = await supabase.from('tbl_stations').select('*').eq('id', stationId).single();
    station = stnData;

    const { data: mpData } = await supabase.from('tbl_manpower').select('*').eq('station_id', stationId);
    if (mpData) manpower = mpData;

    const { data: assetData } = await supabase.from('tbl_assets').select('*').eq('station_id', stationId);
    if (assetData) assets = assetData;
  } catch (e) {
    console.error("Error fetching station details", e);
  }

  if (!station) {
    // Mock Data fallback
    station = { id: stationId, station_name: 'Unknown Station', iata_code: '---', manager_name: 'N/A' };
    manpower = [
        { employee_name: 'Agus', position: 'Ramp Agent', training_status: 'Valid' },
        { employee_name: 'Siti', position: 'GSE Operator', training_status: 'Warning' }
    ];
    assets = [
        { asset_name: 'Baggage Tractor A1', category: 'Ground Support Equipment', condition: 'Serviceable', qty: 2 },
        { asset_name: 'Belt Loader', category: 'Ground Support Equipment', condition: 'Under Maintenance', qty: 1 }
    ];
  }

  const mpRows = manpower.map(mp => {
      let badge = 'badge-valid';
      if (mp.training_status === 'Warning') badge = 'badge-warning';
      if (mp.training_status === 'Expired') badge = 'badge-danger';
      return `<tr>
        <td>${mp.employee_name}</td>
        <td>${mp.position}</td>
        <td><span class="badge ${badge}">${mp.training_status || '-'}</span></td>
      </tr>`;
  }).join('');

  const assetRows = assets.map(ast => {
      let badge = 'badge-valid';
      if (ast.condition === 'Under Maintenance') badge = 'badge-warning';
      if (ast.condition === 'Unserviceable') badge = 'badge-danger';
      return `<tr>
        <td>${ast.asset_name}</td>
        <td>${ast.category || '-'}</td>
        <td>${ast.qty}</td>
        <td><span class="badge ${badge}">${ast.condition || '-'}</span></td>
      </tr>`;
  }).join('');

  return `
    <header style="margin-bottom: 2rem;">
      <a href="/stations" data-link style="color: var(--primary); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; margin-bottom: 1rem;">
        &larr; Back to Stations
      </a>
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <span class="badge badge-accent" style="margin-bottom: 0.5rem; display: inline-block;">${station.iata_code}</span>
          <h1 style="margin-bottom: 0;">${station.station_name} (${station.id})</h1>
        </div>
        <button class="btn btn-primary" onclick="alert('Edit feature coming soon')">Edit Station</button>
      </div>
      <p style="color: var(--text-secondary); margin-top: 0.5rem;">Manager: <strong>${station.manager_name || 'Not Assigned'}</strong></p>
    </header>

    <div class="bento-grid">
      <div class="bento-card" style="grid-column: span 1;">
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Manpower (${manpower.length})</h3>
        <div class="table-container" style="padding: 0; box-shadow: none; border: none; max-height: 300px; overflow-y: auto;">
          <table>
            <thead><tr><th>Name</th><th>Position</th><th>Training</th></tr></thead>
            <tbody>${mpRows.length ? mpRows : '<tr><td colspan="3">No manpower data.</td></tr>'}</tbody>
          </table>
        </div>
      </div>

      <div class="bento-card" style="grid-column: span 1;">
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Assets (${assets.length})</h3>
        <div class="table-container" style="padding: 0; box-shadow: none; border: none; max-height: 300px; overflow-y: auto;">
          <table>
            <thead><tr><th>Asset</th><th>Category</th><th>Qty</th><th>Condition</th></tr></thead>
            <tbody>${assetRows.length ? assetRows : '<tr><td colspan="4">No assets data.</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function attachStationDetailsListeners(routerNavigate) {
  // Listeners if needed
}

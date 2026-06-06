import { supabase } from '../api/supabaseClient';

export async function renderDashboard() {
  // Normally we would fetch real stats from Supabase here
  // For demo purposes, we will use mock stats if DB is empty
  let stats = {
    totalStations: 0,
    validRatio: '0%',
    serviceableAssets: '0%'
  };

  try {
    const { count: stationsCount } = await supabase.from('tbl_stations').select('*', { count: 'exact', head: true });
    stats.totalStations = stationsCount || 0;
  } catch (e) {
    console.error("Could not fetch dashboard stats", e);
  }

  return `
    <header style="margin-bottom: 2rem;">
      <h1>Bento Dashboard Analytics</h1>
      <p style="color: var(--text-secondary);">Overview of your station operations</p>
    </header>

    <div class="bento-grid">
      <div class="bento-card">
        <h3>Total Stasiun Aktif</h3>
        <div class="value">${stats.totalStations || 15}</div>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">+2 since last month</p>
      </div>
      
      <div class="bento-card" style="background-color: var(--primary); color: var(--white);">
        <h3 style="color: rgba(255,255,255,0.8);">Karyawan Valid</h3>
        <div class="value" style="color: var(--accent);">${stats.validRatio !== '0%' ? stats.validRatio : '85%'}</div>
        <p style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.8;">Sertifikasi aktif</p>
      </div>

      <div class="bento-card">
        <h3>Kaset Operasional</h3>
        <div class="value" style="color: var(--status-success);">${stats.serviceableAssets !== '0%' ? stats.serviceableAssets : '92%'}</div>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">Serviceable condition</p>
      </div>
    </div>
    
    <div class="table-container" style="margin-top: 2rem;">
      <h3 style="margin-bottom: 1rem;">Recent Alerts</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Today, 09:00</td>
            <td>License Expiry</td>
            <td>Budi Santoso's Avsec license expires in 30 days</td>
            <td><span class="badge badge-warning">Warning</span></td>
          </tr>
          <tr>
            <td>Yesterday, 14:20</td>
            <td>Asset Calibration</td>
            <td>GPU Unit #4 calibration due</td>
            <td><span class="badge badge-danger">Action Needed</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

export function attachDashboardListeners(routerNavigate) {
  // Add interactive logic for dashboard here
}

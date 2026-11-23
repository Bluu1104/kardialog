export function renderVitalsChart(container, vitals) {
  if (!vitals.length) {
    container.innerHTML = '<div class="empty-state">Belum ada data tanda vital untuk ditampilkan sebagai grafik.</div>';
    return;
  }

  const data = [...vitals]
    .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt))
    .slice(-10);

  const width = 620;
  const height = 220;
  const pad = { top: 18, right: 20, bottom: 32, left: 40 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const allVals = data.flatMap((d) => [Number(d.systolic), Number(d.diastolic), Number(d.pulse)]);
  const minVal = Math.max(40, Math.floor((Math.min(...allVals) - 10) / 10) * 10);
  const maxVal = Math.ceil((Math.max(...allVals) + 10) / 10) * 10;
  const range = Math.max(20, maxVal - minVal);

  const xPos = (idx) => {
    if (data.length === 1) return pad.left + plotW / 2;
    return pad.left + (idx / (data.length - 1)) * plotW;
  };
  const yPos = (val) => pad.top + plotH - ((val - minVal) / range) * plotH;

  const makePath = (key) =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(Number(d[key])).toFixed(1)}`)
      .join(' ');

  let gridLines = '';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round(minVal + (range * i) / 4);
    const y = yPos(val).toFixed(1);
    gridLines += `
      <line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e3e1da" stroke-dasharray="3 3" />
      <text x="${pad.left - 8}" y="${Number(y) + 4}" text-anchor="end" font-size="10.5" fill="#7c7a72" font-family="IBM Plex Mono, monospace">${val}</text>
    `;
  }

  const xLabels = data
    .map((d, i) => {
      const dt = new Date(d.recordedAt);
      const label = `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}`;
      return `<text x="${xPos(i).toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="10.5" fill="#7c7a72" font-family="IBM Plex Mono, monospace">${label}</text>`;
    })
    .join('');

  const labelMap = { systolic: 'Sistolik', diastolic: 'Diastolik', pulse: 'Nadi' };
  const points = (key, color) =>
    data
      .map(
        (d, i) =>
          `<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(Number(d[key])).toFixed(1)}" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.5">
            <title>${d.recordedAt.replace('T', ' ')} — ${labelMap[key]}: ${d[key]}</title>
          </circle>`
      )
      .join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="220" role="img" aria-label="Grafik tren tekanan darah dan denyut nadi">
      ${gridLines}
      <path d="${makePath('systolic')}" fill="none" stroke="#b91c1c" stroke-width="2" />
      <path d="${makePath('diastolic')}" fill="none" stroke="#0f766e" stroke-width="2" />
      <path d="${makePath('pulse')}" fill="none" stroke="#b45309" stroke-width="1.8" stroke-dasharray="4 3" />
      ${points('systolic', '#b91c1c')}
      ${points('diastolic', '#0f766e')}
      ${points('pulse', '#b45309')}
      ${xLabels}
    </svg>
  `;
}

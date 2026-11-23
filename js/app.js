import { loadState, saveState, todayKey, classifyBloodPressure } from './store.js';
import { ACS_CHAPTERS, DAILY_HABITS, LIFESTYLE_PILLARS } from './content.js';
import { renderVitalsChart } from './charts.js';

let state = loadState();
let activeChapterId = ACS_CHAPTERS[0].id;
let activePillarId = LIFESTYLE_PILLARS[0].id;
let activeAlarmMeds = [];

let breathTimer = null;
let breathStepIndex = 0;
let breathSecondsLeft = 0;
const BREATH_CYCLE = [
  { phase: 'Tarik Napas', duration: 4, expand: true },
  { phase: 'Tahan', duration: 4, expand: true },
  { phase: 'Hembuskan', duration: 6, expand: false }
];

const VIEW_TITLES = {
  overview: 'Ringkasan Klinis',
  medications: 'Pengingat & Kepatuhan Obat',
  vitals: 'Pemantauan Kesehatan',
  education: 'Edukasi Sindrom Koroner Akut (ACS)',
  lifestyle: 'Pola Hidup Sehat Jantung'
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast-item';
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 220);
  }, 2600);
}

function formatDateID(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function formatDateTimeShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Abaikan bila autoplay audio dibatasi browser
  }
}

/* ---------- Navigation ---------- */
function switchView(viewName) {
  document.querySelectorAll('.view').forEach((el) => {
    el.classList.toggle('is-active', el.id === `view-${viewName}`);
  });
  document.querySelectorAll('[data-view]').forEach((btn) => {
    const isActive = btn.dataset.view === viewName;
    btn.classList.toggle('is-active', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });
  document.getElementById('pageTitle').textContent = VIEW_TITLES[viewName] || 'KardiaLog';
  window.scrollTo({ top: 0, behavior: 'instant' });
  renderAll();
}

/* ---------- Adherence Calculations ---------- */
function getMedLogKey(medId, dateStr = todayKey()) {
  return `${dateStr}|${medId}`;
}

function isMedTakenToday(medId) {
  return state.medLogs[getMedLogKey(medId)]?.status === 'taken';
}

function getTodayAdherence() {
  const total = state.medications.length;
  if (!total) return { taken: 0, total: 0, pct: 0 };
  const taken = state.medications.filter((m) => isMedTakenToday(m.id)).length;
  return { taken, total, pct: Math.round((taken / total) * 100) };
}

function getNextScheduledMed() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...state.medications].sort((a, b) => a.time.localeCompare(b.time));
  const pending = sorted.filter((m) => !isMedTakenToday(m.id));
  if (!pending.length) return null;

  const upcoming = pending.find((m) => {
    const [h, min] = m.time.split(':').map(Number);
    return h * 60 + min >= nowMinutes;
  });
  return upcoming || pending[0];
}

function toggleMedStatus(medId) {
  const key = getMedLogKey(medId);
  const currentlyTaken = state.medLogs[key]?.status === 'taken';
  const med = state.medications.find((m) => m.id === medId);
  if (currentlyTaken) {
    state.medLogs[key] = { status: 'missed', loggedAt: new Date().toISOString() };
    if (med) showToast(`${med.name} ditandai belum diminum.`);
  } else {
    state.medLogs[key] = { status: 'taken', loggedAt: new Date().toISOString() };
    if (med) showToast(`${med.name} tercatat sudah diminum.`);
  }
  saveState(state);
  renderAll();
}

/* ---------- Renderers ---------- */
function renderMarList(container, allowDelete) {
  const sorted = [...state.medications].sort((a, b) => a.time.localeCompare(b.time));
  if (!sorted.length) {
    container.innerHTML = '<div class="empty-state">Belum ada resep obat terjadwal. Tambahkan obat di formulir sebelah kanan.</div>';
    return;
  }

  container.innerHTML = sorted
    .map((med) => {
      const taken = isMedTakenToday(med.id);
      return `
        <div class="mar-row">
          <div class="mar-time">${escapeHtml(med.time)}</div>
          <div class="mar-info">
            <strong>${escapeHtml(med.name)}</strong>
            <div class="mar-meta">${escapeHtml(med.dose)}${med.note ? ` &middot; ${escapeHtml(med.note)}` : ''}</div>
          </div>
          <div class="mar-actions">
            <button class="status-toggle ${taken ? 'is-taken' : ''}" data-toggle-med="${med.id}" type="button">
              ${taken ? '&#10003; Sudah Diminum' : 'Belum Diminum'}
            </button>
            ${allowDelete ? `<button class="btn btn-danger-ghost" data-delete-med="${med.id}" type="button" title="Hapus obat">Hapus</button>` : ''}
          </div>
        </div>
      `;
    })
    .join('');
}

function renderOverview() {
  const adh = getTodayAdherence();
  const nextMed = getNextScheduledMed();
  const latestVital = [...state.vitals].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
  const todayHabits = state.habitsByDate[todayKey()] || [];
  const bpInfo = latestVital ? classifyBloodPressure(latestVital.systolic, latestVital.diastolic) : null;

  document.getElementById('overviewSummaryStrip').innerHTML = `
    <div class="strip-cell">
      <div class="strip-label">Kepatuhan Obat Hari Ini</div>
      <div class="strip-value">${adh.taken}/${adh.total}</div>
      <div class="strip-meta">${adh.pct}% dosis terjadwal</div>
    </div>
    <div class="strip-cell">
      <div class="strip-label">Jadwal Berikutnya</div>
      <div class="strip-value">${nextMed ? escapeHtml(nextMed.time) : 'Selesai'}</div>
      <div class="strip-meta">${nextMed ? escapeHtml(nextMed.name) : 'Semua obat hari ini sudah diminum'}</div>
    </div>
    <div class="strip-cell">
      <div class="strip-label">Tekanan Darah Terakhir</div>
      <div class="strip-value">${latestVital ? `${latestVital.systolic}/${latestVital.diastolic}` : '—'}</div>
      <div class="strip-meta">${bpInfo ? bpInfo.label : 'Belum ada pemeriksaan'}</div>
    </div>
    <div class="strip-cell">
      <div class="strip-label">Target Gaya Hidup</div>
      <div class="strip-value">${todayHabits.length}/${DAILY_HABITS.length}</div>
      <div class="strip-meta">Kebiasaan jantung sehat</div>
    </div>
  `;

  renderMarList(document.getElementById('overviewMedTimeline'), false);

  const vitalCard = document.getElementById('overviewVitalCard');
  const vitalTime = document.getElementById('overviewVitalTime');
  if (!latestVital) {
    vitalTime.textContent = 'Belum ada catatan';
    vitalCard.innerHTML = '<div class="empty-state">Catat tekanan darah, nadi, dan berat badan pertama Anda.</div>';
  } else {
    vitalTime.textContent = `Diperiksa ${formatDateTimeShort(latestVital.recordedAt)}`;
    const badgeClass = bpInfo.level === 'ok' ? 'badge-ok' : bpInfo.level === 'warn' ? 'badge-warn' : 'badge-danger';
    vitalCard.innerHTML = `
      <div style="margin-bottom: 12px;">
        <span class="badge ${badgeClass}">${bpInfo.label}</span>
      </div>
      <div class="vital-readout">
        <div class="vital-readout-item">
          <span>Tekanan Darah</span>
          <strong>${latestVital.systolic}/${latestVital.diastolic}</strong>
        </div>
        <div class="vital-readout-item">
          <span>Denyut Nadi</span>
          <strong>${latestVital.pulse} bpm</strong>
        </div>
        <div class="vital-readout-item">
          <span>Berat Badan</span>
          <strong>${latestVital.weight} kg</strong>
        </div>
      </div>
      <p class="vital-symptom-note"><strong>Keluhan:</strong> ${escapeHtml(latestVital.symptoms || 'Tidak ada keluhan tercatat.')}</p>
    `;
  }

  document.getElementById('overviewHabitPreview').innerHTML = DAILY_HABITS.slice(0, 3)
    .map((h) => {
      const checked = todayHabits.includes(h.id);
      return `
        <label class="habit-item ${checked ? 'is-done' : ''}" style="margin-bottom: 8px;">
          <input type="checkbox" data-habit-id="${h.id}" ${checked ? 'checked' : ''} />
          <span><strong>${escapeHtml(h.title)}</strong></span>
        </label>
      `;
    })
    .join('');
}

function renderMedicationsView() {
  renderMarList(document.getElementById('medScheduleList'), true);

  const filter = document.getElementById('medHistoryFilter').value;
  const tbody = document.getElementById('medHistoryBody');
  const rows = [];
  const today = todayKey();

  state.medications.forEach((med) => {
    const key = getMedLogKey(med.id, today);
    const log = state.medLogs[key];
    rows.push({
      date: today,
      time: med.time,
      medLabel: `${med.name} (${med.dose})`,
      status: log?.status || 'missed',
      loggedAt: log?.loggedAt || null
    });
  });

  Object.entries(state.medLogs).forEach(([key, log]) => {
    const [dateStr, medId] = key.split('|');
    if (dateStr === today) return;
    const med = state.medications.find((m) => m.id === medId);
    rows.push({
      date: dateStr,
      time: med?.time || '—',
      medLabel: med ? `${med.name} (${med.dose})` : 'Obat (telah dihapus)',
      status: log.status,
      loggedAt: log.loggedAt
    });
  });

  const filtered = rows
    .filter((r) => filter === 'all' || r.status === filter)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Tidak ada riwayat sesuai filter.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map((r) => {
      const isTaken = r.status === 'taken';
      return `
        <tr>
          <td class="mono">${escapeHtml(r.date)}</td>
          <td class="mono">${escapeHtml(r.time)}</td>
          <td>${escapeHtml(r.medLabel)}</td>
          <td><span class="badge ${isTaken ? 'badge-ok' : 'badge-warn'}">${isTaken ? 'Sudah Diminum' : 'Belum'}</span></td>
          <td class="mono">${r.loggedAt ? formatDateTimeShort(r.loggedAt) : '—'}</td>
        </tr>
      `;
    })
    .join('');
}

function renderVitalsView() {
  renderVitalsChart(document.getElementById('vitalsChartContainer'), state.vitals);

  const exportBtn = document.getElementById('exportCsvBtn');
  const exportStatus = document.getElementById('vitalsExportStatus');
  const hasVitals = state.vitals.length > 0;
  exportBtn.disabled = !hasVitals;
  exportBtn.title = hasVitals
    ? 'Unduh log pemeriksaan (terbaru ke terlama) sebagai CSV'
    : 'Belum ada data pemeriksaan untuk diekspor';
  exportStatus.textContent = hasVitals
    ? `${state.vitals.length} catatan siap diekspor untuk laporan dokter`
    : 'Belum ada data pemeriksaan untuk diekspor';

  const tbody = document.getElementById('vitalsTableBody');
  const sorted = [...state.vitals].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

  if (!sorted.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Belum ada catatan pemeriksaan.</td></tr>';
    return;
  }

  tbody.innerHTML = sorted
    .map((v) => {
      const bp = classifyBloodPressure(v.systolic, v.diastolic);
      const badgeClass = bp.level === 'ok' ? 'badge-ok' : bp.level === 'warn' ? 'badge-warn' : 'badge-danger';
      return `
        <tr>
          <td class="mono">${formatDateTimeShort(v.recordedAt)}</td>
          <td>
            <strong class="mono">${v.systolic}/${v.diastolic}</strong>
            <div><span class="badge ${badgeClass}" style="margin-top:4px;">${bp.label}</span></div>
          </td>
          <td class="mono">${v.pulse} bpm</td>
          <td class="mono">${v.weight} kg</td>
          <td>${escapeHtml(v.symptoms || '—')}</td>
          <td><button class="btn btn-danger-ghost" data-delete-vital="${v.id}" type="button">Hapus</button></td>
        </tr>
      `;
    })
    .join('');
}

function renderEducationView() {
  document.getElementById('acsChapterList').innerHTML = ACS_CHAPTERS.map(
    (ch) => `
      <button class="chapter-btn ${ch.id === activeChapterId ? 'is-active' : ''}" data-chapter="${ch.id}" type="button">
        <span class="chapter-num">${ch.num}</span>
        <span>${escapeHtml(ch.title)}</span>
      </button>
    `
  ).join('');

  const chapter = ACS_CHAPTERS.find((c) => c.id === activeChapterId) || ACS_CHAPTERS[0];
  const sectionsHtml = chapter.sections
    .map(
      (sec) => `
        <h3>${escapeHtml(sec.heading)}</h3>
        <ul>
          ${sec.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `
    )
    .join('');

  const calloutHtml = chapter.callout
    ? `<div class="clinical-callout ${chapter.callout.type === 'danger' ? 'is-danger' : ''}">${escapeHtml(chapter.callout.text)}</div>`
    : '';

  document.getElementById('acsArticleBody').innerHTML = `
    <p class="eyebrow">Bab ${chapter.num} &middot; ${escapeHtml(chapter.eyebrow)}</p>
    <h2>${escapeHtml(chapter.title)}</h2>
    <p class="lead">${escapeHtml(chapter.lead)}</p>
    ${sectionsHtml}
    ${calloutHtml}
  `;
}

function renderLifestyleView() {
  const todayHabits = state.habitsByDate[todayKey()] || [];
  document.getElementById('habitScoreBadge').textContent = `${todayHabits.length}/${DAILY_HABITS.length}`;

  document.getElementById('habitChecklist').innerHTML = DAILY_HABITS.map((h) => {
    const checked = todayHabits.includes(h.id);
    return `
      <label class="habit-item ${checked ? 'is-done' : ''}">
        <input type="checkbox" data-habit-id="${h.id}" ${checked ? 'checked' : ''} />
        <div>
          <strong>${escapeHtml(h.title)}</strong>
          <p class="muted">${escapeHtml(h.desc)}</p>
        </div>
      </label>
    `;
  }).join('');

  document.getElementById('lifestyleTabs').innerHTML = LIFESTYLE_PILLARS.map((p) => {
    const isSelected = p.id === activePillarId;
    return `
      <button
        class="pillar-tab ${isSelected ? 'is-active' : ''}"
        data-pillar="${p.id}"
        role="tab"
        aria-selected="${isSelected ? 'true' : 'false'}"
        aria-controls="lifestyleContent"
        type="button"
      >
        ${escapeHtml(p.label)}
      </button>
    `;
  }).join('');

  const pillar = LIFESTYLE_PILLARS.find((p) => p.id === activePillarId) || LIFESTYLE_PILLARS[0];
  const swapHtml = pillar.swaps
    ? `
      <table class="swap-table">
        <thead>
          <tr><th>Kurangi / Hindari</th><th>Pilihan Lebih Aman untuk Jantung</th></tr>
        </thead>
        <tbody>
          ${pillar.swaps.map(([bad, good]) => `<tr><td>${escapeHtml(bad)}</td><td>${escapeHtml(good)}</td></tr>`).join('')}
        </tbody>
      </table>
    `
    : '';

  document.getElementById('lifestyleContent').innerHTML = `
    <h3>${escapeHtml(pillar.title)}</h3>
    <p>${escapeHtml(pillar.intro)}</p>
    <ul>${pillar.points.map((pt) => `<li>${pt}</li>`).join('')}</ul>
    ${swapHtml}
  `;
}

function renderAll() {
  renderOverview();
  renderMedicationsView();
  renderVitalsView();
  renderEducationView();
  renderLifestyleView();
}

/* ---------- Notifications & Real-Time Scheduler ---------- */
function updateNotifButton() {
  const btn = document.getElementById('notifPermissionBtn');
  if (!('Notification' in window)) {
    btn.textContent = 'Notifikasi Browser N/A';
    btn.disabled = true;
    return;
  }
  if (Notification.permission === 'granted') {
    btn.textContent = 'Notifikasi Aktif ✓';
  } else if (Notification.permission === 'denied') {
    btn.textContent = 'Notifikasi Diblokir';
  } else {
    btn.textContent = 'Aktifkan Notifikasi';
  }
}

function pruneOldNotifiedKeys() {
  const today = todayKey();
  if (!state.notifiedKeys || typeof state.notifiedKeys !== 'object') {
    state.notifiedKeys = {};
    return;
  }
  let changed = false;
  Object.keys(state.notifiedKeys).forEach((key) => {
    if (!key.startsWith(`${today}|`)) {
      delete state.notifiedKeys[key];
      changed = true;
    }
  });
  if (changed) saveState(state);
}

function renderAlarmBanner() {
  const banner = document.getElementById('alarmBanner');
  const textEl = document.getElementById('alarmText');
  const markBtn = document.getElementById('alarmMarkTakenBtn');

  if (!activeAlarmMeds.length) {
    banner.hidden = true;
    return;
  }

  const isTestOnly = activeAlarmMeds.every((m) => m.id === '__test__');
  textEl.textContent = activeAlarmMeds
    .map((m) => `${m.name} (${m.dose}) — ${m.time}`)
    .join(' • ');

  markBtn.textContent = isTestOnly
    ? 'Selesai Uji'
    : activeAlarmMeds.length > 1
      ? `Tandai Semua (${activeAlarmMeds.length}) Sudah Diminum`
      : 'Tandai Sudah Diminum';

  banner.hidden = false;
}

function triggerMedReminder(medsInput) {
  const incoming = Array.isArray(medsInput) ? medsInput : [medsInput];
  if (!incoming.length) return;

  const isTestCall = incoming.every((m) => m.id === '__test__');
  if (isTestCall) {
    activeAlarmMeds = incoming;
  } else {
    const merged = new Map(
      activeAlarmMeds
        .filter((m) => m.id !== '__test__')
        .map((m) => [m.id, m])
    );
    incoming.forEach((m) => merged.set(m.id, m));
    activeAlarmMeds = [...merged.values()];
  }

  renderAlarmBanner();
  playChime();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const bodyText = incoming
        .map((m) => `${m.name} (${m.dose})${m.note ? ` — ${m.note}` : ''}`)
        .join('\n');
      new Notification(
        isTestCall ? 'Uji Pengingat Obat KardiaLog' : 'Pengingat Obat KardiaLog',
        { body: bodyText }
      );
    } catch {
      // Abaikan bila dibatasi oleh konteks browser
    }
  }
}

function checkScheduledReminders() {
  pruneOldNotifiedKeys();

  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const today = todayKey(now);

  const dueMeds = [];
  state.medications.forEach((med) => {
    const notifyKey = `${today}|${med.id}|${hhmm}`;
    if (med.time === hhmm && !isMedTakenToday(med.id) && !state.notifiedKeys[notifyKey]) {
      state.notifiedKeys[notifyKey] = true;
      dueMeds.push(med);
    }
  });

  if (dueMeds.length > 0) {
    saveState(state);
    triggerMedReminder(dueMeds);
  }
}

/* ---------- CSV Export ---------- */
function exportVitalsCsv() {
  if (!state.vitals.length) {
    showToast('Belum ada data pemeriksaan untuk diekspor.');
    return;
  }
  const sortedVitals = [...state.vitals].sort(
    (a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)
  );
  const header = ['Waktu Pemeriksaan', 'Sistolik (mmHg)', 'Diastolik (mmHg)', 'Klasifikasi', 'Nadi (bpm)', 'Berat Badan (kg)', 'Keluhan'];
  const rows = sortedVitals.map((v) => {
    const bp = classifyBloodPressure(v.systolic, v.diastolic).label;
    const safeSymptom = `"${String(v.symptoms || '').replace(/"/g, '""')}"`;
    return [v.recordedAt, v.systolic, v.diastolic, bp, v.pulse, v.weight, safeSymptom].join(',');
  });
  const csv = '\uFEFF' + [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kardialog-vital-${todayKey()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('File CSV pemeriksaan berhasil diunduh.');
}

/* ---------- Breathing Timer ---------- */
function toggleBreathing() {
  const btn = document.getElementById('breathToggleBtn');
  const ring = document.getElementById('breathRing');
  const phaseEl = document.getElementById('breathPhase');
  const countEl = document.getElementById('breathCount');

  if (breathTimer) {
    clearInterval(breathTimer);
    breathTimer = null;
    ring.classList.remove('is-expand');
    phaseEl.textContent = 'Siap';
    countEl.textContent = '4-4-6';
    btn.textContent = 'Mulai Sesi';
    return;
  }

  breathStepIndex = 0;
  breathSecondsLeft = BREATH_CYCLE[0].duration;
  btn.textContent = 'Hentikan';

  const tick = () => {
    const step = BREATH_CYCLE[breathStepIndex];
    phaseEl.textContent = step.phase;
    countEl.textContent = `${breathSecondsLeft}d`;
    ring.classList.toggle('is-expand', step.expand);

    breathSecondsLeft -= 1;
    if (breathSecondsLeft <= 0) {
      breathStepIndex = (breathStepIndex + 1) % BREATH_CYCLE.length;
      breathSecondsLeft = BREATH_CYCLE[breathStepIndex].duration;
    }
  };

  tick();
  breathTimer = setInterval(tick, 1000);
}

/* ---------- Event Listeners & Boot ---------- */
function setDefaultDateTimeInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('vitalDateTime').value = now.toISOString().slice(0, 16);
}

function updateLiveClock() {
  const now = new Date();
  document.getElementById('currentDateLabel').textContent = formatDateID(now);
  document.getElementById('liveClock').textContent = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      switchView(viewBtn.dataset.view);
      return;
    }

    const gotoBtn = e.target.closest('[data-goto]');
    if (gotoBtn) {
      switchView(gotoBtn.dataset.goto);
      return;
    }

    const toggleMedBtn = e.target.closest('[data-toggle-med]');
    if (toggleMedBtn) {
      toggleMedStatus(toggleMedBtn.dataset.toggleMed);
      return;
    }

    const deleteMedBtn = e.target.closest('[data-delete-med]');
    if (deleteMedBtn) {
      const id = deleteMedBtn.dataset.deleteMed;
      state.medications = state.medications.filter((m) => m.id !== id);
      saveState(state);
      renderAll();
      showToast('Jadwal obat dihapus.');
      return;
    }

    const deleteVitalBtn = e.target.closest('[data-delete-vital]');
    if (deleteVitalBtn) {
      const id = deleteVitalBtn.dataset.deleteVital;
      state.vitals = state.vitals.filter((v) => v.id !== id);
      saveState(state);
      renderAll();
      showToast('Catatan pemeriksaan dihapus.');
      return;
    }

    const chapterBtn = e.target.closest('[data-chapter]');
    if (chapterBtn) {
      activeChapterId = chapterBtn.dataset.chapter;
      renderEducationView();
      return;
    }

    const pillarBtn = e.target.closest('[data-pillar]');
    if (pillarBtn) {
      activePillarId = pillarBtn.dataset.pillar;
      renderLifestyleView();
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-habit-id]')) {
      const id = e.target.dataset.habitId;
      const today = todayKey();
      const set = new Set(state.habitsByDate[today] || []);
      if (e.target.checked) set.add(id);
      else set.delete(id);
      state.habitsByDate[today] = [...set];
      saveState(state);
      renderAll();
    }
  });

  document.getElementById('medForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name')).trim();
    state.medications.push({
      id: `m_${Date.now()}`,
      name,
      dose: String(fd.get('dose')).trim(),
      time: String(fd.get('time')),
      note: String(fd.get('note') || '').trim()
    });
    saveState(state);
    e.target.reset();
    renderAll();
    showToast(`Jadwal ${name} ditambahkan.`);
  });

  document.getElementById('medHistoryFilter').addEventListener('change', renderMedicationsView);

  const updateBpPreview = () => {
    const sys = document.getElementById('vitalSys').value;
    const dia = document.getElementById('vitalDia').value;
    const box = document.getElementById('bpLivePreview');
    const info = classifyBloodPressure(sys, dia);
    box.className = `bp-preview ${info.level !== 'neutral' ? `level-${info.level}` : ''}`;
    box.textContent = info.level === 'neutral'
      ? 'Masukkan tekanan darah untuk melihat klasifikasi klinis.'
      : `${info.label} — ${info.advice}`;
  };
  document.getElementById('vitalSys').addEventListener('input', updateBpPreview);
  document.getElementById('vitalDia').addEventListener('input', updateBpPreview);

  document.getElementById('vitalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const systolic = Number(fd.get('systolic'));
    const diastolic = Number(fd.get('diastolic'));

    if (diastolic >= systolic) {
      updateBpPreview();
      document.getElementById('vitalDia').focus();
      showToast('Tekanan diastolik harus lebih rendah dari sistolik.');
      return;
    }

    state.vitals.push({
      id: `v_${Date.now()}`,
      systolic,
      diastolic,
      pulse: Number(fd.get('pulse')),
      weight: Number(fd.get('weight')),
      recordedAt: String(fd.get('recordedAt')),
      symptoms: String(fd.get('symptoms') || '').trim()
    });
    saveState(state);
    e.target.reset();
    setDefaultDateTimeInput();
    updateBpPreview();
    renderAll();
    showToast('Catatan tanda vital tersimpan.');
  });

  document.getElementById('exportCsvBtn').addEventListener('click', exportVitalsCsv);

  document.getElementById('notifPermissionBtn').addEventListener('click', async () => {
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
        updateNotifButton();
      } catch {
        showToast('Izin notifikasi tidak dapat diminta di konteks ini.');
      }
    }
  });

  document.getElementById('testNotifBtn').addEventListener('click', () => {
    const dummyMed = {
      id: '__test__',
      name: 'Simulasi Pengingat Obat',
      dose: 'Contoh Dosis (Uji)',
      time: 'Sekarang',
      note: 'Hanya simulasi notifikasi, tidak mengubah riwayat obat.'
    };
    triggerMedReminder([dummyMed]);
  });

  document.getElementById('alarmMarkTakenBtn').addEventListener('click', () => {
    const realMeds = activeAlarmMeds.filter((m) => m.id !== '__test__');
    if (realMeds.length > 0) {
      const nowIso = new Date().toISOString();
      realMeds.forEach((med) => {
        state.medLogs[getMedLogKey(med.id)] = { status: 'taken', loggedAt: nowIso };
      });
      saveState(state);
      renderAll();
      showToast(
        realMeds.length > 1
          ? `${realMeds.length} obat ditandai sudah diminum.`
          : `${realMeds[0].name} ditandai sudah diminum.`
      );
    } else {
      showToast('Uji notifikasi selesai (riwayat obat tidak diubah).');
    }
    activeAlarmMeds = [];
    renderAlarmBanner();
  });

  document.getElementById('alarmDismissBtn').addEventListener('click', () => {
    activeAlarmMeds = [];
    renderAlarmBanner();
  });

  document.getElementById('breathToggleBtn').addEventListener('click', toggleBreathing);
}

// Boot
pruneOldNotifiedKeys();
setDefaultDateTimeInput();
updateLiveClock();
updateNotifButton();
bindEvents();
renderAll();
checkScheduledReminders();

setInterval(updateLiveClock, 1000);
setInterval(checkScheduledReminders, 15000);

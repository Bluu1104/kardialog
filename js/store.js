const STORAGE_KEY = 'kardialog_state_v2';

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function classifyBloodPressure(sys, dia) {
  const s = Number(sys);
  const d = Number(dia);
  if (!s || !d) return { label: 'Belum Lengkap', level: 'neutral', invalid: false, advice: '' };
  if (d >= s) {
    return {
      label: 'Nilai Tidak Valid',
      level: 'danger',
      invalid: true,
      advice: 'Tekanan diastolik harus lebih rendah dari sistolik (contoh: 120/80 mmHg).'
    };
  }
  if (s >= 180 || d >= 120) {
    return {
      label: 'Krisis Hipertensi',
      level: 'danger',
      invalid: false,
      advice: 'Segera evaluasi medis. Jika disertai nyeri dada atau sesak, langsung ke IGD.'
    };
  }
  if (s >= 140 || d >= 90) {
    return {
      label: 'Hipertensi Tahap 2',
      level: 'danger',
      invalid: false,
      advice: 'Pastikan obat antihipertensi diminum sesuai resep dan laporkan ke dokter.'
    };
  }
  if (s >= 130 || d >= 80) {
    return {
      label: 'Hipertensi Tahap 1',
      level: 'warn',
      invalid: false,
      advice: 'Pantau rutin dan perketat asupan natrium (<2000 mg/hari).'
    };
  }
  if (s >= 120 && d < 80) {
    return {
      label: 'Meningkat (Elevated)',
      level: 'warn',
      invalid: false,
      advice: 'Pertahankan pola makan rendah garam dan aktivitas fisik teratur.'
    };
  }
  if (s < 90 || d < 60) {
    return {
      label: 'Tekanan Darah Rendah',
      level: 'warn',
      invalid: false,
      advice: 'Waspadai pusing atau lemas. Konsultasikan dosis obat bila keluhan menetap.'
    };
  }
  return {
    label: 'Normal',
    level: 'ok',
    invalid: false,
    advice: 'Tekanan darah berada pada rentang target yang baik.'
  };
}

function createInitialState() {
  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 86400000));

  return {
    medications: [
      { id: 'm1', name: 'Aspirin (Miniaspi)', dose: '80 mg (1 tablet)', time: '07:00', note: 'Sesudah makan pagi' },
      { id: 'm2', name: 'Clopidogrel', dose: '75 mg (1 tablet)', time: '07:00', note: 'Antiplatelet harian' },
      { id: 'm3', name: 'Bisoprolol', dose: '2.5 mg (1 tablet)', time: '08:00', note: 'Kontrol denyut jantung' },
      { id: 'm4', name: 'Atorvastatin', dose: '40 mg (1 tablet)', time: '21:00', note: 'Sebelum tidur' }
    ],
    medLogs: {
      [`${yesterday}|m1`]: { status: 'taken', loggedAt: `${yesterday}T07:05:00` },
      [`${yesterday}|m2`]: { status: 'taken', loggedAt: `${yesterday}T07:05:00` },
      [`${yesterday}|m3`]: { status: 'taken', loggedAt: `${yesterday}T08:12:00` },
      [`${yesterday}|m4`]: { status: 'taken', loggedAt: `${yesterday}T21:04:00` }
    },
    vitals: [
      {
        id: 'v1',
        systolic: 134,
        diastolic: 84,
        pulse: 76,
        weight: 69.2,
        symptoms: 'Sedikit lelah di sore hari, tidak ada nyeri dada.',
        recordedAt: `${yesterday}T08:30`
      },
      {
        id: 'v2',
        systolic: 124,
        diastolic: 78,
        pulse: 70,
        weight: 68.8,
        symptoms: 'Tidak ada keluhan, tidur cukup.',
        recordedAt: `${today}T07:30`
      }
    ],
    habitsByDate: {
      [today]: ['h_salt', 'h_smoke']
    },
    notifiedKeys: {}
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

export function saveState(nextState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // Abaikan bila mode privasi membatasi localStorage
  }
}

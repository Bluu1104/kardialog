export const ACS_CHAPTERS = [
  {
    id: 'pengertian',
    num: '01',
    title: 'Pengertian ACS',
    eyebrow: 'Dasar Klinis',
    lead: 'Acute Coronary Syndrome (ACS) atau Sindrom Koroner Akut adalah kondisi gawat darurat akibat berkurangnya atau terhentinya aliran darah ke otot jantung secara mendadak.',
    sections: [
      {
        heading: 'Tiga Spektrum Utama ACS',
        items: [
          '<strong>STEMI (ST-Elevation Myocardial Infarction):</strong> Sumbatan total pada arteri koroner yang menyebabkan kerusakan otot jantung progresif. Memerlukan pembukaan sumbatan secepat mungkin.',
          '<strong>NSTEMI (Non-ST-Elevation Myocardial Infarction):</strong> Sumbatan parsial berat yang sudah memicu kerusakan sel otot jantung (ditandai kenaikan enzim troponin).',
          '<strong>Unstable Angina (Angina Tidak Stabil):</strong> Nyeri dada akibat penyempitan mendadak tanpa kenaikan troponin, namun berisiko tinggi berkembang menjadi serangan jantung.'
        ]
      }
    ],
    callout: {
      type: 'info',
      text: 'Pada ACS, waktu adalah otot jantung ("Time is Muscle"). Semakin cepat aliran darah dipulihkan, semakin besar fungsi jantung yang dapat diselamatkan.'
    }
  },
  {
    id: 'penyebab',
    num: '02',
    title: 'Penyebab & Faktor Risiko',
    eyebrow: 'Patofisiologi',
    lead: 'Sebagian besar kasus ACS dipicu oleh pecahnya plak aterosklerosis (timbunan lemak dan kolesterol) di dinding pembuluh koroner, yang kemudian memicu terbentuknya gumpalan darah (trombus).',
    sections: [
      {
        heading: 'Faktor Risiko yang Dapat Dikendalikan',
        items: [
          '<strong>Hipertensi:</strong> Tekanan tinggi merusak lapisan dalam pembuluh darah dan mempercepat penumpukan plak.',
          '<strong>Dislipidemia:</strong> Kadar kolesterol LDL tinggi menjadi bahan baku utama plak koroner.',
          '<strong>Diabetes Melitus:</strong> Gula darah tinggi mempercepat peradangan pembuluh darah.',
          '<strong>Merokok (aktif maupun pasif):</strong> Menyebabkan penyempitan pembuluh darah dan membuat darah lebih mudah menggumpal.',
          '<strong>Obesitas, kurang gerak, dan stres kronis.</strong>'
        ]
      },
      {
        heading: 'Faktor Risiko yang Tidak Dapat Diubah',
        items: [
          'Usia (laki-laki &gt;45 tahun, perempuan &gt;55 tahun atau pascamenopause).',
          'Riwayat penyakit jantung koroner dini pada keluarga inti.'
        ]
      }
    ]
  },
  {
    id: 'gejala',
    num: '03',
    title: 'Tanda & Gejala ACS',
    eyebrow: 'Deteksi Dini',
    lead: 'Mengenali gejala lebih awal menentukan keselamatan pasien. Gejala tidak selalu berupa nyeri dada tajam yang dramatis.',
    sections: [
      {
        heading: 'Gejala Tipikal',
        items: [
          'Rasa tertekan, tertindih beban berat, atau terasa panas/diremas di dada tengah atau kiri.',
          'Nyeri menjalar ke bahu, lengan kiri, punggung, leher, atau rahang.',
          'Berlangsung lebih dari 15–20 menit dan tidak membaik penuh dengan istirahat.',
          'Disertai keringat dingin, sesak napas, mual, atau pusing seperti akan pingsan.'
        ]
      },
      {
        heading: 'Gejala Atipikal (Sering pada Lansia, Perempuan, & Penderita Diabetes)',
        items: [
          'Rasa tidak nyaman di ulu hati yang sering disalahartikan sebagai sakit maag/GERD.',
          'Kelelahan ekstrem mendadak atau sesak napas tanpa nyeri dada jelas.'
        ]
      }
    ],
    callout: {
      type: 'danger',
      text: 'Tanda Bahaya: Jangan mengemudi sendiri ke rumah sakit saat nyeri dada akut. Hentikan aktivitas, duduk tenang, dan segera hubungi ambulans/119 atau minta keluarga mengantar ke IGD terdekat.'
    }
  },
  {
    id: 'komplikasi',
    num: '04',
    title: 'Komplikasi ACS',
    eyebrow: 'Risiko Lanjutan',
    lead: 'Jika kerusakan otot jantung cukup luas atau penanganan terlambat, beberapa komplikasi dapat muncul dalam hitungan jam hingga bulan.',
    sections: [
      {
        heading: 'Komplikasi yang Perlu Diwaspadai',
        items: [
          '<strong>Aritmia (Gangguan Irama Jantung):</strong> Detak jantung terlalu cepat, lambat, atau tidak teratur yang dapat membahayakan nyawa.',
          '<strong>Gagal Jantung:</strong> Penurunan kemampuan pompa jantung sehingga cairan menumpuk di paru (sesak saat berbaring) atau tungkai (bengkak).',
          '<strong>Syok Kardiogenik:</strong> Penurunan tekanan darah drastis akibat kegagalan pompa jantung akut.',
          '<strong>Serangan Jantung Berulang:</strong> Risiko paling tinggi terjadi bila obat pengencer darah dihentikan mendadak.'
        ]
      }
    ]
  },
  {
    id: 'pengobatan',
    num: '05',
    title: 'Pengobatan & Perawatan',
    eyebrow: 'Tatalaksana Medis',
    lead: 'Terapi ACS bertujuan memulihkan aliran darah koroner, meringankan beban kerja jantung, dan mencegah pembekuan darah ulang.',
    sections: [
      {
        heading: 'Terapi Obat Jangka Panjang',
        items: [
          '<strong>Dual Antiplatelet (DAPT):</strong> Aspirin dikombinasikan dengan Clopidogrel/Ticagrelor untuk mencegah gumpalan darah, terutama pascapemasangan ring (stent).',
          '<strong>Statin Dosis Tinggi (cth. Atorvastatin/Rosuvastatin):</strong> Menurunkan LDL dan menstabilkan plak koroner.',
          '<strong>Beta-Blocker (cth. Bisoprolol):</strong> Menurunkan denyut jantung dan kebutuhan oksigen otot jantung.',
          '<strong>ACE Inhibitor / ARB:</strong> Melindungi struktur otot jantung dan mengontrol tekanan darah.',
          '<strong>Nitrat (ISDN/Nitrogliserin):</strong> Melebarkan pembuluh koroner untuk meredakan nyeri dada.'
        ]
      },
      {
        heading: 'Tindakan Revaskularisasi',
        items: [
          '<strong>PCI (Kateterisasi &amp; Pemasangan Ring/Stent):</strong> Membuka sumbatan langsung melalui pembuluh darah pergelangan tangan atau paha.',
          '<strong>CABG (Operasi Bypass Jantung):</strong> Membuat jalur aliran darah baru bila sumbatan terjadi di banyak cabang utama.'
        ]
      }
    ],
    callout: {
      type: 'danger',
      text: 'Peringatan Kepatuhan: Jangan pernah menghentikan obat antiplatelet (Aspirin/Clopidogrel/Ticagrelor) tanpa persetujuan dokter jantung—penghentian mendadak dapat menyumbat ring secara akut.'
    }
  },
  {
    id: 'pencegahan',
    num: '06',
    title: 'Mencegah Serangan Berulang',
    eyebrow: 'Pencegahan Sekunder',
    lead: 'Pasien yang pernah mengalami ACS memiliki risiko lebih tinggi mengalami serangan ulang jika faktor pemicunya tidak dikendalikan secara konsisten.',
    sections: [
      {
        heading: 'Target Kontrol Klinis Utama',
        items: [
          '<strong>Kepatuhan Obat 100%:</strong> Minum obat tepat waktu setiap hari dan kontrol sebelum obat habis.',
          '<strong>Tekanan Darah:</strong> Dijaga di bawah 130/80 mmHg sesuai target dokter.',
          '<strong>Kolesterol LDL:</strong> Target sangat ketat (&lt;55 mg/dL pada pasien pasca-ACS risiko sangat tinggi).',
          '<strong>Gula Darah:</strong> HbA1c terkontrol (&lt;7%) bila memiliki diabetes.',
          '<strong>Bebas Rokok Total &amp; Rehabilitasi Jantung:</strong> Kombinasi olahraga terukur dan pola makan rendah natrium-lemak jenuh.'
        ]
      }
    ]
  }
];

export const DAILY_HABITS = [
  { id: 'h_salt', title: 'Batasi garam (<1 sdt / 2000 mg natrium)', desc: 'Hindari mi instan, ikan asin, kecap/saus berlebih, dan makanan kaleng.' },
  { id: 'h_veggie', title: 'Konsumsi sayur & buah minimal 4–5 porsi', desc: 'Tinggi kalium dan serat larut untuk membantu menurunkan LDL & tekanan darah.' },
  { id: 'h_smoke', title: 'Bebas rokok & asap rokok seharian', desc: 'Termasuk rokok elektrik/vape dan paparan perokok pasif.' },
  { id: 'h_activity', title: 'Aktivitas fisik ringan–sedang sesuai anjuran', desc: 'Jalan santai 20–30 menit tanpa memaksakan diri hingga sesak.' },
  { id: 'h_sleep', title: 'Tidur cukup (7–8 jam) & kelola stres', desc: 'Istirahat teratur menjaga keseimbangan tekanan darah dan irama jantung.' }
];

export const LIFESTYLE_PILLARS = [
  {
    id: 'diet-garam',
    label: 'Diet Rendah Garam',
    title: 'Mengendalikan Natrium Tanpa Kehilangan Rasa',
    intro: 'Kelebihan natrium menarik cairan ke dalam pembuluh darah, meningkatkan tekanan darah, dan memperberat kerja pompa jantung. Batas anjuran pasien jantung adalah maksimal 2.000 mg natrium per hari (setara kurang dari 1 sendok teh garam dapur total, termasuk garam tersembunyi).',
    points: [
      'Gunakan rempah segar Nusantara (bawang putih, jahe, kunyit, serai, daun salam, jeruk nipis) sebagai pengganti penyedap tinggi natrium.',
      'Periksa label gizi kemasan: pilih produk dengan natrium &lt;140 mg per saji.',
      'Hindari kuah bakso/soto instan yang kental garam dan makanan olahan (sosis, kornet, keripik).'
    ],
    swaps: [
      ['Ikan asin / telur asin', 'Ikan kembung, tongkol, atau salmon kukus/panggang'],
      ['Kecap asin & kaldu bubuk berlebih', 'Bumbu rempah alami, bawang putih, lada, perasan jeruk'],
      ['Kerupuk & camilan kemasan asin', 'Kacang panggang tanpa garam atau potongan buah segar']
    ]
  },
  {
    id: 'pola-makan',
    label: 'Pola Makan Sehat',
    title: 'Komposisi Piring Ramah Jantung (Adaptasi DASH)',
    intro: 'Fokus pada serat larut, lemak tak jenuh, dan protein rendah lemak jenuh untuk menjaga kadar kolesterol LDL tetap rendah.',
    points: [
      '<strong>1/2 Piring:</strong> Sayuran hijau dan buah utuh (bayam, brokoli, wortel, pepaya, apel, pisang).',
      '<strong>1/4 Piring:</strong> Karbohidrat kompleks (nasi merah, oat, ubi rebus, roti gandum utuh).',
      '<strong>1/4 Piring:</strong> Protein tanpa lemak (ikan laut 2–3x/minggu, tahu, tempe kukus/bacem rendah gula, dada ayam tanpa kulit).',
      'Ganti metode memasak: utamakan kukus, rebus, pepes, tumis sedikit minyak zaitun/kanola dibandingkan gorengan rendam dan santan kental.'
    ]
  },
  {
    id: 'berhenti-merokok',
    label: 'Berhenti Merokok',
    title: 'Dampak Nyata Berhenti Merokok pada Pembuluh Koroner',
    intro: 'Berhenti merokok adalah satu-satunya perubahan gaya hidup dengan penurunan risiko kematian jantung paling besar pada pasien pasca-ACS.',
    points: [
      '<strong>20 menit:</strong> Denyut jantung dan tekanan darah mulai menurun.',
      '<strong>24 jam:</strong> Kadar karbon monoksida dalam darah kembali normal, suplai oksigen ke jantung meningkat.',
      '<strong>1 tahun:</strong> Risiko serangan jantung koroner turun hingga sekitar 50% dibandingkan perokok aktif.',
      '<strong>Strategi praktis:</strong> Tentukan tanggal berhenti pasti, singkirkan asbak/korek, kenali pemicu (kopi/stres), dan konsultasikan terapi pengganti nikotin bila perlu.'
    ]
  },
  {
    id: 'aktivitas-fisik',
    label: 'Aktivitas Fisik',
    title: 'Olahraga Aman Sesuai Anjuran Tenaga Kesehatan',
    intro: 'Aktivitas fisik bertahap melatih efisiensi otot jantung dan memperbaiki sirkulasi. Selalu mulai setelah mendapat izin dokter jantung Anda.',
    points: [
      '<strong>Jenis dianjurkan:</strong> Jalan kaki santai, bersepeda statis ringan, atau senam rehabilitasi jantung.',
      '<strong>Durasi &amp; Frekuensi:</strong> Mulai 10–15 menit/hari lalu naikkan bertahap hingga 30 menit, 5 hari per minggu.',
      '<strong>Uji Bicara (Talk Test):</strong> Intensitas aman jika Anda masih bisa berbicara dalam kalimat pendek tanpa terengah-engah.',
      '<strong>Segera berhenti jika muncul:</strong> Nyeri/tekanan dada, pusing, keringat dingin, mual, atau detak jantung terasa melompat-lompat.'
    ]
  },
  {
    id: 'stres-istirahat',
    label: 'Stres & Istirahat',
    title: 'Manajemen Stres & Kualitas Tidur',
    intro: 'Stres berkepanjangan dan kurang tidur memicu lonjakan hormon adrenalin dan kortisol yang menaikkan tekanan darah serta mempercepat denyut jantung.',
    points: [
      'Jaga jadwal tidur konsisten 7–8 jam per malam; hindari kafein setelah pukul 14.00 dan layar ponsel 45 menit sebelum tidur.',
      'Luangkan 5–10 menit setiap hari untuk latihan pernapasan lambat (gunakan timer 4–4–6 di atas).',
      'Bicarakan kecemasan pasca-serangan jantung dengan keluarga atau dokter—kecemasan adalah hal wajar dan bisa ditangani.'
    ]
  }
];

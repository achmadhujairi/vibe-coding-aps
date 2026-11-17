/**
 * Frontend script untuk Vibe Coding APS
 * Menghubungkan UI dengan API Sistem 1 & Sistem 2
 */

// Tab Navigation
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("block");
  });

  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.classList.remove("active-tab");
    btn.classList.add("text-slate-300");
  });

  const activeContent = document.getElementById(tabId);
  if (activeContent) {
    activeContent.classList.remove("hidden");
    activeContent.classList.add("block");
  }

  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add("active-tab");
    activeBtn.classList.remove("text-slate-300");
  }
}

// Sub-Tab Navigation for Penerbangan
function switchFlightSubTab(subId) {
  document.querySelectorAll(".flight-subcontent").forEach((el) => {
    el.classList.add("hidden");
  });

  document.querySelectorAll(".subtab-btn").forEach((btn) => {
    btn.classList.remove("border-b-2", "border-purple-600", "text-purple-700");
    btn.classList.add("text-slate-500");
  });

  const active = document.getElementById(subId);
  if (active) active.classList.remove("hidden");

  const btn = document.getElementById(`btn-${subId}`);
  if (btn) {
    btn.classList.add("border-b-2", "border-purple-600", "text-purple-700");
    btn.classList.remove("text-slate-500");
  }
}

// ==========================================
// 1. SISTEM 1: PENGELOLAAN CUTI (US-01)
// ==========================================
async function loadPengajuanCuti() {
  const tahun = document.getElementById("cuti-tahun").value;
  const bulan = document.getElementById("cuti-bulan").value;
  const tbody = document.getElementById("tbody-pengajuan-cuti");
  const badge = document.getElementById("cuti-count-badge");

  tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</td></tr>`;

  try {
    const params = new URLSearchParams();
    if (tahun) params.append("tahun", tahun);
    if (bulan) params.append("bulan", bulan);

    const res = await fetch(`/api/cuti/pengajuan?${params.toString()}`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      badge.textContent = `${json.total} data`;
      tbody.innerHTML = json.data
        .map(
          (item) => `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-4 font-mono font-medium text-slate-600">${item.idPengajuan}</td>
          <td class="py-3 px-4 font-semibold text-slate-800">${item.namaPegawai}</td>
          <td class="py-3 px-4 text-slate-600">${item.periodeCuti}</td>
          <td class="py-3 px-4 text-center font-bold text-blue-600">${item.durasiCuti}</td>
          <td class="py-3 px-4 text-slate-500">${item.alasan || "-"}</td>
          <td class="py-3 px-4 text-center">
            <button onclick="viewDetailPegawai('${item.idPegawai}', '${item.namaPegawai}')" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1 mx-auto">
              <i class="fa-solid fa-user-check"></i> Detail & Sisa Cuti
            </button>
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      badge.textContent = "0 data";
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Tidak ada pengajuan cuti pada periode ini.</td></tr>`;
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-red-500">Gagal memuat data: ${err.message}</td></tr>`;
  }
}

async function viewDetailPegawai(idPegawai, namaPegawai) {
  const section = document.getElementById("section-detail-pegawai");
  const subtitle = document.getElementById("detail-pegawai-subtitle");
  const sisaEl = document.getElementById("detail-sisa-cuti");
  const tbodyRiwayat = document.getElementById("tbody-riwayat-cuti");

  section.classList.remove("hidden");
  subtitle.textContent = `Pegawai: ${namaPegawai} (${idPegawai})`;
  sisaEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-2xl"></i>`;
  tbodyRiwayat.innerHTML = `<tr><td colspan="3" class="text-center py-2 text-slate-400">Memuat riwayat...</td></tr>`;

  try {
    const res = await fetch(`/api/cuti/pegawai/${idPegawai}/detail?tahun=2026`);
    const json = await res.json();

    if (json.success) {
      sisaEl.textContent = json.data.sisaCuti;

      if (json.data.riwayatCuti.length > 0) {
        tbodyRiwayat.innerHTML = json.data.riwayatCuti
          .map(
            (r) => `
          <tr>
            <td class="py-1.5 px-2 font-mono text-slate-500">${r.idRiwayat}</td>
            <td class="py-1.5 px-2 text-slate-700 font-medium">${r.periodeCuti}</td>
            <td class="py-1.5 px-2 text-center text-blue-600 font-bold">${r.durasiCuti} hari</td>
          </tr>
        `
          )
          .join("");
      } else {
        tbodyRiwayat.innerHTML = `<tr><td colspan="3" class="text-center py-2 text-slate-400">Belum ada riwayat cuti sebelumnya.</td></tr>`;
      }
    }
  } catch (err) {
    alert("Gagal memuat detail pegawai: " + err.message);
  }
}

// ========================================================
// 2. SISTEM 2: PENERBANGAN & BOOKING (US-02, 03, 04, 06)
// ========================================================
async function searchFlightsUS02() {
  const asal = document.getElementById("us2-asal").value;
  const tujuan = document.getElementById("us2-tujuan").value;
  const tanggal = document.getElementById("us2-tanggal").value;
  const container = document.getElementById("us2-flight-results");

  container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Mencari penerbangan...</div>`;

  try {
    const params = new URLSearchParams({ asal, tujuan, tanggal });
    const res = await fetch(`/api/penerbangan/cari?${params.toString()}`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map((f) => renderFlightCard(f, "US-02")).join("");
    } else {
      container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400">Tidak ada penerbangan yang sesuai dengan tujuan '${tujuan}'.</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div class="col-span-2 text-center py-6 text-red-500">${err.message}</div>`;
  }
}

async function searchFlightsUS03() {
  const tujuan = document.getElementById("us3-tujuan").value;
  const container = document.getElementById("us3-flight-results");

  container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Mencari penerbangan untuk beberapa tujuan...</div>`;

  try {
    const res = await fetch(`/api/penerbangan/beberapa-tujuan?tujuan=${encodeURIComponent(tujuan)}`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map((f) => renderFlightCard(f, "US-03")).join("");
    } else {
      container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400">Tidak ditemukan penerbangan untuk tujuan yang dimasukkan.</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div class="col-span-2 text-center py-6 text-red-500">${err.message}</div>`;
  }
}

async function searchFlightsUS04() {
  const container = document.getElementById("us4-flight-results");
  container.innerHTML = `<div class="text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Memproses pencarian multi-destinasi...</div>`;

  const legs = [
    { asal: "Jakarta", tujuan: "Bali", tanggal: "2026-11-20" },
    { asal: "Bali", tujuan: "Lombok", tanggal: "2026-11-22" }
  ];

  try {
    const res = await fetch("/api/penerbangan/multi-destinasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rute: legs })
    });
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data
        .map(
          (leg) => `
        <div class="bg-slate-50 border rounded-lg p-4">
          <div class="flex items-center justify-between mb-3 border-b pb-2">
            <span class="font-bold text-purple-900 text-sm">Leg ${leg.legIndex}: ${leg.kriteria.asal} &rarr; ${leg.kriteria.tujuan} (${leg.kriteria.tanggal})</span>
            <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">${leg.pilihanPenerbangan.length} Opsi</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${leg.pilihanPenerbangan.map((f) => renderFlightCard(f, "US-04")).join("")}
          </div>
        </div>
      `
        )
        .join("");
    }
  } catch (err) {
    container.innerHTML = `<div class="text-center py-6 text-red-500">${err.message}</div>`;
  }
}

async function searchFlightsUS06() {
  const tujuan = document.getElementById("us6-tujuan").value;
  const sortBy = document.getElementById("us6-sort").value;
  const container = document.getElementById("us6-flight-results");

  container.innerHTML = `<div class="text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Membandingkan data penerbangan...</div>`;

  try {
    const res = await fetch(
      `/api/penerbangan/bandingkan?tujuan=${encodeURIComponent(tujuan)}&sortBy=${sortBy}`
    );
    const json = await res.json();

    if (json.success && json.data.daftarPenerbangan.length > 0) {
      const stats = json.data.statistik;
      container.innerHTML = `
        <div class="grid grid-cols-3 gap-3 bg-purple-50 p-3 rounded-lg border border-purple-200 text-center text-xs mb-3">
          <div><span class="text-slate-500 block">Total Pilihan</span><strong>${stats.totalPilihan} Penerbangan</strong></div>
          <div><span class="text-slate-500 block">Harga Termurah</span><strong class="text-emerald-600">Rp ${stats.termurah.toLocaleString("id-ID")}</strong></div>
          <div><span class="text-slate-500 block">Harga Termahal</span><strong class="text-purple-700">Rp ${stats.termahal.toLocaleString("id-ID")}</strong></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${json.data.daftarPenerbangan.map((f) => renderFlightCard(f, "US-06")).join("")}
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<div class="text-center py-6 text-red-500">${err.message}</div>`;
  }
}

function renderFlightCard(flight, usOrigin) {
  return `
    <div class="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-purple-300 transition flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start">
          <div>
            <span class="text-xs font-bold text-purple-700 uppercase tracking-wide">${flight.namaMaskapai}</span>
            <div class="text-sm font-semibold text-slate-800">${flight.asal} &rarr; ${flight.tujuan}</div>
          </div>
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">${flight.idPenerbangan}</span>
        </div>
        <div class="flex justify-between text-xs text-slate-500 mt-2">
          <span><i class="fa-solid fa-calendar-day mr-1"></i>${flight.tanggal}</span>
          <span><i class="fa-solid fa-clock mr-1"></i>${flight.jamKeberangkatan} WIB</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div class="font-bold text-slate-800 text-sm">
          Rp ${flight.harga ? flight.harga.toLocaleString("id-ID") : "0"}
        </div>
        <button onclick="bookingTicketDirect('${flight.idTiket}')" class="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded transition font-medium">
          Pesan Tiket
        </button>
      </div>
    </div>
  `;
}

async function bookingTicketDirect(idTiket) {
  if (!confirm(`Lanjutkan pemesanan tiket ID ${idTiket}?`)) return;

  try {
    const res = await fetch("/api/pemesanan/pesan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPengguna: "USR-001",
        idTiket,
        namaPenumpang: "User Pemesan",
        emailPenumpang: "user.pemesan@example.com"
      })
    });
    const json = await res.json();

    if (json.success) {
      alert(`✅ Berhasil dipesan!\nKode Booking: ${json.data.kodeBookingReference}\nID Pesanan: ${json.data.idPemesanan}`);
      loadAllBookings();
    } else {
      alert("❌ Gagal: " + json.message);
    }
  } catch (err) {
    alert("Gagal melakukan pemesanan: " + err.message);
  }
}

async function loadAllBookings() {
  const tbody = document.getElementById("tbody-pemesanan-list");
  if (!tbody) return;

  try {
    const res = await fetch("/api/pemesanan");
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      tbody.innerHTML = json.data
        .map(
          (b) => `
        <tr class="hover:bg-slate-50">
          <td class="p-2.5 font-mono text-slate-600">${b.idPemesanan}</td>
          <td class="p-2.5 font-mono font-bold text-purple-700">${b.kodeBookingReference}</td>
          <td class="p-2.5">${b.penumpang ? b.penumpang.nama : "-"}</td>
          <td class="p-2.5">
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
              b.statusBooking === "confirmed"
                ? "bg-green-100 text-green-800"
                : b.statusBooking === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
            }">${b.statusBooking}</span>
          </td>
          <td class="p-2.5 text-center">
            ${
              b.statusBooking !== "cancelled"
                ? `<button onclick="handleBatalkanPesanan('${b.idPemesanan}')" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded text-xs">
                     <i class="fa-solid fa-xmark"></i> Batalkan
                   </button>`
                : `<span class="text-slate-400 italic">Sudah Dibatalkan</span>`
            }
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-400">Belum ada pesanan aktif.</td></tr>`;
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">${err.message}</td></tr>`;
  }
}

async function handleBatalkanPesanan(idPemesanan) {
  if (!confirm(`Batalkan pemesanan ${idPemesanan}?`)) return;

  try {
    const res = await fetch(`/api/pemesanan/${idPemesanan}/batalkan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alasan: "Permintaan pengguna dari UI" })
    });
    const json = await res.json();

    if (json.success) {
      alert("✅ " + json.message);
      loadAllBookings();
    } else {
      alert("❌ " + json.message);
    }
  } catch (err) {
    alert("Gagal membatalkan pesanan: " + err.message);
  }
}

// ==========================================
// 3. SISTEM 2: MEMBER PROFIL & VALIDASI (US-05)
// ==========================================
async function onSelectMemberChanged() {
  const idMember = document.getElementById("select-member").value;
  try {
    const res = await fetch(`/api/profil/members/${idMember}`);
    const json = await res.json();

    if (json.success) {
      const m = json.data;
      document.getElementById("prof-nama").value = m.dataProfil.namaLengkap || "";
      document.getElementById("prof-email").value = m.dataProfil.email || "";
      document.getElementById("prof-paspor").value = m.dataProfil.noPaspor || "";
      document.getElementById("prof-telepon").value = m.dataProfil.telepon || "";
      document.getElementById("prof-alamat").value = m.dataProfil.alamat || "";

      const badge = document.getElementById("badge-status-profil");
      if (m.statusProfil === "LENGKAP") {
        badge.className = "text-xs px-3 py-1 rounded-full font-bold bg-green-100 text-green-800";
        badge.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i> STATUS: PROFIL LENGKAP`;
      } else {
        badge.className = "text-xs px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-800";
        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> STATUS: PROFIL BELUM LENGKAP`;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleUpdateProfil(event) {
  event.preventDefault();
  const idMember = document.getElementById("select-member").value;
  const payload = {
    namaLengkap: document.getElementById("prof-nama").value,
    email: document.getElementById("prof-email").value,
    noPaspor: document.getElementById("prof-paspor").value,
    telepon: document.getElementById("prof-telepon").value,
    alamat: document.getElementById("prof-alamat").value
  };

  try {
    const res = await fetch(`/api/profil/members/${idMember}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      alert("✅ Data profil berhasil diupdate!");
      onSelectMemberChanged();
    }
  } catch (err) {
    alert("Gagal update profil: " + err.message);
  }
}

async function handleValidasiTiket() {
  const idMember = document.getElementById("select-member").value;
  const idTiket = document.getElementById("val-tiket-select").value;
  const area = document.getElementById("area-hasil-validasi");

  area.classList.remove("hidden");
  area.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses validasi tiket...`;

  try {
    const res = await fetch("/api/profil/validasi-tiket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMember, idTiket })
    });
    const json = await res.json();

    if (res.ok && json.success) {
      area.className = "mt-4 p-4 rounded-lg border bg-green-50 border-green-300 text-green-900";
      area.innerHTML = `
        <div class="font-bold flex items-center gap-2 text-sm text-green-700">
          <i class="fa-solid fa-circle-check text-lg"></i> ${json.message}
        </div>
        <p class="mt-1">ID Validasi: <strong>${json.data.idValidasi}</strong></p>
        <p>Nama: <strong>${json.data.member.nama}</strong> | Paspor: <strong>${json.data.member.noPaspor}</strong></p>
      `;
    } else {
      area.className = "mt-4 p-4 rounded-lg border bg-red-50 border-red-300 text-red-900";
      area.innerHTML = `
        <div class="font-bold flex items-center gap-2 text-sm text-red-700">
          <i class="fa-solid fa-circle-xmark text-lg"></i> Pesan Sistem: "${json.message}"
        </div>
        <p class="mt-1 text-slate-700">${json.keterangan || "Harap lengkapi semua data profil Anda (paspor, telepon, alamat) sebelum validasi tiket."}</p>
      `;
    }
  } catch (err) {
    area.className = "mt-4 p-4 rounded-lg border bg-red-50 border-red-300 text-red-900";
    area.innerHTML = `Error: ${err.message}`;
  }
}

// ====================================================
// 4. SISTEM 2: TRAVEL MANAGER HUB (US-07, 08, 09)
// ====================================================
async function loadStatusBookingList() {
  const filter = document.getElementById("filter-status-booking").value;
  const tbody = document.getElementById("tbody-status-booking-list");

  try {
    const res = await fetch(`/api/travel/status-booking?status=${filter}`);
    const json = await res.json();

    if (json.success && json.data.bookings.length > 0) {
      tbody.innerHTML = json.data.bookings
        .map(
          (b) => `
        <tr class="hover:bg-slate-50">
          <td class="p-2 font-mono">${b.idPemesanan}</td>
          <td class="p-2 font-mono font-bold text-amber-700">${b.kodeBookingReference}</td>
          <td class="p-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
              b.statusBooking === "confirmed"
                ? "bg-green-100 text-green-800"
                : b.statusBooking === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
            }">${b.statusBooking}</span>
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      tbody.innerHTML = `<tr><td colspan="3" class="p-3 text-center text-slate-400">Tidak ada booking dengan status ini.</td></tr>`;
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" class="p-3 text-center text-red-500">${err.message}</td></tr>`;
  }
}

function setRef(code) {
  document.getElementById("input-booking-ref").value = code;
}

async function handleOtorisasiTiket() {
  const code = document.getElementById("input-booking-ref").value.trim();
  const area = document.getElementById("area-hasil-otorisasi");

  area.classList.remove("hidden");
  area.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memeriksa otorisasi...`;

  try {
    const res = await fetch("/api/travel/otorisasi-tiket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kodeBookingReference: code })
    });
    const json = await res.json();

    if (res.ok && json.success) {
      area.className = "p-3 rounded border bg-green-50 border-green-300 text-green-900";
      area.innerHTML = `
        <div class="font-bold flex items-center gap-1.5 text-green-700 text-xs">
          <i class="fa-solid fa-circle-check"></i> ${json.message}
        </div>
        <div class="mt-2 text-xs space-y-1 text-slate-700">
          <p>Booking Ref: <strong class="font-mono text-purple-700">${json.data.kodeBookingReference}</strong></p>
          <p>Status Booking: <strong class="uppercase text-green-700">${json.data.statusBooking}</strong></p>
          <p>Penumpang: <strong>${json.data.penumpang?.nama || "-"}</strong></p>
          <p>ID Pemesanan: <strong>${json.data.idPemesanan}</strong></p>
        </div>
      `;
    } else {
      // Sesuai Task b: "kode booking reference tidak sesuai"
      area.className = "p-3 rounded border bg-red-50 border-red-300 text-red-900";
      area.innerHTML = `
        <div class="font-bold flex items-center gap-1.5 text-red-700 text-xs">
          <i class="fa-solid fa-triangle-exclamation"></i> Pesan: "${json.message}"
        </div>
        <p class="mt-1 text-xs text-slate-600">${json.instruksi || "Silakan mengulang input kode booking reference yang benar."}</p>
      `;
    }
  } catch (err) {
    area.className = "p-3 rounded border bg-red-50 border-red-300 text-red-900";
    area.innerHTML = `Error: ${err.message}`;
  }
}

async function handlePesanTiketPengunjung(event) {
  event.preventDefault();
  const namaPengunjung = document.getElementById("gst-nama").value;
  const emailPengunjung = document.getElementById("gst-email").value;
  const idTiket = document.getElementById("gst-tiket").value;

  try {
    const res = await fetch("/api/travel/pesan-pengunjung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaPengunjung, emailPengunjung, idTiket })
    });
    const json = await res.json();

    if (json.success) {
      alert(`✅ Pemesanan Berhasil!\nKode Booking: ${json.data.pemesanan.kodeBookingReference}\nE-Tiket otomatis dikirim ke ${emailPengunjung}`);
      document.getElementById("cek-email-pengunjung").value = emailPengunjung;
      handleCekTiketPengunjung();
      loadStatusBookingList();
      loadAllBookings();
    } else {
      alert("❌ Gagal: " + json.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function handleCekTiketPengunjung() {
  const email = document.getElementById("cek-email-pengunjung").value.trim();
  const area = document.getElementById("area-hasil-pengunjung");

  if (!email) {
    area.innerHTML = "Harap masukkan email pengunjung.";
    return;
  }

  try {
    const res = await fetch(`/api/travel/tiket-pengunjung?email=${encodeURIComponent(email)}`);
    const json = await res.json();

    if (json.success && json.data.pesanan.length > 0) {
      area.innerHTML = `
        <div class="font-bold text-slate-800 mb-1">Ditemukan ${json.data.totalPesanan} Pesanan Tiket:</div>
        <ul class="space-y-1">
          ${json.data.pesanan
            .map(
              (p) => `
            <li class="border-b pb-1">
              Ref: <strong class="text-purple-700">${p.kodeBookingReference}</strong> | Status: <strong>${p.statusBooking}</strong><br>
              <span class="text-[10px] text-green-600"><i class="fa-solid fa-envelope-circle-check"></i> E-Tiket terkirim ke email</span>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    } else {
      area.innerHTML = `Tidak ditemukan pesanan tiket untuk email: <strong>${email}</strong>`;
    }
  } catch (err) {
    area.innerHTML = "Gagal memuat tiket pengunjung: " + err.message;
  }
}

// Inisialisasi awal saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadPengajuanCuti();
  searchFlightsUS02();
  loadAllBookings();
  onSelectMemberChanged();
  loadStatusBookingList();
});

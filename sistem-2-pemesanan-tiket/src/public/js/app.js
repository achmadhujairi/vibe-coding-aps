/**
 * Frontend script untuk Sistem 2: Pemesanan Tiket Pesawat (US-02 s/d US-09)
 */

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

function switchFlightSubTab(subId) {
  document.querySelectorAll(".flight-subcontent").forEach((el) => el.classList.add("hidden"));
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

// 1. Pencarian & Booking
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
      container.innerHTML = json.data.map((f) => renderFlightCard(f)).join("");
    } else {
      container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400">Tidak ada penerbangan yang sesuai.</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div class="col-span-2 text-center py-6 text-red-500">${err.message}</div>`;
  }
}

async function searchFlightsUS03() {
  const tujuan = document.getElementById("us3-tujuan").value;
  const container = document.getElementById("us3-flight-results");

  container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Mencari...</div>`;

  try {
    const res = await fetch(`/api/penerbangan/beberapa-tujuan?tujuan=${encodeURIComponent(tujuan)}`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map((f) => renderFlightCard(f)).join("");
    } else {
      container.innerHTML = `<div class="col-span-2 text-center py-6 text-slate-400">Tidak ada hasil.</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div class="col-span-2 text-center py-6 text-red-500">${err.message}</div>`;
  }
}

async function searchFlightsUS04() {
  const container = document.getElementById("us4-flight-results");
  container.innerHTML = `<div class="text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Memproses multi-destinasi...</div>`;

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
        <div class="bg-slate-50 border rounded-lg p-3">
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold text-xs text-purple-900">Rute ${leg.legIndex}: ${leg.kriteria.asal} &rarr; ${leg.kriteria.tujuan} (${leg.kriteria.tanggal})</span>
            <span class="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded">${leg.pilihanPenerbangan.length} Opsi</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${leg.pilihanPenerbangan.map((f) => renderFlightCard(f)).join("")}
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

  container.innerHTML = `<div class="text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Membandingkan harga...</div>`;

  try {
    const res = await fetch(
      `/api/penerbangan/bandingkan?tujuan=${encodeURIComponent(tujuan)}&sortBy=${sortBy}`
    );
    const json = await res.json();

    if (json.success && json.data.daftarPenerbangan.length > 0) {
      const stats = json.data.statistik;
      container.innerHTML = `
        <div class="grid grid-cols-3 gap-2 bg-purple-50 p-3 rounded border text-center text-xs mb-3">
          <div><span class="text-slate-500 block">Total Opsi</span><strong>${stats.totalPilihan} Penerbangan</strong></div>
          <div><span class="text-slate-500 block">Harga Termurah</span><strong class="text-emerald-600">Rp ${stats.termurah.toLocaleString("id-ID")}</strong></div>
          <div><span class="text-slate-500 block">Harga Termahal</span><strong class="text-purple-700">Rp ${stats.termahal.toLocaleString("id-ID")}</strong></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${json.data.daftarPenerbangan.map((f) => renderFlightCard(f)).join("")}
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<div class="text-center py-6 text-red-500">${err.message}</div>`;
  }
}

function renderFlightCard(flight) {
  return `
    <div class="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start">
          <div>
            <span class="text-xs font-bold text-purple-700">${flight.namaMaskapai}</span>
            <div class="text-sm font-semibold text-slate-800">${flight.asal} &rarr; ${flight.tujuan}</div>
          </div>
          <span class="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">${flight.idPenerbangan}</span>
        </div>
        <div class="flex justify-between text-xs text-slate-500 mt-2">
          <span>${flight.tanggal}</span>
          <span>${flight.jamKeberangkatan} WIB</span>
        </div>
      </div>
      <div class="mt-3 pt-2 border-t flex items-center justify-between">
        <span class="font-bold text-xs text-slate-800">Rp ${flight.harga ? flight.harga.toLocaleString("id-ID") : "0"}</span>
        <button onclick="bookingTicketDirect('${flight.idTiket}')" class="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2.5 py-1 rounded">Pesan</button>
      </div>
    </div>
  `;
}

async function bookingTicketDirect(idTiket) {
  if (!confirm(`Pesan tiket ${idTiket}?`)) return;

  try {
    const res = await fetch("/api/pemesanan/pesan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPengguna: "USR-001",
        idTiket,
        namaPenumpang: "User Pemesan",
        emailPenumpang: "user@example.com"
      })
    });
    const json = await res.json();

    if (json.success) {
      alert(`✅ Berhasil dipesan!\nKode Booking: ${json.data.kodeBookingReference}`);
      loadAllBookings();
    } else {
      alert("❌ " + json.message);
    }
  } catch (err) {
    alert("Gagal: " + err.message);
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
          <td class="p-2.5 font-mono">${b.idPemesanan}</td>
          <td class="p-2.5 font-mono font-bold text-purple-700">${b.kodeBookingReference}</td>
          <td class="p-2.5">${b.penumpang ? b.penumpang.nama : "-"}</td>
          <td class="p-2.5"><span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100">${b.statusBooking}</span></td>
          <td class="p-2.5 text-center">
            ${
              b.statusBooking !== "cancelled"
                ? `<button onclick="handleBatalkanPesanan('${b.idPemesanan}')" class="bg-red-50 text-red-600 px-2 py-1 rounded text-xs border border-red-200">Batalkan</button>`
                : `<span class="text-slate-400 italic">Dibatalkan</span>`
            }
          </td>
        </tr>
      `
        )
        .join("");
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-3 text-red-500">${err.message}</td></tr>`;
  }
}

async function handleBatalkanPesanan(idPemesanan) {
  if (!confirm(`Batalkan pemesanan ${idPemesanan}?`)) return;

  try {
    const res = await fetch(`/api/pemesanan/${idPemesanan}/batalkan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alasan: "Batal pengguna" })
    });
    const json = await res.json();

    if (json.success) {
      alert("✅ " + json.message);
      loadAllBookings();
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// 2. Member Profil
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
    alert("Gagal: " + err.message);
  }
}

async function handleValidasiTiket() {
  const idMember = document.getElementById("select-member").value;
  const idTiket = document.getElementById("val-tiket-select").value;
  const area = document.getElementById("area-hasil-validasi");

  area.classList.remove("hidden");
  area.innerHTML = `Memproses validasi...`;

  try {
    const res = await fetch("/api/profil/validasi-tiket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMember, idTiket })
    });
    const json = await res.json();

    if (res.ok && json.success) {
      area.className = "mt-4 p-4 rounded border bg-green-50 border-green-300 text-green-900";
      area.innerHTML = `<div class="font-bold">${json.message}</div><p>ID: ${json.data.idValidasi}</p>`;
    } else {
      area.className = "mt-4 p-4 rounded border bg-red-50 border-red-300 text-red-900";
      area.innerHTML = `<div class="font-bold">Pesan Sistem: "${json.message}"</div><p class="text-slate-600">${json.keterangan || ""}</p>`;
    }
  } catch (err) {
    area.className = "mt-4 p-4 rounded border bg-red-50 text-red-900";
    area.innerHTML = `Error: ${err.message}`;
  }
}

// 3. Travel Manager Hub
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
          <td class="p-2"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100">${b.statusBooking}</span></td>
        </tr>
      `
        )
        .join("");
    } else {
      tbody.innerHTML = `<tr><td colspan="3" class="p-2 text-center text-slate-400">Tidak ada data.</td></tr>`;
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" class="p-2 text-center text-red-500">${err.message}</td></tr>`;
  }
}

function setRef(code) {
  document.getElementById("input-booking-ref").value = code;
}

async function handleOtorisasiTiket() {
  const code = document.getElementById("input-booking-ref").value.trim();
  const area = document.getElementById("area-hasil-otorisasi");

  area.classList.remove("hidden");
  area.innerHTML = "Memeriksa...";

  try {
    const res = await fetch("/api/travel/otorisasi-tiket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kodeBookingReference: code })
    });
    const json = await res.json();

    if (res.ok && json.success) {
      area.className = "p-3 rounded border bg-green-50 border-green-300 text-green-900";
      area.innerHTML = `<div class="font-bold text-xs">${json.message}</div><p>Ref: <strong>${json.data.kodeBookingReference}</strong> | Status: <strong>${json.data.statusBooking}</strong></p>`;
    } else {
      area.className = "p-3 rounded border bg-red-50 border-red-300 text-red-900";
      area.innerHTML = `<div class="font-bold text-xs">Pesan: "${json.message}"</div><p class="text-slate-600">${json.instruksi || ""}</p>`;
    }
  } catch (err) {
    area.className = "p-3 rounded border bg-red-50 text-red-900";
    area.innerHTML = err.message;
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
      alert(`✅ Pemesanan Berhasil!\nKode: ${json.data.pemesanan.kodeBookingReference}\nE-Tiket terkirim ke email.`);
      document.getElementById("cek-email-pengunjung").value = emailPengunjung;
      handleCekTiketPengunjung();
      loadStatusBookingList();
      loadAllBookings();
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function handleCekTiketPengunjung() {
  const email = document.getElementById("cek-email-pengunjung").value.trim();
  const area = document.getElementById("area-hasil-pengunjung");

  try {
    const res = await fetch(`/api/travel/tiket-pengunjung?email=${encodeURIComponent(email)}`);
    const json = await res.json();

    if (json.success && json.data.pesanan.length > 0) {
      area.innerHTML = `
        <div class="font-bold text-slate-800 mb-1">Pesanan (${json.data.totalPesanan}):</div>
        <ul class="space-y-1">
          ${json.data.pesanan
            .map(
              (p) => `
            <li class="border-b pb-1">
              Ref: <strong class="text-purple-700">${p.kodeBookingReference}</strong> | Status: <strong>${p.statusBooking}</strong>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    } else {
      area.innerHTML = `Tidak ditemukan pesanan untuk ${email}`;
    }
  } catch (err) {
    area.innerHTML = err.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  searchFlightsUS02();
  loadAllBookings();
  onSelectMemberChanged();
  loadStatusBookingList();
});

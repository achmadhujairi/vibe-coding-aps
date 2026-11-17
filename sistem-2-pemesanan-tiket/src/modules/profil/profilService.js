const dataStore = require("../../database/dataStore");

/**
 * Service untuk Profil & Validasi Tiket (US-05)
 * Khusus Member Frequent Traveller
 */
class ProfilService {
  getMember(idMember) {
    return dataStore.data.memberFrequentTraveller.find((m) => m.idMember === idMember);
  }

  getAllMembers() {
    return dataStore.data.memberFrequentTraveller;
  }

  /**
   * Task a: Update data profil & cek kelengkapan
   * Profil dianggap LENGKAP jika: namaLengkap, email, noPaspor, telepon, alamat terisi
   */
  updateProfil(idMember, dataProfilUpdate) {
    const member = this.getMember(idMember);
    if (!member) {
      return null;
    }

    member.dataProfil = {
      ...member.dataProfil,
      ...dataProfilUpdate
    };

    const isLengkap =
      Boolean(member.dataProfil.namaLengkap?.trim()) &&
      Boolean(member.dataProfil.email?.trim()) &&
      Boolean(member.dataProfil.noPaspor?.trim()) &&
      Boolean(member.dataProfil.telepon?.trim()) &&
      Boolean(member.dataProfil.alamat?.trim());

    member.statusProfil = isLengkap ? "LENGKAP" : "TIDAK_LENGKAP";
    return member;
  }

  /**
   * Task b & c: Validasi tiket menggunakan data profil
   * Jika tidak lengkap -> kembalikan pesan "data profil tidak lengkap" dan tolak validasi
   */
  validasiTiket(idMember, idTiket) {
    const member = this.getMember(idMember);
    if (!member) {
      return {
        success: false,
        status: "MEMBER_NOT_FOUND",
        message: "Member Frequent Traveller tidak ditemukan"
      };
    }

    const tiket = dataStore.data.tiket.find((t) => t.idTiket === idTiket);
    if (!tiket) {
      return {
        success: false,
        status: "TIKET_NOT_FOUND",
        message: "Tiket tidak ditemukan"
      };
    }

    // Task c: Jika profil tidak lengkap
    if (member.statusProfil !== "LENGKAP") {
      const log = {
        idValidasi: `VAL-${Date.now()}`,
        idMember,
        idTiket,
        statusValidasi: "DITOLAK",
        alasan: "data profil tidak lengkap",
        waktuValidasi: new Date().toISOString()
      };
      dataStore.data.validasiTiketLog.push(log);

      return {
        success: false,
        valid: false,
        status: "PROFIL_TIDAK_LENGKAP",
        message: "data profil tidak lengkap",
        keterangan: "Proses validasi tiket ditolak hingga data profil dinyatakan lengkap."
      };
    }

    // Task b: Jika profil lengkap
    const log = {
      idValidasi: `VAL-${Date.now()}`,
      idMember,
      idTiket,
      statusValidasi: "VALID",
      alasan: "Data profil lengkap dan sesuai",
      waktuValidasi: new Date().toISOString()
    };
    dataStore.data.validasiTiketLog.push(log);

    return {
      success: true,
      valid: true,
      status: "VALIDASI_BERHASIL",
      message: "Validasi tiket berhasil menggunakan data profil yang tersedia.",
      data: {
        idValidasi: log.idValidasi,
        member: {
          idMember: member.idMember,
          nama: member.dataProfil.namaLengkap,
          noPaspor: member.dataProfil.noPaspor
        },
        tiket
      }
    };
  }
}

module.exports = new ProfilService();

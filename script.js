// Array untuk menyimpan data
let dataPeminjaman = [];
let sedangEdit = -1;
const DENDA_PER_HARI = 5000;
const BATAS_HARI = 14;

const form = document.getElementById("formPeminjaman");
const tabelData = document.getElementById("tabelData");

// FUNGSI PREVIEW FOTO
function previewFoto(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.add('show');
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.classList.remove('show');
    }
}

// FUNGSI TAMBAHAN: Toggle tampilan form buku 2
function toggleBuku2() {
    const jumlah = document.getElementById("jumlahBuku").value;
    const container = document.getElementById("buku2Container");
    
    if (jumlah === "2") {
        container.classList.add("show");
        // Set required untuk input buku 2
        document.getElementById("isbn2").required = true;
        document.getElementById("judul2").required = true;
        document.getElementById("penerbit2").required = true;
        document.getElementById("tahunTerbit2").required = true;
    } else {
        container.classList.remove("show");
        // Hapus required untuk input buku 2
        document.getElementById("isbn2").required = false;
        document.getElementById("judul2").required = false;
        document.getElementById("penerbit2").required = false;
        document.getElementById("tahunTerbit2").required = false;
        
        // Kosongkan nilai buku 2
        document.getElementById("isbn2").value = "";
        document.getElementById("judul2").value = "";
        document.getElementById("penerbit2").value = "";
        document.getElementById("tahunTerbit2").value = "";
        
        // Reset preview foto buku 2
        document.getElementById('preview2').src = '#';
        document.getElementById('preview2').classList.remove('show');
        document.getElementById('fotoBuku2').value = '';
    }
}

// EVENT LISTENER SUBMIT
form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Ambil data buku 1
    const kodePinjam = document.getElementById("kodePinjam").value;
    const nama = document.getElementById("nama").value;
    const isbn1 = document.getElementById("isbn1").value;
    const judul1 = document.getElementById("judul1").value;
    const penerbit1 = document.getElementById("penerbit1").value;
    const tahunTerbit1 = document.getElementById("tahunTerbit1").value;
    
    // Ambil foto buku 1
    const foto1Input = document.getElementById("fotoBuku1");
    let foto1 = '';
    if (foto1Input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            foto1 = e.target.result;
            // Lanjutkan proses setelah foto di-load
            prosesSimpan(foto1);
        }
        reader.readAsDataURL(foto1Input.files[0]);
    } else {
        prosesSimpan('');
    }
    
    function prosesSimpan(foto1Value) {
        // Ambil data buku 2 (jika ada)
        const jumlahBuku = document.getElementById("jumlahBuku").value;
        const isbn2 = jumlahBuku === "2" ? document.getElementById("isbn2").value : "";
        const judul2 = jumlahBuku === "2" ? document.getElementById("judul2").value : "";
        const penerbit2 = jumlahBuku === "2" ? document.getElementById("penerbit2").value : "";
        const tahunTerbit2 = jumlahBuku === "2" ? document.getElementById("tahunTerbit2").value : "";
        
        // Ambil foto buku 2
        let foto2 = '';
        const foto2Input = document.getElementById("fotoBuku2");
        if (jumlahBuku === "2" && foto2Input.files[0]) {
            const reader2 = new FileReader();
            reader2.onload = function(e) {
                foto2 = e.target.result;
                // Lanjutkan proses setelah foto 2 di-load
                prosesSimpanLanjut(foto1Value, foto2);
            }
            reader2.readAsDataURL(foto2Input.files[0]);
        } else {
            prosesSimpanLanjut(foto1Value, '');
        }
        
        function prosesSimpanLanjut(foto1Value, foto2Value) {
            const tanggalPinjam = document.getElementById("tanggalPinjam").value;
            const tanggalKembali = document.getElementById("tanggalKembali").value;

            // Validasi buku 2 jika jumlah 2
            if (jumlahBuku === "2") {
                if (!isbn2 || !judul2 || !penerbit2 || !tahunTerbit2) {
                    alert('Semua field buku kedua harus diisi!');
                    return;
                }
            }

            const pinjamDate = new Date(tanggalPinjam);
            const kembaliDate = new Date(tanggalKembali);

            // Hitung selisih hari
            let selisihHari = Math.ceil((kembaliDate - pinjamDate) / (1000 * 60 * 60 * 24));

            let denda = 0;
            let status = "Masih dalam batas waktu";

            if (selisihHari > BATAS_HARI) {
                let hariTelat = selisihHari - BATAS_HARI;
                denda = hariTelat * DENDA_PER_HARI;
                status = "Terlambat " + hariTelat + " hari";
            }

            if (sedangEdit === -1) {
                // Tambah data baru
                dataPeminjaman.push({
                    kodePinjam,
                    nama,
                    isbn1,
                    judul1,
                    penerbit1,
                    tahunTerbit1,
                    foto1: foto1Value,
                    isbn2,
                    judul2,
                    penerbit2,
                    tahunTerbit2,
                    foto2: foto2Value,
                    jumlahBuku,
                    tanggalPinjam,
                    tanggalKembali,
                    status,
                    denda
                });
            } else {
                // Update data yang sedang diedit
                dataPeminjaman[sedangEdit] = {
                    kodePinjam,
                    nama,
                    isbn1,
                    judul1,
                    penerbit1,
                    tahunTerbit1,
                    foto1: foto1Value,
                    isbn2,
                    judul2,
                    penerbit2,
                    tahunTerbit2,
                    foto2: foto2Value,
                    jumlahBuku,
                    tanggalPinjam,
                    tanggalKembali,
                    status,
                    denda
                };
                sedangEdit = -1;
            }

            tampilkanData();
            form.reset();
            
            // Reset preview
            document.getElementById('preview1').src = '#';
            document.getElementById('preview1').classList.remove('show');
            document.getElementById('preview2').src = '#';
            document.getElementById('preview2').classList.remove('show');
            
            toggleBuku2(); // Sembunyikan buku 2 setelah submit
        }
    }
});

// FUNGSI HAPUS DATA
function hapusData(index) {
    if (confirm('Yakin ingin menghapus data ini?')) {
        dataPeminjaman.splice(index, 1);
        tampilkanData();
    }
}

// FUNGSI HAPUS SEMUA
function hapusSemua() {
    if (confirm('Yakin ingin menghapus semua data?')) {
        dataPeminjaman = [];
        tampilkanData();
    }
}

// FUNGSI EDIT DATA
function editData(index) {
    const data = dataPeminjaman[index];
    
    // Isi form dengan data yang akan diedit
    document.getElementById("kodePinjam").value = data.kodePinjam;
    document.getElementById("nama").value = data.nama;
    document.getElementById("isbn1").value = data.isbn1;
    document.getElementById("judul1").value = data.judul1;
    document.getElementById("penerbit1").value = data.penerbit1;
    document.getElementById("tahunTerbit1").value = data.tahunTerbit1;
    document.getElementById("jumlahBuku").value = data.jumlahBuku;
    
    // Tampilkan preview foto 1 jika ada
    if (data.foto1) {
        document.getElementById('preview1').src = data.foto1;
        document.getElementById('preview1').classList.add('show');
    }
    
    // Toggle dan isi buku 2 jika ada
    if (data.jumlahBuku === "2") {
        toggleBuku2();
        document.getElementById("isbn2").value = data.isbn2 || "";
        document.getElementById("judul2").value = data.judul2 || "";
        document.getElementById("penerbit2").value = data.penerbit2 || "";
        document.getElementById("tahunTerbit2").value = data.tahunTerbit2 || "";
        
        // Tampilkan preview foto 2 jika ada
        if (data.foto2) {
            document.getElementById('preview2').src = data.foto2;
            document.getElementById('preview2').classList.add('show');
        }
    } else {
        // Pastikan buku 2 tersembunyi
        document.getElementById("buku2Container").classList.remove("show");
    }
    
    document.getElementById("tanggalPinjam").value = data.tanggalPinjam;
    document.getElementById("tanggalKembali").value = data.tanggalKembali;
    
    sedangEdit = index;
}

// FUNGSI TAMPILKAN DATA
function tampilkanData() {
    tabelData.innerHTML = "";

    dataPeminjaman.forEach((data, index) => {
        tabelData.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${data.kodePinjam}</td>
                <td>${data.nama}</td>
                <td>${data.isbn1}</td>
                <td>${data.judul1}</td>
                <td>${data.penerbit1}</td>
                <td>${data.tahunTerbit1}</td>
                <td class="foto-cell">
                    ${data.foto1 ? 
                        `<img src="${data.foto1}" class="foto-thumb" alt="foto buku1">` : 
                        '<span class="no-foto">-</span>'}
                </td>
                <td>${data.isbn2 || '-'}</td>
                <td>${data.judul2 || '-'}</td>
                <td>${data.penerbit2 || '-'}</td>
                <td>${data.tahunTerbit2 || '-'}</td>
                <td class="foto-cell">
                    ${data.foto2 ? 
                        `<img src="${data.foto2}" class="foto-thumb" alt="foto buku2">` : 
                        '<span class="no-foto">-</span>'}
                </td>
                <td>${data.jumlahBuku}</td>
                <td>${data.tanggalPinjam}</td>
                <td>${data.tanggalKembali}</td>
                <td>${data.status}</td>
                <td class="denda">Rp ${data.denda.toLocaleString()}</td>
                <td>
                    <button class="btn-edit" onclick="editData(${index})">Edit</button>
                    <button class="btn-hapus" onclick="hapusData(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// FUNGSI HITUNG LAMA DAN DENDA
function hitungLamaDenda() {
    const tglPinjam = document.getElementById('tanggalPinjam').value;
    const tglKembali = document.getElementById('tanggalKembali').value;
    
    if (tglPinjam && tglKembali) {
        const pinjam = new Date(tglPinjam);
        const kembali = new Date(tglKembali);
        
        if (kembali >= pinjam) {
            const lama = Math.ceil((kembali - pinjam) / (1000 * 60 * 60 * 24));
            
            let denda = 0;
            if (lama > BATAS_HARI) {
                denda = (lama - BATAS_HARI) * DENDA_PER_HARI;
            }
        }
    }
}

// Event listener untuk hitung otomatis
document.getElementById('tanggalPinjam').addEventListener('change', hitungLamaDenda);
document.getElementById('tanggalKembali').addEventListener('change', hitungLamaDenda);

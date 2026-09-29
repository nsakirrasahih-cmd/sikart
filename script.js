// 1. Data 4 Akun Terdaftar
const accounts = [
  { username: 'bendahara', password: '123', name: 'Bendahara RT', role: 'bendahara' },
  { username: 'ketua', password: '123', name: 'Pak Ketua RT', role: 'ketua_rt' },
  { username: 'sekretaris', password: '123', name: 'Bu Sekretaris', role: 'sekretaris' },
  { username: 'warga', password: '123', name: 'Budi (Warga RT)', role: 'warga' }
];

// Cek status session saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('sikart_session'));
  if (currentUser) {
    showDashboard(currentUser);
  } else {
    showLogin();
  }
});

// Handle submit Form Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const unameInput = document.getElementById('username').value.trim().toLowerCase();
  const passInput = document.getElementById('password').value;

  // Cari akun yang cocok
  const foundUser = accounts.find(acc => acc.username === unameInput && acc.password === passInput);

  if (foundUser) {
    // Simpan data login di sessionStorage
    sessionStorage.setItem('sikart_session', JSON.stringify(foundUser));
    showDashboard(foundUser);
  } else {
    alert('Username atau password salah! Gunakan akun terdaftar.');
  }
});

// Function Menampilkan Dashboard dan Mengatur Hak Akses
function showDashboard(user) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'block';

  // Set Nama & Badge
  document.getElementById('welcomeUser').textContent = `Selamat datang, ${user.name}`;
  document.getElementById('userRoleBadge').textContent = `Role: ${user.role.toUpperCase().replace('_', ' ')}`;

  // --- ATUR HAK AKSES BERDASARKAN ROLE ---
  
  const menuPemasukan = document.getElementById('menuPemasukan');
  const menuPengeluaran = document.getElementById('menuPengeluaran');
  const actionCols = document.querySelectorAll('.action-col');

  // Rules 1: Sekretaris RT -> Pemasukan & Pengeluaran TIDAK BISA (Disembunyikan)
  if (user.role === 'sekretaris') {
    menuPemasukan.style.display = 'none';
    menuPengeluaran.style.display = 'none';
  } else {
    menuPemasukan.style.display = 'flex';
    menuPengeluaran.style.display = 'flex';
  }

  // Rules 2: Edit/Hapus Transaksi -> HANYA BENDAHARA yang bisa
  actionCols.forEach(col => {
    if (user.role === 'bendahara') {
      col.style.display = 'table-cell'; // Tampilkan tombol edit/hapus
    } else {
      col.style.display = 'none'; // Sembunyikan untuk Ketua RT, Sekretaris, dan Warga
    }
  });
}

// Function Logout
function logout() {
  sessionStorage.removeItem('sikart_session');
  showLogin();
}

function showLogin() {
  document.getElementById('loginSection').style.display = 'flex';
  document.getElementById('dashboardSection').style.display = 'none';
}
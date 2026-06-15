// --- Initialization & UI Management ---

let token = localStorage.getItem("token");

if (token) {
  showApp();
}

function switchTab(tab) {
  const formLogin = document.getElementById("form-login");
  const formReg = document.getElementById("form-register");
  const btnLogin = document.getElementById("btn-tab-login");
  const btnReg = document.getElementById("btn-tab-register");

  if (tab === "login") {
    formLogin.classList.remove("hidden");
    formReg.classList.add("hidden");
    btnLogin.className = "flex-1 py-2 rounded-lg font-bold text-sm bg-blue-600 text-white shadow-md transition-all";
    btnReg.className = "flex-1 py-2 rounded-lg font-bold text-sm text-gray-400 hover:text-white transition-all";
  } else {
    formLogin.classList.add("hidden");
    formReg.classList.remove("hidden");
    btnReg.className = "flex-1 py-2 rounded-lg font-bold text-sm bg-teal-600 text-white shadow-md transition-all";
    btnLogin.className = "flex-1 py-2 rounded-lg font-bold text-sm text-gray-400 hover:text-white transition-all";
  }
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

function showApp() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");

  const decoded = parseJwt(token);
  if (decoded && decoded.sub) {
    document.getElementById("user-display").innerText = decoded.sub;
  }

  loadItems();
}

// --- Authentication & User Account ---

function logout() {
  Swal.fire({
    title: "Konfirmasi Keluar",
    text: "Apakah Anda yakin ingin keluar dari sistem?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, Keluar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  });
}

async function deleteAccount() {
  const confirmation = await Swal.fire({
    title: "Konfirmasi Penghapusan Akun",
    text: "Tindakan ini bersifat permanen. Seluruh data akun Anda akan dihapus dari sistem.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, Hapus Akun",
    cancelButtonText: "Batal",
  });

  if (confirmation.isConfirmed) {
    try {
      const res = await fetch("/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await Swal.fire("Akun Dihapus", "Akun Anda telah berhasil dihapus secara permanen.", "success");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        Swal.fire("Kesalahan", "Gagal memproses penghapusan akun.", "error");
      }
    } catch (error) {
      Swal.fire("Kesalahan Server", "Tidak dapat terhubung ke server.", "error");
    }
  }
}

async function handleLogin() {
  const u = document.getElementById("login-username").value;
  const p = document.getElementById("login-password").value;

  if (!u || !p) return Swal.fire("Perhatian", "Mohon lengkapi nama pengguna dan kata sandi.", "warning");

  let formData = new URLSearchParams();
  formData.append("username", u);
  formData.append("password", p);

  try {
    let res = await fetch("/login", { method: "POST", body: formData });
    let data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      token = data.access_token;

      Swal.fire({
        icon: "success",
        title: "Autentikasi Berhasil",
        text: "Mengalihkan ke sistem...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        showApp();
      });
    } else {
      Swal.fire("Autentikasi Gagal", data.detail || "Nama pengguna atau kata sandi tidak valid.", "error");
    }
  } catch (e) {
    Swal.fire("Kesalahan Server", "Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi.", "error");
  }
}

async function handleRegister() {
  const u = document.getElementById("reg-username").value;
  const p = document.getElementById("reg-password").value;

  if (!u || !p) return Swal.fire("Perhatian", "Mohon lengkapi seluruh formulir pendaftaran.", "warning");

  let formData = new URLSearchParams();
  formData.append("username", u);
  formData.append("password", p);

  try {
    let res = await fetch("/register", { method: "POST", body: formData });
    let data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil",
        text: "Akun Anda telah berhasil dibuat. Silakan masuk untuk melanjutkan.",
      }).then(() => {
        switchTab("login");
        document.getElementById("login-username").value = u;
        document.getElementById("reg-username").value = "";
        document.getElementById("reg-password").value = "";
      });
    } else {
      Swal.fire("Pendaftaran Gagal", data.detail, "error");
    }
  } catch (e) {
    Swal.fire("Kesalahan Server", "Tidak dapat terhubung ke server.", "error");
  }
}

// --- Inventory Management (CRUD) ---

async function loadItems() {
  let res = await fetch("/items", { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    Swal.fire("Sesi Berakhir", "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.", "warning").then(() => {
      localStorage.removeItem("token");
      window.location.reload();
    });
    return;
  }

  let items = await res.json();
  let html = "";

  let totalStokMamen = 0;
  let totalNilaiAsetMamen = 0;

  if (items.length === 0) {
    html = `<tr><td colspan="4" class="p-6 text-center text-gray-500 italic font-medium">Belum ada data barang di dalam sistem. Silakan tambahkan data baru.</td></tr>`;
  } else {
    items.forEach((item) => {
      totalStokMamen += item.qty;
      totalNilaiAsetMamen += item.qty * item.price;

      html += `
        <tr class="item-row hover:bg-gray-750 transition-colors">
            <td class="p-4 font-semibold text-white item-name">${item.name}</td>
            <td class="p-4">${item.qty} Unit</td>
            <td class="p-4 text-green-400 font-medium">Rp ${item.price.toLocaleString("id-ID")}</td>
            <td class="p-4 flex gap-2 justify-center">
                <button onclick="editItem(${item.id}, '${item.name}', ${item.qty}, ${item.price})" class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95">Ubah</button>
                <button onclick="deleteItem(${item.id})" class="bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-red-500/30 transition-all active:scale-95">Hapus</button>
            </td>
        </tr>`;
    });
  }
  document.getElementById("item-table-body").innerHTML = html;
  document.getElementById("total-stok").innerText = `${totalStokMamen} Unit`;
  document.getElementById("total-aset").innerText = `Rp ${totalNilaiAsetMamen.toLocaleString("id-ID")}`;
}

async function addItem() {
  const name = document.getElementById("item-name").value;
  const qty = document.getElementById("item-qty").value;
  const price = document.getElementById("item-price").value;

  if (!name || !qty || !price) {
    return Swal.fire("Perhatian", "Mohon lengkapi semua atribut barang.", "warning");
  }

  let formData = new URLSearchParams();
  formData.append("name", name);
  formData.append("qty", qty);
  formData.append("price", price);

  let res = await fetch("/items", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (res.ok) {
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data barang berhasil ditambahkan ke dalam sistem.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });

    document.getElementById("item-name").value = "";
    document.getElementById("item-qty").value = "";
    document.getElementById("item-price").value = "";

    loadItems();
  } else {
    let data = await res.json();
    Swal.fire("Kesalahan Sistem", JSON.stringify(data), "error");
  }
}

async function editItem(id, currentName, currentQty, currentPrice) {
  const { value: formValues } = await Swal.fire({
    title: "Perbarui Data Barang",
    html:
      `<input id="swal-name" class="swal2-input" placeholder="Nama Barang" value="${currentName}">` +
      `<input id="swal-qty" type="number" class="swal2-input" placeholder="Kuantitas (Unit)" value="${currentQty}">` +
      `<input id="swal-price" type="number" class="swal2-input" placeholder="Harga" value="${currentPrice}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Perbarui",
    cancelButtonText: "Batal",
    preConfirm: () => {
      return {
        name: document.getElementById("swal-name").value,
        qty: document.getElementById("swal-qty").value,
        price: document.getElementById("swal-price").value,
      };
    },
  });

  if (formValues) {
    handleUpdateItem(id, formValues.name, formValues.qty, formValues.price);
  }
}

async function handleUpdateItem(id, name, qty, price) {
  let formData = new URLSearchParams();
  formData.append("name", name);
  formData.append("qty", qty);
  formData.append("price", price);

  const res = await fetch(`/items/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (res.ok) {
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data inventaris telah diperbarui.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
    loadItems();
  } else {
    Swal.fire("Gagal", "Gagal memperbarui data barang.", "error");
  }
}

async function deleteItem(id) {
  Swal.fire({
    title: "Konfirmasi Penghapusan",
    text: "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, Hapus Data",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let res = await fetch(`/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        Swal.fire("Data Terhapus", "Data barang telah dihapus secara permanen dari sistem.", "success");
        loadItems();
      }
    }
  });
}

// --- Utility Functions ---

function filterItems() {
  const keyword = document.getElementById("search-input").value.toLowerCase();
  const rows = document.querySelectorAll(".item-row");

  rows.forEach((row) => {
    const itemName = row.querySelector(".item-name").innerText.toLowerCase();

    if (itemName.includes(keyword)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

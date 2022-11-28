import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import {
  getStorage,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";

// Get Element
const tbody = document.getElementById('tabel_patroli');
const tglPenemuan = document.getElementById('tglPenemuan');
const waktuDitemukan = document.getElementById('waktuDitemukan');
const tglPeneluran = document.getElementById('tglPeneluran');
const perkiraanTglPeneluran = document.getElementById('perkiraanTglPeneluran');
const inputKetebalanPenutup = document.getElementById('inputKetebalanPenutup');
const inputKedalamanDasar = document.getElementById('inputKedalamanDasar');
const inputJumlahTelur = document.getElementById('inputJumlahTelur');
const inputJenisPenyu01 = document.getElementById('inputJenisPenyu01');
const inputTelurBaik = document.getElementById('inputTelurBaik');
const inputTelurRusak = document.getElementById('inputTelurRusak');
const inputTelurMati = document.getElementById('inputTelurMati');
const inputTelurAbnormal = document.getElementById('inputTelurAbnormal');

// Get Element for set
const addPatroli = document.getElementById('add-btn');

const firebaseConfig = {
    apiKey: 'AIzaSyAFKEQHQFce3ySGF-iuMxSLOJtWtPbj7KE',
    authDomain: 'situkik-2e007.firebaseapp.com',
    projectId: 'situkik-2e007',
    storageBucket: 'situkik-2e007.appspot.com',
    messagingSenderId: '817452762071',
    appId: '1:817452762071:web:a21345c9de3307f628c192',
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Add Data
async function addData(e) {
  e.preventDefault();

  const newPatroli = {
    tglPenemuan: tglPenemuan.value,
    waktuDitemukan: waktuDitemukan.value,
    tglPeneluran: tglPeneluran.value,
    perkiraanTglPeneluran: perkiraanTglPeneluran.value,
    inputKetebalanPenutup: inputKetebalanPenutup.value,
    inputKedalamanDasar: inputKedalamanDasar.value,
    inputJumlahTelur: inputJumlahTelur.value,
    inputJenisPenyu01: inputJenisPenyu01.value,
    inputTelurBaik: inputTelurBaik.value,
    inputTelurRusak: inputTelurRusak.value,
    inputTelurMati: inputTelurMati.value,
    inputTelurAbnormal: inputTelurAbnormal.value,
  };

  try {
    const docRef = await addDoc(collection(db, 'patroli'), newPatroli);
    Swal.fire('Sukses', 'Data berhasil ditambahkan', 'success');

    tglPenemuan.value = '';
    waktuDitemukan.value = '';
    tglPeneluran.value = '';
    perkiraanTglPeneluran.value = '';
    inputKetebalanPenutup.value = '';
    inputKedalamanDasar.value = '';
    inputJumlahTelur.value = '';
    inputJenisPenyu01.value = '';
    inputTelurBaik.value = '';
    inputTelurRusak.value = '';
    inputTelurMati.value = '';
    inputTelurAbnormal.value = '';
  } catch (e) {
    console.error('Error adding document: ', e);
    Swal.fire('Error', e, 'error');
  }
}

// Read Data
const unsubscribe = onSnapshot(collection(db, 'patroli'), (querySnapshot) => {
  let table = '';
  let no = 1;

  querySnapshot.forEach((doc) => {
    table += `
        <tr>
          <th scope="row" class="text-center">${no}</th>
          <td>${doc.data().tglPenemuan}</td>
          <td class="text-center">${doc.data().waktuDitemukan}</td>
          <td class="text-center">${doc.data().tglPeneluran}</td>
          <td class="text-center">${doc.data().perkiraanTglPeneluran}</td>
          <td class="text-center">
            <button type="button" class="btn btn-danger delete-btn" id=${
  doc.id}>Delete</button>
          </td>
        </tr>
    `;

    // eslint-disable-next-line no-plusplus
    no++;
  });

  tbody.innerHTML = table;
  const deleteButton = document.querySelectorAll('.delete-btn');
  deleteButton.forEach((deleteBtn) => {
    // eslint-disable-next-line no-use-before-define
    deleteBtn.addEventListener('click', removeData);
  });
});

// Delete Data
const removeData = async (e) => {
  const { id } = e.target;

  // Delete data collection
  await deleteDoc(doc(db, 'patroli', id));
  Swal.fire('Sukses', 'Data berhasil dihapus', 'success');
};

// Event Listener
addPatroli.addEventListener('submit', addData);

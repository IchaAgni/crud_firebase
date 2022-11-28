import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";

// Get Element
const tbody = document.getElementById("tbody");
const nama = document.getElementById("nama");
const nisn = document.getElementById("nisn");
const nipd = document.getElementById("nipd");
const jk = document.getElementById("jk");
const tempatLahir = document.getElementById("tempat-lahir");
const tanggalLahir = document.getElementById("tanggal-lahir");
const alamat = document.getElementById("alamat");
const kelas = document.getElementById("kelas");
const grade = document.getElementById("grade");
const angkatan = document.getElementById("angkatan");
const peminatan = document.getElementById("peminatan");
const club = document.getElementById("club");
const urlFoto = document.getElementById("foto");

// Get Element for set
const addStudent = document.getElementById("addStudent");
const prevFoto = document.getElementById("prev-foto-input");

const updateNama = document.getElementById("update-nama");
const updateNisn = document.getElementById("update-nisn");
const updateNipd = document.getElementById("update-nipd");
const updateJk = document.getElementById("update-jk");
const updateTempatLahir = document.getElementById("update-tempat-lahir");
const updateTanggalLahir = document.getElementById("update-tanggal-lahir");
const updateAlamat = document.getElementById("update-alamat");
const updateKelas = document.getElementById("update-kelas");
const updateGrade = document.getElementById("update-grade");
const updateAngkatan = document.getElementById("update-angkatan");
const updatePeminatan = document.getElementById("update-peminatan");
const updateClub = document.getElementById("update-club");

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

let fileImg = {};
// For Add data
urlFoto.addEventListener("change", (e) => {
  fileImg = e.target.files[0];
});

// For Update data
prevFoto.addEventListener("change", async (e) => {
  fileImg = e.target.files[0];

  const prevFoto = document.getElementById("prev-foto");
  const urlFoto = prevFoto.getAttribute("alt");

  await uploadBytes(ref(storage, urlFoto), fileImg).then(() => {
    console.log("Uploaded a blob or file!");
  });

  await getDownloadURL(ref(storage, urlFoto)).then((url) => {
    console.log(url);
    const prevFoto = document.getElementById("prev-foto");
    prevFoto.setAttribute("src", url);
  });
});

// Add Data
const addData = async (e) => {
  e.preventDefault();

  const fileImgName = Date.now();
  uploadBytes(ref(storage, `foto-siswa/${fileImgName}`), fileImg).then(() => {
    console.log("Uploaded a blob or file!");
  });

  let newStudent = {
    nama: nama.value,
    nisn: nisn.value,
    nipd: nipd.value,
    jk: jk.value,
    tempatLahir: tempatLahir.value,
    tanggalLahir: tanggalLahir.value,
    alamat: alamat.value,
    kelas: kelas.value,
    grade: grade.value,
    angkatan: angkatan.value,
    peminatan: peminatan.value,
    club: club.value,
    urlFoto: `foto-siswa/${fileImgName}`,
  };

  try {
    const docRef = await addDoc(collection(db, "siswa"), newStudent);
    Swal.fire("Sukses", "Data berhasil ditambahkan", "success");

    nama.value = "";
    nisn.value = "";
    nipd.value = "";
    jk.value = "";
    tempatLahir.value = "";
    tanggalLahir.value = "";
    alamat.value = "";
    kelas.value = "";
    grade.value = "";
    angkatan.value = "";
    peminatan.value = "";
    club.value = "";
    urlFoto.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
    Swal.fire("Error", e, "error");
  }
};

// Read Data
const unsubscribe = onSnapshot(collection(db, "siswa"), (querySnapshot) => {
  let table = "";
  let no = 1;

  querySnapshot.forEach((doc) => {
    table += `
        <tr>
          <th scope="row" class="text-center">${no}</th>
          <td>${doc.data().nama}</td>
          <td class="text-center">${doc.data().nisn}</td>
          <td class="text-center">${doc.data().kelas}</td>
          <td class="text-center">${doc.data().grade}</td>
          <td class="text-center">
            <button type="button" class="btn btn-success view-btn" data-bs-toggle="modal" data-bs-target="#modalViewData" id=${
              doc.id
            }>Details</button>
            <button type="button" class="btn btn-primary update-btn" data-bs-toggle="modal" data-bs-target="#modalUpdateData" id=${
              doc.id
            }>Update</button>
            <button type="button" class="btn btn-danger delete-btn" id=${
              doc.id
            }>Delete</button>
          </td>
        </tr>
    `;

    no++;
  });

  tbody.innerHTML = table;
  const deleteButton = document.querySelectorAll(".delete-btn");
  deleteButton.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", removeData);
  });
  const updateButton = document.querySelectorAll(".update-btn");
  updateButton.forEach((updateBtn) => {
    updateBtn.addEventListener("click", updateData);
  });
  const detailButton = document.querySelectorAll(".view-btn");
  detailButton.forEach((detailBtn) => {
    detailBtn.addEventListener("click", viewData);
  });
});

// View One Data
const viewData = async (e) => {
  const id = e.target.id;

  const docSnap = await getDoc(doc(db, "siswa", id));

  if (docSnap.exists()) {
    // get element view
    getDownloadURL(ref(storage, docSnap.data().urlFoto)).then((url) => {
      console.log(url);
      const viewUrlFoto = document.getElementById("viewUrlFoto");
      viewUrlFoto.setAttribute("src", url);
    });

    document.getElementById("viewNama").innerHTML = docSnap.data().nama;
    document.getElementById("viewNisn").innerHTML = docSnap.data().nisn;
    document.getElementById("viewNipd").innerHTML = docSnap.data().nipd;
    document.getElementById("viewJk").innerHTML =
      docSnap.data().jk == "p" ? "Pria" : "Wanita";
    document.getElementById("viewTempatLahir").innerHTML =
      docSnap.data().tempatLahir;
    document.getElementById("viewTanggalLahir").innerHTML =
      docSnap.data().tanggalLahir;
    document.getElementById("viewAlamat").innerHTML = docSnap.data().alamat;
    document.getElementById("viewKelas").innerHTML = docSnap.data().kelas;
    document.getElementById("viewGrade").innerHTML = docSnap.data().grade;
    document.getElementById("viewAngkatan").innerHTML = docSnap.data().angkatan;
    document.getElementById("viewPeminatan").innerHTML =
      docSnap.data().peminatan;
    document.getElementById("viewClub").innerHTML = docSnap.data().club;
  } else {
    console.log("No such document!");
  }
};

// Delete Data
const removeData = async (e) => {
  const id = e.target.id;

  // Delete image from storage
  const docSnap = await getDoc(doc(db, "siswa", id));

  if (docSnap.exists()) {
    await deleteObject(ref(storage, docSnap.data().urlFoto));
  }

  // Delete data collection
  await deleteDoc(doc(db, "siswa", id));
  Swal.fire("Sukses", "Data berhasil dihapus", "success");
};

// Update Data
const updateData = async (e) => {
  const id = e.target.id;

  // get data
  const docSnap = await getDoc(doc(db, "siswa", id));

  if (docSnap.exists()) {
    updateNama.value = docSnap.data().nama;
    updateNisn.value = docSnap.data().nisn;
    updateNipd.value = docSnap.data().nipd;
    updateJk.value = docSnap.data().jk;
    updateTempatLahir.value = docSnap.data().tempatLahir;
    updateTanggalLahir.value = docSnap.data().tanggalLahir;
    updateAlamat.value = docSnap.data().alamat;
    updateKelas.value = docSnap.data().kelas;
    updateGrade.value = docSnap.data().grade;
    updateAngkatan.value = docSnap.data().angkatan;
    updatePeminatan.value = docSnap.data().peminatan;
    updateClub.value = docSnap.data().club;

    getDownloadURL(ref(storage, docSnap.data().urlFoto)).then((url) => {
      console.log(url);
      const prevFoto = document.getElementById("prev-foto");
      prevFoto.setAttribute("src", url);
      prevFoto.setAttribute("alt", docSnap.data().urlFoto);
    });

    const updateStudent = document.querySelector(".updateBtn");
    updateStudent.addEventListener("click", simpanUpdateData);
    updateStudent.setAttribute("id", id);
  } else {
    console.log("No such document!");
  }
};

// save update data
const simpanUpdateData = async (e) => {
  const id = e.target.id;
  let updateStudent = {
    nama: updateNama.value,
    nisn: updateNisn.value,
    nipd: updateNipd.value,
    jk: updateJk.value,
    tempatLahir: updateTempatLahir.value,
    tanggalLahir: updateTanggalLahir.value,
    alamat: updateAlamat.value,
    kelas: updateKelas.value,
    grade: updateGrade.value,
    angkatan: updateAngkatan.value,
    peminatan: updatePeminatan.value,
    club: updateClub.value,
  };

  await updateDoc(doc(db, "siswa", id), updateStudent);
  Swal.fire("Sukses", "Data berhasil diupdate", "success");
};

// Event Listener
addStudent.addEventListener("submit", addData);
document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    saveToHistory(query);
    const googleSearchURL = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    window.open(googleSearchURL, '_blank');
  }
});

document.getElementById('clearBtn').addEventListener('click', () => {
  localStorage.clear();
  loadDefaultImages();
  renderSavedImages();
  renderTrash();
});

document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!history.includes(query)) {
    history.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }
}

function saveImage(url, name) {
  let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
  savedImages.push({ url, name });
  localStorage.setItem('savedImages', JSON.stringify(savedImages));
  renderSavedImages();
}

function renderSavedImages() {
  const grid = document.getElementById('gridContainer');
  grid.innerHTML = '';
  const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];

  savedImages.forEach(({ url, name }, index) => {
    const container = document.createElement('div');
    container.classList.add('image-tile');

    const img = document.createElement('img');
    img.src = url;
    img.alt = name;
    img.title = name;
    img.addEventListener('click', () => showPreview(url, name));

    const caption = document.createElement('p');
    caption.textContent = name;

    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteImage(index));

    container.appendChild(img);
    container.appendChild(caption);
    container.appendChild(deleteBtn);
    grid.appendChild(container);
  });
}

function deleteImage(index) {
  let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
  let trashImages = JSON.parse(localStorage.getItem('trashImages')) || [];

  const removed = savedImages.splice(index, 1)[0];
  trashImages.push(removed);

  localStorage.setItem('savedImages', JSON.stringify(savedImages));
  localStorage.setItem('trashImages', JSON.stringify(trashImages));
  renderSavedImages();
  renderTrash();
}

function renderTrash() {
  const trashSection = document.getElementById('trashContainer');
  trashSection.innerHTML = '';
  const trashImages = JSON.parse(localStorage.getItem('trashImages')) || [];

  trashImages.forEach(({ url, name }, index) => {
    const container = document.createElement('div');
    container.classList.add('image-tile');

    const img = document.createElement('img');
    img.src = url;
    img.alt = name;
    img.title = name;

    const caption = document.createElement('p');
    caption.textContent = name;

    const restoreBtn = document.createElement('span');
    restoreBtn.textContent = '↩️';
    restoreBtn.classList.add('restore-btn');
    restoreBtn.addEventListener('click', () => restoreImage(index));

    container.appendChild(img);
    container.appendChild(caption);
    container.appendChild(restoreBtn);
    trashSection.appendChild(container);
  });
}

function restoreImage(index) {
  let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
  let trashImages = JSON.parse(localStorage.getItem('trashImages')) || [];

  const restored = trashImages.splice(index, 1)[0];
  savedImages.push(restored);

  localStorage.setItem('savedImages', JSON.stringify(savedImages));
  localStorage.setItem('trashImages', JSON.stringify(trashImages));
  renderSavedImages();
  renderTrash();
}

function loadDefaultImages() {
  const defaultImages = [
    { url: "images/beach.jpg", name: "Beach" },
    { url: "images/flowers.jpg", name: "Flowers" },
    { url: "images/forest.jpg", name: "Forest" },
    { url: "images/lake.jpg", name: "Lake" },
    { url: "images/mountains.jpg", name: "Mountains" },
    { url: "images/river.jpg", name: "River" },
    { url: "images/sunset.jpg", name: "Sunset" },
    { url: "images/trees.jpg", name: "Trees" },
    { url: "images/waterfall.jpg", name: "Waterfall" }
  ];

  if (!localStorage.getItem('defaultLoaded')) {
    localStorage.setItem('savedImages', JSON.stringify(defaultImages));
    localStorage.setItem('defaultLoaded', 'true');
  }
}

document.getElementById('saveImageBtn').addEventListener('click', () => {
  const urlInput = document.getElementById('imageUrl').value.trim();
  const name = document.getElementById('imageName').value.trim();
  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];

  if (name && file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64URL = e.target.result;
      saveImage(base64URL, name);
      closeSaveModal();
    };
    reader.readAsDataURL(file);
  } else if (name && urlInput && isImageURL(urlInput)) {
    saveImage(urlInput, name);
    closeSaveModal();
  } else {
    alert("Please enter a name and either upload a file or enter a valid image URL ending in .jpg, .png, etc.");
  }
});

function isImageURL(url) {
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
}

function closeSaveModal() {
  document.getElementById('imageUrl').value = '';
  document.getElementById('imageName').value = '';
  document.getElementById('imageUpload').value = '';
  document.getElementById('saveModal').style.display = 'none';
}

const modal = document.getElementById('saveModal');
const openModalBtn = document.createElement('button');
openModalBtn.textContent = 'Save New Image';
openModalBtn.style.margin = '1rem';
document.body.insertBefore(openModalBtn, document.getElementById('savedImages'));
openModalBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});
document.querySelector('.close-btn').addEventListener('click', () => {
  modal.style.display = 'none';
});

const previewModal = document.getElementById('previewModal');
const previewImg = document.getElementById('previewImg');
const previewCaption = document.getElementById('previewCaption');

function showPreview(url, caption) {
  previewImg.src = url;
  previewCaption.textContent = caption;
  previewModal.style.display = 'flex';
}

document.querySelector('.close-preview').addEventListener('click', () => {
  previewModal.style.display = 'none';
});

window.addEventListener('load', () => {
  loadDefaultImages();
  renderSavedImages();
  renderTrash();
});

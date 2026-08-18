const form = document.getElementById('generate-form');
const promptInput = document.getElementById('prompt');
const styleSelect = document.getElementById('style-select');
const generateBtn = document.getElementById('generate-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const result = document.getElementById('result');
const generatedImage = document.getElementById('generated-image');
const downloadBtn = document.getElementById('download-btn');

const HISTORY_KEY = 'imageHistory';
const HISTORY_LIMIT = 12;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMessage.classList.add('hidden');
    result.classList.add('hidden');
    downloadBtn.classList.add('hidden');
    loading.classList.remove('hidden');
    generateBtn.disabled = true;

    const formData = new FormData();
    formData.append('prompt', promptInput.value);
    formData.append('style', styleSelect.value);

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        await preloadImage(data.image);

        generatedImage.src = data.image;
        downloadBtn.dataset.imageUrl = data.image;
        result.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');

        addToHistory(data.image, promptInput.value);

    } catch (err) {
        errorMessage.textContent = err.message;
        errorMessage.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
        generateBtn.disabled = false;
    }
});

downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const imageUrl = downloadBtn.dataset.imageUrl;
    if (!imageUrl) return;

    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'generated-image.png';
        link.click();

        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        errorMessage.textContent = 'Failed to download image';
        errorMessage.classList.remove('hidden');
    }
});

function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = () => reject(new Error('Image failed to load'));
        img.src = url;
    });
}

const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const historyGrid = document.getElementById('history-grid');
const historyEmpty = document.getElementById('history-empty');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const toggleHistoryBtn = document.getElementById('toggle-history-btn');

const HISTORY_PREVIEW_COUNT = 3;

function getHistory() {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(imageUrl, prompt) {
    const history = getHistory();
    history.unshift({ id: Date.now(), image: imageUrl, prompt });

    if (history.length > HISTORY_LIMIT) {
        history.length = HISTORY_LIMIT;
    }

    saveHistory(history);
    renderHistory();
}

function deleteFromHistory(id) {
    const history = getHistory().filter(item => item.id !== id);
    saveHistory(history);
    renderHistory();

    if (!galleryModal.classList.contains('hidden')) {
        openGallery();
    }
}

function selectImage(item) {
    generatedImage.src = item.image;
    downloadBtn.dataset.imageUrl = item.image;
    promptInput.value = item.prompt;
    result.classList.remove('hidden');
    downloadBtn.classList.remove('hidden');
}

function buildHistoryCard(item) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.title = item.prompt;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'history-delete';
    deleteBtn.type = 'button';
    deleteBtn.title = 'Remove this image';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteFromHistory(item.id);
    });

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.prompt;

    const caption = document.createElement('span');
    caption.className = 'history-caption';
    caption.textContent = item.prompt;

    div.appendChild(deleteBtn);
    div.appendChild(img);
    div.appendChild(caption);

    div.addEventListener('click', () => selectImage(item));

    return div;
}

function renderHistory() {
    const history = getHistory();
    historyGrid.innerHTML = '';

    if (history.length === 0) {
        historyEmpty.classList.remove('hidden');
        toggleHistoryBtn.classList.add('hidden');
        return;
    }

    historyEmpty.classList.add('hidden');

    history.slice(0, HISTORY_PREVIEW_COUNT).forEach(item => {
        historyGrid.appendChild(buildHistoryCard(item));
    });

    if (history.length > HISTORY_PREVIEW_COUNT) {
        toggleHistoryBtn.classList.remove('hidden');
    } else {
        toggleHistoryBtn.classList.add('hidden');
    }
}

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
});

// ---------- full gallery modal ----------

const galleryModal = document.getElementById('gallery-modal');
const galleryGrid = document.getElementById('gallery-grid');
const closeGalleryBtn = document.getElementById('close-gallery-btn');
const modalBackdrop = galleryModal.querySelector('.modal-backdrop');

function openGallery() {
    const history = getHistory();
    galleryGrid.innerHTML = '';

    history.forEach(item => {
        const card = buildHistoryCard(item);
        galleryGrid.appendChild(card);
    });

    galleryModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    galleryModal.classList.add('hidden');
    document.body.style.overflow = '';
}

toggleHistoryBtn.addEventListener('click', openGallery);
closeGalleryBtn.addEventListener('click', closeGallery);
modalBackdrop.addEventListener('click', closeGallery);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !galleryModal.classList.contains('hidden')) {
        closeGallery();
    }
});

renderHistory();
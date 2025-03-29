console.log("Firebase SDK Loaded?", typeof firebase !== "undefined");
console.log("Firebase App:", firebase?.app?.());
console.log("Firestore:", firebase?.firestore?.());
const firebaseConfig = {
    apiKey: "AIzaSyAkCNwFrxwzknWTehVCTqkL6Xbj7qHDaA4",
    authDomain: "bookmark-70990.firebaseapp.com",
    projectId: "bookmark-70990",
    storageBucket: "bookmark-70990.firebasestorage.app",
    messagingSenderId: "55612692639",
    appId: "1:55612692639:web:dff5b96802261fa1026aaa"
  };
  


const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to load bookmarks from Firestore
async function loadBookmarks() {
    const bookmarks = { work: [], social: [], entertainment: [] };
    const snapshot = await db.collection("bookmarks").get();
    snapshot.forEach(doc => {
        const data = doc.data();
        bookmarks[data.category].push({ name: data.name, url: data.url, id: doc.id });
    });
    renderBookmarks(bookmarks);
}

// Function to render bookmarks
function renderBookmarks(bookmarks) {
    document.querySelectorAll('.category-block').forEach(block => {
        const category = block.dataset.category;
        const container = block.querySelector('.category-content');
        container.innerHTML = bookmarks[category].map(bookmark => `
            <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-md border border-gray-200 hover:shadow-lg transition">
                <div>
                    <a href="${bookmark.url}" target="_blank" class="text-blue-600 text-lg font-medium hover:underline">${bookmark.name}</a>
                </div>
                <button onclick="removeBookmark('${bookmark.id}')" class="text-red-500 hover:text-red-600 transition">
                    <i class="ri-delete-bin-line text-xl"></i>
                </button>
            </div>
        `).join('');
    });
}

// Add Bookmark
document.getElementById('bookmark-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBookmark = {
        name: formData.get('name'),
        url: formData.get('url'),
        category: formData.get('category')
    };
    await db.collection("bookmarks").add(newBookmark);
    loadBookmarks(); // Reload from Firestore
    closeModal();
});

// Remove Bookmark
async function removeBookmark(id) {
    await db.collection("bookmarks").doc(id).delete();
    loadBookmarks();
}

// Load bookmarks on page load
document.addEventListener("DOMContentLoaded", loadBookmarks);

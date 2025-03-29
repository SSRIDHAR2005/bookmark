console.log("Firebase SDK Loaded?", typeof firebase !== "undefined");

// ✅ Firebase Configuration (Fixed)
const firebaseConfig = {
    apiKey: "AIzaSyAkCNwFrxwzknWTehVCTqkL6Xbj7qHDaA4",
    authDomain: "bookmark-70990.firebaseapp.com",
    projectId: "bookmark-70990",
    storageBucket: "bookmark-70990.appspot.com",  // ✅ Fixed
    messagingSenderId: "55612692639",
    appId: "1:55612692639:web:dff5b96802261fa1026aaa"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Check Firebase Initialization
console.log("Firebase App:", firebase.app());
console.log("Firestore:", firebase.firestore());

// ✅ Load Bookmarks from Firestore
async function loadBookmarks() {
    console.log("Loading bookmarks from Firestore...");
    const bookmarks = { work: [], social: [], entertainment: [] };

    try {
        const snapshot = await db.collection("bookmarks").get();
        snapshot.forEach(doc => {
            const data = doc.data();
            bookmarks[data.category].push({ name: data.name, url: data.url, id: doc.id });
        });
        renderBookmarks(bookmarks);
    } catch (error) {
        console.error("Error loading bookmarks:", error);
    }
}

// ✅ Render Bookmarks to the UI
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

// ✅ Add Bookmark to Firestore
document.getElementById('bookmark-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBookmark = {
        name: formData.get('name'),
        url: formData.get('url'),
        category: formData.get('category')
    };

    try {
        await db.collection("bookmarks").add(newBookmark);
        console.log("Bookmark added:", newBookmark);
        loadBookmarks();  // Reload bookmarks after adding
        closeModal();
    } catch (error) {
        console.error("Error adding bookmark:", error);
    }
});

// ✅ Remove Bookmark from Firestore
async function removeBookmark(id) {
    try {
        await db.collection("bookmarks").doc(id).delete();
        console.log("Bookmark deleted:", id);
        loadBookmarks();  // Reload bookmarks after deletion
    } catch (error) {
        console.error("Error deleting bookmark:", error);
    }
}

// ✅ Close Modal
function closeModal() {
    document.getElementById('bookmark-modal').classList.add('hidden');
    document.getElementById('bookmark-form').reset();
}

// ✅ Load bookmarks on page load
document.addEventListener("DOMContentLoaded", loadBookmarks);

// ✅ Check if Firebase is Available
if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded. Check your script order.");
} else {
    console.log("Firebase SDK loaded successfully.");
}

const db = firebase.firestore();

// ✅ Open Modal
document.getElementById('add-bookmark-btn').addEventListener('click', () => {
    console.log("Add Bookmark button clicked");
    document.getElementById('bookmark-modal').classList.remove('hidden');
});

// ✅ Close Modal
function closeModal() {
    document.getElementById('bookmark-modal').classList.add('hidden');
    document.getElementById('bookmark-form').reset();
}
window.closeModal = closeModal;  // Ensure function is accessible

// ✅ Load Bookmarks
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

// ✅ Render Bookmarks
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

// ✅ Add Bookmark
document.getElementById('bookmark-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");

    const formData = new FormData(e.target);
    const newBookmark = {
        name: formData.get('name'),
        url: formData.get('url'),
        category: formData.get('category')
    };

    try {
        await db.collection("bookmarks").add(newBookmark);
        console.log("Bookmark added:", newBookmark);
        loadBookmarks();
        closeModal();
    } catch (error) {
        console.error("Error adding bookmark:", error);
    }
});

// ✅ Remove Bookmark
async function removeBookmark(id) {
    try {
        await db.collection("bookmarks").doc(id).delete();
        console.log("Bookmark deleted:", id);
        loadBookmarks();
    } catch (error) {
        console.error("Error deleting bookmark:", error);
    }
}
window.removeBookmark = removeBookmark;  // Ensure function is accessible

// ✅ Load bookmarks on page load
document.addEventListener("DOMContentLoaded", loadBookmarks);

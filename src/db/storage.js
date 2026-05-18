const DB_NAME = "job-app-tracker"
const STORE_NAME = "sqlite"
const KEY = "database"

function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
        request.onsuccess = () => {
            resolve(request.result)
        }
        request.onerror = () => {
            reject(request.error)
        }
    })
}

export async function loadDatabase() {
    const db = await openIndexedDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly")
        const store = tx.objectStore(STORE_NAME)
        const request = store.get(KEY)
        request.onsuccess = () => {
            resolve(request.result || null)
        }
        request.onerror = () => {
            reject(request.error)
        }
    })
}

export async function saveDatabase(uint8Array) {
    const db = await openIndexedDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite")
        const store = tx.objectStore(STORE_NAME)
        store.put(uint8Array, KEY)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
    })
}